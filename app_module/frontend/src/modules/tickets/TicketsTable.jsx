export default function TicketsTable({ tickets = [], onSelect }) {
  if (!tickets.length) {
    return <p>No tickets found</p>;
  }

  const priorityStyles = {
    low: "bg-yellow-200 text-yellow-900",
    medium: "bg-yellow-300 text-yellow-900",
    high: "bg-orange-400 text-white",
    urgent: "bg-red-600 text-white",
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const isOverdue = (ticket) => {
    if (!ticket.estimated_close_at) return false;
    return (
      ticket.status === "open" &&
      new Date(ticket.estimated_close_at) < new Date()
    );
  };

  const getStatusStyle = (status) => {
    if (status === "closed") {
      return "bg-green-600 text-white px-2 py-1 rounded";
    }
    return "";
  };

  return (
    <div className="bg-slate-900 rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Priority</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Created By</th>
            <th className="p-2 text-left">Assigned To</th>
            <th className="p-2 text-left">Opened</th>
            <th className="p-2 text-left">Due Date</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => {
            const overdue = isOverdue(t);

            return (
              <tr
                key={t.id}
                onClick={() => onSelect?.(t)}
                className="border-t border-slate-800 hover:bg-slate-800 cursor-pointer"
              >
                {/* TITLE */}
                <td className="p-2">{t.title}</td>

                {/* PRIORITY */}
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      priorityStyles[t.priority] ||
                      "bg-slate-600 text-white"
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>

                {/* STATUS */}
                <td className="p-2">
                  <span className={getStatusStyle(t.status)}>
                    {t.status}
                  </span>
                </td>

                {/* CREATED BY */}
                <td className="p-2">
                  {t.created_by_name
                    ? `${t.created_by_name} (${t.created_by_clock})`
                    : "-"}
                </td>

                {/* ASSIGNED TO */}
                <td className="p-2">
                  {t.assigned_to_name && t.assigned_to_clock !== "-"
                    ? `${t.assigned_to_name} (${t.assigned_to_clock})`
                    : "-"}
                </td>

                {/* OPENED */}
                <td className="p-2 text-xs text-slate-300">
                  {formatDate(t.created_at)}
                </td>

                {/* DUE DATE + ALERTA */}
                <td className="p-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-slate-300">
                      {formatDate(t.estimated_close_at)}
                    </span>

                    {/* 🔥 ALERTA VISUAL */}
                    {overdue && (
                      <span className="text-red-500 font-bold text-xs mt-1">
                        ⚠ OUT OF TIME
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}