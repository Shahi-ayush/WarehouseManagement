"use client";
import WishlistItem from "./WishlistItem";

export default function WishlistList({ items, onQuantityChange }) {
  if (!items.length) return <p className="text-center text-gray-400 py-4">No items in wishlist</p>;

  return (
    <div className="grid gap-3">
      {items.map(item => (
        <WishlistItem key={item.id} item={item} onQuantityChange={onQuantityChange} />
      ))}
    </div>
  );
}
