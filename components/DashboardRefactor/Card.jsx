export default function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      {title && (
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}