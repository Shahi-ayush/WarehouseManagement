import Pill from "./Pill";

export default function PaymentsList({ recentPayments }) {
  if (!recentPayments.length)
    return <p className="text-sm text-gray-400 py-2 text-center">No payments yet</p>;

  return (
    <ul className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
      {recentPayments.slice(0, 4).map((p) => (
        <li key={p.id} className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
            {p.reference && <p className="text-[11px] text-gray-400 mt-0.5">{p.reference}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Pill text={p.method} variant={p.method} />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">NPR {p.amount.toLocaleString()}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}