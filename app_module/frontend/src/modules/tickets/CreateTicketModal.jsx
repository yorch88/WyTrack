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

    // 🚫 Validaciones
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
        assigned_to: form.assigned_to,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-4xl shadow-xl">

        <h2 className="text-white text-lg mb-4 font-semibold">
          Create Ticket
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {/* LEFT COLUMN */}
          <div className="space-y-4">

            {/* TITLE */}
            <div>
              <label className="text-xs text-gray-400">Title *</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full p-2 bg-slate-800 text-white rounded mt-1"
                placeholder="Short summary"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-xs text-gray-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="w-full p-2 bg-slate-800 text-white rounded mt-1"
              />
            </div>

            {/* USER */}
            <div>
              <label className="text-xs text-gray-400">
                Assign to * (search user)
              </label>

              <UserSelect
                value={form.assigned_to}
                onChange={(val) => update("assigned_to", val)}
              />
            </div>

            {/* PRIORITY */}
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

          {/* RIGHT COLUMN */}
          <div className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-xs text-gray-400">
                Email Reference
              </label>
              <input
                value={form.email_subject}
                onChange={(e) => update("email_subject", e.target.value)}
                className="w-full p-2 bg-slate-800 text-white rounded mt-1"
              />
            </div>

            {/* PARENT */}
            <div>
              <label className="text-xs text-gray-400">
                Parent Ticket
              </label>
              <input
                value={form.parent_ticket_id}
                onChange={(e) => update("parent_ticket_id", e.target.value)}
                className="w-full p-2 bg-slate-800 text-white rounded mt-1"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="text-xs text-gray-400">
                Estimated Close Date
              </label>
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

          {/* FULL WIDTH BUTTON */}
          <div className="col-span-2">
            <button
              disabled={loading}
              className="bg-indigo-600 w-full py-2 rounded text-white mt-2"
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>

        </form>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}