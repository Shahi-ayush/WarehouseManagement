export default function StatCard({ label, value, danger }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p
        className={`text-2xl font-medium ${
          danger ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"
        }`}
      >
        NPR {value.toLocaleString()}
      </p>
    </div>
  );
}