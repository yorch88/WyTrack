import { useEffect, useState } from "react";
import { getTasks, closeTask } from "../api";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../shared/LogoutButton";
import { formatMXTime } from "../../../utils/formatMXTime";
import TasksCreateModal from "./TasksCreateModal";

export default function TasksReports() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // =========================
  // MODAL STATE
  // =========================
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);

  // =========================
  // LOAD TASKS
  // =========================
  async function load() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // =========================
  // STATUS COLOR
  // =========================
  function getStatusColor(task) {
    if (task.status === "closed") {
      return "bg-green-600 text-white";
    }

    if (task.status === "open" && task.is_delayed) {
      return "bg-red-600 text-white";
    }

    if (task.status === "open") {
      return "bg-yellow-400 text-black";
    }

    return "";
  }

  // =========================
  // CLOSE TASK
  // =========================
  async function handleClose(taskId) {
    const comment = prompt("Close reason:");

    if (comment === null) return;

    try {
      await closeTask(taskId, { comment });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  // =========================
  // OPEN MODAL
  // =========================
  function openModal() {
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 50);
  }

  // =========================
  // CLOSE MODAL
  // =========================
  function closeModal() {
    setAnimateModal(false);
    setTimeout(() => setShowModal(false), 300);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <LogoutButton />

        <h1 className="text-xl font-semibold tracking-tight">
          Tasks Administration
        </h1>

        <button
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm"
        >
          Create Task
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-6 py-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Created</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">ETA</th>
                <th className="text-left py-2">Delayed</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-t border-slate-800">
                  <td className="py-2">{t.title}</td>

                  <td className="py-2">
                    {formatMXTime(t.created_at)}
                  </td>

                  <td className="py-2">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${getStatusColor(t)}`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-2">
                    {formatMXTime(t.eta_at)}
                  </td>

                  <td
                    className={`py-2 ${
                      t.is_delayed
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {t.is_delayed ? "YES" : "NO"}
                  </td>

                  <td className="py-2 space-x-3">
                    <button
                    onClick={() => navigate(`/tasks/${t.id}`)}
                    className="text-indigo-400 hover:text-indigo-200 text-xs"
                  >
                    View
                  </button>

                    {t.status !== "closed" && (
                      <button
                        onClick={() => handleClose(t.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {!tasks.length && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

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
            className={`w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-xl
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
                Create Task
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
              <TasksCreateModal
                onClose={() => {
                  closeModal();
                  load(); // 🔥 refresh tasks
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}