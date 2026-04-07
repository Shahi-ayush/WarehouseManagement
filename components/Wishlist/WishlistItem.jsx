"use client";
export default function WishlistItem({ item, onQuantityChange }) {
  const qty = Number(item.quantity || 0);
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">NPR {item.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(item.id, Math.max(0, qty - 1))}
          className="px-2 py-1 rounded bg-gray-100 text-gray-700"
        >
          -
        </button>
        <input
          type="number"
          min="0"
          value={qty}
          onChange={(e) => onQuantityChange(item.id, Number(e.target.value || 0))}
          className="w-16 text-center border rounded px-2 py-1"
        />
        <button
          onClick={() => onQuantityChange(item.id, qty + 1)}
          className="px-2 py-1 rounded bg-blue-100 text-blue-700"
        >
          +
        </button>
      </div>
    </div>
  );
}
