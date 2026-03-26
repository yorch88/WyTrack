import { useEffect, useState } from "react";
import { getTickets } from "./api";
import TicketsTable from "./TicketsTable";
import CreateTicketModal from "./CreateTicketModal";
import LogoutButton from "../shared/LogoutButton";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);

  // 🔥 MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const [loading, setLoading] = useState(false);

  async function loadTickets() {
    try {
      setLoading(true);

      const res = await getTickets({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      setTickets(res.data);

      setPagination((prev) => ({
        ...prev,
        total: res.pagination.total,
        pages: res.pagination.pages,
      }));
    } catch (err) {
      console.error("Error loading tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [filters, pagination.page]);

  // =========================
  // MODAL CONTROL
  // =========================
  function openModal() {
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 50);
  }

  function closeModal() {
    setAnimateModal(false);
    setTimeout(() => setShowModal(false), 300);
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <LogoutButton />

        <h1 className="text-2xl font-bold">Tickets</h1>

        <button
          onClick={openModal}
          className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500"
        >
          + New Ticket
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-4">
        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
          className="bg-slate-800 p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="in_progress">In Progress</option>
        </select>

        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, priority: e.target.value }))
          }
          className="bg-slate-800 p-2 rounded"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && <p>Loading tickets...</p>}

      {/* TABLE */}
      <TicketsTable
        tickets={tickets}
        onSelect={(t) => console.log("open ticket", t)}
      />

      {/* PAGINATION */}
      <div className="flex gap-3 mt-4">
        <button
          disabled={pagination.page === 1}
          onClick={() =>
            setPagination((p) => ({ ...p, page: p.page - 1 }))
          }
          className="bg-slate-700 px-3 py-1 rounded"
        >
          Prev
        </button>

        <span>
          Page {pagination.page} / {pagination.pages}
        </span>

        <button
          disabled={pagination.page >= pagination.pages}
          onClick={() =>
            setPagination((p) => ({ ...p, page: p.page + 1 }))
          }
          className="bg-slate-700 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>

      {/* ========================= */}
      {/* MODAL */}
      {/* ========================= */}
      {showModal && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-xl
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              animateModal
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold">
                Create Ticket
              </h2>

              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-6">
              <CreateTicketModal
                onClose={closeModal}
                onCreated={(newTicket) => {
                  setTickets((prev) => [newTicket, ...prev]);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}