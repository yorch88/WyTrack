import { useState } from "react";
import { createTicket } from "./api";
import UserSelect from "../../components/UserSelect";

export default function CreateTicketModal({ onClose, onCreated }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    reason: "manual",
    priority: "medium",
    assigned_to: "",
    email_subject: "",
    parent_ticket_id: "",
    estimated_close_at: "",
  });

  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!form.assigned_to) {
      alert("You must assign the ticket to a user");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        parent_ticket_id: form.parent_ticket_id || null,
        estimated_close_at: form.estimated_close_at || null,
        email_subject: form.email_subject || null,
      };

      const ticket = await createTicket(payload);

      onCreated(ticket);
      onClose();

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

      {/* LEFT */}
      <div className="space-y-4">

        <div>
          <label className="text-xs text-gray-400">Title *</label>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full p-2 bg-slate-800 text-white rounded mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full p-2 bg-slate-800 text-white rounded mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Assign to *</label>
          <UserSelect
            value={form.assigned_to}
            onChange={(val) => update("assigned_to", val)}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
            className="w-full p-2 bg-slate-800 text-white rounded mt-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

      </div>

      {/* RIGHT */}
      <div className="space-y-4">

        <div>
          <label className="text-xs text-gray-400">Email Reference</label>
          <input
            value={form.email_subject}
            onChange={(e) => update("email_subject", e.target.value)}
            className="w-full p-2 bg-slate-800 text-white rounded mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Parent Ticket</label>
          <input
            value={form.parent_ticket_id}
            onChange={(e) => update("parent_ticket_id", e.target.value)}
            className="w-full p-2 bg-slate-800 text-white rounded mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Estimated Close</label>
          <input
            type="datetime-local"
            value={form.estimated_close_at}
            onChange={(e) =>
              update("estimated_close_at", e.target.value)
            }
            className="w-full p-2 bg-slate-800 text-white rounded mt-1"
          />
        </div>

      </div>

      {/* ACTIONS */}
      <div className="col-span-2 flex justify-end gap-3 mt-2">

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-slate-600 rounded-md"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>

      </div>

    </form>
  );
}