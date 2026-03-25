"use client";

import React, { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function RecentActivities({ limit = 5 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchActivities() {
      try {
        const [
          items = [],
          categories = [],
          brands = [],
          suppliers = [],
          addAdjustments = [],
          transferAdjustments = [],
          warehouses = [],
        ] = await Promise.all([
          getData("items"),
          getData("categories"),
          getData("brands"),
          getData("suppliers"),
          getData("adjustments/add"),
          getData("adjustments/transfer"),
          getData("warehouse"),
        ]);

        const parseDate = (d) => {
          if (!d) return new Date(0);
          const parsed = new Date(d);
          if (isNaN(parsed.getTime())) return new Date(0);
          return parsed;
        };

        const baseActivities = [
          ...items.map((i) => ({
            id: `item:${i.id}`,
            type: "Item Created",
            message: `Item "${i.title}" was created.`,
            createdAt: parseDate(i.createdAt),
          })),
          ...categories.map((c) => ({
            id: `category:${c.id}`,
            type: "Category Created",
            message: `Category "${c.title}" was created.`,
            createdAt: parseDate(c.createdAt),
          })),
          ...brands.map((b) => ({
            id: `brand:${b.id}`,
            type: "Brand Created",
            message: `Brand "${b.title}" was created.`,
            createdAt: parseDate(b.createdAt),
          })),
          ...suppliers.map((s) => ({
            id: `supplier:${s.id}`,
            type: "Supplier Added",
            message: `Supplier "${s.title}" was added.`,
            createdAt: parseDate(s.createdAt),
          })),
        ];

        const addStockActivities = addAdjustments.map((a) => {
          const item = items.find((it) => it.id === a.itemId);
          const warehouse = warehouses.find((w) => w.id === a.receivingWarehouseId);
          return {
            id: `add:${a.id}`,
            type: "Stock Added",
            message: `Added ${a.addStockQty} of "${item?.title ?? a.itemId}" to "${warehouse?.title ?? a.receivingWarehouseId}"`,
            createdAt: parseDate(a.createdAt),
          };
        });

        const transferActivities = transferAdjustments.map((t) => {
          const item = items.find((it) => it.id === t.itemId);
          const givingWarehouse = warehouses.find((w) => w.id === t.givingWarehouseId);
          const receivingWarehouse = warehouses.find((w) => w.id === t.receivingWarehouseId);
          return {
            id: `transfer:${t.id}`,
            type: "Stock Transferred",
            message: `Transferred ${t.transferStockQty} of "${item?.title ?? t.itemId}" from "${givingWarehouse?.title ?? t.givingWarehouseId}" to "${receivingWarehouse?.title ?? t.receivingWarehouseId}"`,
            createdAt: parseDate(t.createdAt),
          };
        });

        const combined = [
          ...baseActivities,
          ...addStockActivities,
          ...transferActivities,
        ];

        const map = new Map();
        combined.forEach((act) => {
          if (!map.has(act.id)) map.set(act.id, act);
        });

        const deduped = Array.from(map.values());
        deduped.sort((a, b) => b.createdAt - a.createdAt);

        const top = deduped.slice(0, limit);
        if (mounted) setActivities(top);
      } catch (err) {
        console.error("RecentActivities - fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchActivities();
    return () => {
      mounted = false;
    };
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Recent Activities</h2>
        <Link
          href="/dashboard/reports"
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activities</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((a) => (
            <li key={a.id} className="flex justify-between border-b py-1 text-sm">
              <span>
                <strong>{a.type}</strong>: {a.message}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
