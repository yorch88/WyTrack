import { useEffect, useState } from "react";
import { getTickets } from "./api";
import TicketsTable from "./TicketsTable";
import CreateTicketModal from "./CreateTicketModal";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Tickets</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 px-4 py-2 rounded"
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

      {/* MODAL */}
      {showModal && (
        <CreateTicketModal
          onClose={() => setShowModal(false)}
          onCreated={(newTicket) =>
            setTickets((prev) => [newTicket, ...prev])
          }
        />
      )}
    </div>
  );
}