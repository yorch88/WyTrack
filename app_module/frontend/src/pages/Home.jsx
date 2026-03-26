import { useNavigate } from "react-router-dom";
import LogoutButton from "../modules/shared/LogoutButton";

export default function Home() {
  const navigate = useNavigate();

  function go(path) {
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center gap-6">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <LogoutButton />
      </header>

      <h1 className="text-2xl font-semibold tracking-tight">
        Modular Operations System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">

        {/* INVENTORY */}
        <button
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition"
          onClick={() => go("/ticketspage")}
        >
          Tickets
        </button>

        {/* RECEIVING */}
        {/* <button
          className="bg-indigo-900/40 border border-indigo-700 rounded-xl p-6 hover:bg-indigo-800/40 transition"
          onClick={() => go("/receiving")}
        >
          Receiving Material
        </button> */}

        {/* TASKS */}
        <button
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition"
          onClick={() => go("/task/all")}
        >
          Tasks
        </button>

      </div>

    </div>
  );
}
