export default function TicketsTable({ tickets, onSelect }) {
  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "urgent":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-700 text-slate-300 border-slate-600";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Priority</th>
            <th className="p-3 text-left">Assigned</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect(t)}
              className="border-t border-slate-800 hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <td className="p-3">{t.title}</td>

              <td className="p-3 capitalize">{t.status}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 text-xs rounded-md border font-medium ${getPriorityStyles(
                    t.priority
                  )}`}
                >
                  {t.priority}
                </span>
              </td>

              <td className="p-3">{t.assigned_to || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}