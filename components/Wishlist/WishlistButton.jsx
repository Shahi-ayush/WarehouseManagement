"use client";
import { useEffect, useState } from "react";

export default function WishlistButton({ itemId, initial = false, onToggle }) {
  const [wishlisted, setWishlisted] = useState(initial);
  useEffect(() => {
    setWishlisted(initial);
  }, [initial]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");

    const url = "/api/customer-auth/wishlist";
    const method = wishlisted ? "DELETE" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (data.success) {
        setWishlisted(!wishlisted);
        onToggle && onToggle(itemId, !wishlisted, data.wishlist); // notify parent
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`px-2 py-1 rounded ${wishlisted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
    >
      {wishlisted ? "♥" : "♡"}
    </button>
  );
}
