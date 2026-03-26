import { useState } from "react";
import { createTask } from "../api";

export default function TasksCreateModal({ onClose }) {

  // =========================
  // Form State
  // =========================

  const [form, setForm] = useState({
    title: "",
    description: "",
    eta_at: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // Handlers
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        eta_at: form.eta_at
          ? new Date(form.eta_at).toISOString()
          : null,
      };

      await createTask(payload);

      // 🔥 cerrar modal + refrescar en padre
      onClose?.();

    } catch (err) {
      alert(err.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* TITLE */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Title *
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 bg-slate-800 text-white rounded"
          />
        </div>

        {/* ETA */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            ETA (Estimated Completion)
          </label>

          <input
            type="datetime-local"
            name="eta_at"
            value={form.eta_at}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 text-white rounded"
          />
        </div>

      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 bg-slate-800 text-white rounded"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-2">

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm border border-slate-600 rounded-md hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-indigo-600 rounded-md disabled:opacity-50 hover:bg-indigo-500"
        >
          {loading ? "Saving..." : "Create Task"}
        </button>

      </div>
    </form>
  );
}