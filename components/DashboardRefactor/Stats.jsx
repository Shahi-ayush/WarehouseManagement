import StatCard from "./StatCard";

export default function Stats({ dashboard }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Total purchased" value={dashboard.totalSpent} />
      <StatCard label="Total paid" value={dashboard.totalPaid} />
      <StatCard label="Due balance" value={dashboard.dueBalance} danger={dashboard.dueBalance > 0} />
    </div>
  );
}