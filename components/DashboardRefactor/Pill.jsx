export default function Pill({ text, variant }) {
  const styles = {
    CASH: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    BANK: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    KHALTI: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    ESEWA: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    PENDING: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    SHIPPED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    OUT_FOR_DELIVERY: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    VERIFIED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    UNVERIFIED: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
        styles[variant] || "bg-gray-100 text-gray-600"
      }`}
    >
      {text}
    </span>
  );
}