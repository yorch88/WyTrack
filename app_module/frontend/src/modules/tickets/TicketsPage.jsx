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

  async function loadTickets() {
    const data = await getTickets(filters);
    setTickets(data);
  }

  useEffect(() => {
    loadTickets();
  }, [filters]);

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
          <option value="high">High</option>
        </select>

      </div>

      {/* TABLE */}
      <TicketsTable
        tickets={tickets}
        onSelect={(t) => console.log("open ticket", t)}
      />

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