export default function BarChart({ purchases }) {
  const monthly = purchases.reduce((acc, p) => {
    const month = new Date(p.createdAt).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + p.total;
    return acc;
  }, {});

  const entries = Object.entries(monthly);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (!entries.length)
    return <p className="text-sm text-gray-400 py-4 text-center">No purchase data yet</p>;

  return (
    <div className="flex items-end gap-1.5 h-20">
      {entries.map(([month, total], i) => (
        <div key={month} className="flex flex-col items-center gap-1 flex-1">
          <div
            title={`NPR ${total.toLocaleString()}`}
            style={{ height: `${Math.round((total / max) * 72)}px` }}
            className={`w-full rounded-t transition-all ${
              i === entries.length - 1
                ? "bg-blue-500 dark:bg-blue-400"
                : "bg-blue-200 dark:bg-blue-800"
            }`}
          />
          <span className="text-[10px] text-gray-400">{month}</span>
        </div>
      ))}
    </div>
  );
}