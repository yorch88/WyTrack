import { useState, useEffect, useRef } from "react";
import { searchUsers } from "../modules/users/api";

function formatLevel(level) {
  if (!level) return "User";

  const map = {
    admin: "Admin",
    superadmin: "Super Admin",
    supervisor: "Supervisor",
    engineer: "Engineer",
    user: "User",
    viewer: "Viewer",
  };

  return map[level] || level;
}

export default function UserSelect({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef();

  // 🔎 SEARCH (debounce)
  useEffect(() => {
    if (!query) {
      setOptions([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const users = await searchUsers(query);
        setOptions(users);
        setOpen(true);
      } catch (err) {
        console.error(err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // 🖱️ CLICK OUTSIDE
  useEffect(() => {
    function handleClickOutside(e) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⌨️ KEYBOARD NAVIGATION
  function handleKeyDown(e) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : options.length - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (options[highlightIndex]) {
        handleSelect(options[highlightIndex]);
      }
    }
  }

  function handleSelect(user) {
    onChange(user.clock_id); // 👈 SOLO guarda ID
    setQuery(`${user.full_name} (${user.clock_id})`);
    setOpen(false);
    setHighlightIndex(-1);
  }

  return (
    <div className="relative" ref={containerRef}>

      {/* INPUT */}
      <input
        placeholder="Search by name or clock id..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(""); // reset selección
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full p-2 bg-slate-800 text-white rounded outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-30 w-full bg-slate-900 border border-slate-700 mt-1 rounded max-h-72 overflow-y-auto shadow-xl">

          {/* LOADING */}
          {loading && (
            <div className="p-3 text-sm text-gray-400">
              Searching...
            </div>
          )}

          {/* EMPTY */}
          {!loading && options.length === 0 && (
            <div className="p-3 text-sm text-gray-500">
              No users found
            </div>
          )}

          {/* RESULTS */}
          {options.map((u, index) => (
            <div
              key={u.clock_id}
              onClick={() => handleSelect(u)}
              className={`p-3 cursor-pointer border-b border-slate-800 transition
                ${index === highlightIndex ? "bg-slate-800" : "hover:bg-slate-800"}
              `}
            >
              {/* NAME */}
              <div className="text-sm font-semibold text-white">
                {u.full_name || "Unknown User"}
              </div>

              {/* META */}
              <div className="flex justify-between text-xs text-gray-400 mt-1">

                {/* ID */}
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-[2px] rounded">
                  ID {u.clock_id}
                </span>

                {/* AREA */}
                <span>
                  {u.area || "No area"}
                </span>

                {/* LEVEL */}
                <span className="text-indigo-400 font-medium">
                  {formatLevel(u.level)}
                </span>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}