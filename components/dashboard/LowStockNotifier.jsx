
"use client";

import { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LowStockNotifier({ lowStockItems }) {
  const router = useRouter();
  const hasNotified = useRef(false); // ✅ track if we already showed the toast

  useEffect(() => {
    if (!lowStockItems || lowStockItems.length === 0) return;

    // Only show toast once
    if (hasNotified.current) return;
    hasNotified.current = true;

    const MAX_DISPLAY = 3; // show only 3 items
    const displayItems = lowStockItems.slice(0, MAX_DISPLAY);

    toast(
      <div>
        ⚠️ Low Stock Alert! {lowStockItems.length} item(s) are low:
        <ul className="list-disc ml-5 mt-1">
          {displayItems.map((item) => (
            <li key={item.id}>
              {item.title} ({item.quantity} left)
            </li>
          ))}
        </ul>

        {lowStockItems.length > MAX_DISPLAY && (
          <button
            onClick={() => router.push("/dashboard/home/getting-started")}
            className="mt-2 text-blue-600 underline"
          >
            See More
          </button>
        )}
      </div>,
      {
        duration: 10000,
        style: { background: "#fef3f3", color: "#b91c1c" },
      }
    );
  }, [lowStockItems, router]);

  return <Toaster position="top-right" />;
}