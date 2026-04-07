import Pill from "./Pill";

export default function PurchasesTable({ recentPurchases }) {
  if (!recentPurchases.length)
    return <p className="text-sm text-gray-400 py-4 text-center">No purchases yet</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            {["Date", "Items", "Ref", "Amount", "Status"].map((h) => (
              <th key={h} className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider pb-2 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {recentPurchases.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="py-2.5 pr-4 text-gray-700 dark:text-gray-200">{p.items?.map((i) => `${i.name} ×${i.qty}`).join(", ") || "—"}</td>
              <td className="py-2.5 pr-4 text-[11px] text-gray-400">{p.referenceNo || "—"}</td>
              <td className="py-2.5 pr-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">NPR {p.total.toLocaleString()}</td>
              <td className="py-2.5"><Pill text={p.status} variant={p.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}