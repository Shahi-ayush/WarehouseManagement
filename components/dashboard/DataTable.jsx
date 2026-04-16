"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import DeleteBtn from "./DeleteBtn";
import { useState } from "react";

// Column labels for nicer display
const columnLabels = {
  imageUrl: "Image",
  title: "Item Name",
  quantity: "Qty",
  "category.title": "Category",
  "warehouse.title": "Warehouse",
  createdAt: "Date Created",
};

// Format date in readable style
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return isNaN(date)
    ? "-"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export default function DataTable({ data, columns = [], resourceTitle, onDeleteSuccess }) {
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });

  if (!Array.isArray(data) || !data.length) {
    return (
      <p className="p-4 text-2xl text-center bg-white">
        There Is No Data To Display
      </p>
    );
  }

  // Sort data based on column type (string, number, date)
  const sortedData = [...data].sort((a, b) => {
    const { key, direction } = sortConfig;

    const getValue = (obj, key) =>
      key.includes(".") ? key.split(".").reduce((o, k) => o?.[k], obj) : obj[key];

    const aValue = getValue(a, key);
    const bValue = getValue(b, key);

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Date sorting
    if (key === "createdAt") {
      return direction === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    // Alphabetical sorting
    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    // Numeric sorting
    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100 transition"
                  onClick={() => {
                    if (sortConfig.key === col) {
                      setSortConfig({
                        key: col,
                        direction: sortConfig.direction === "asc" ? "desc" : "asc",
                      });
                    } else {
                      setSortConfig({ key: col, direction: "asc" });
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    {columnLabels[col] || col}
                    {sortConfig.key === col && (
                      <span className="text-gray-400">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                {columns.map((col, i) => (
                  <td key={i} className="px-6 py-4">
                    {col === "imageUrl" && item[col] ? (
                      <img
                        src={item[col]}
                        className="w-12 h-12 rounded object-cover"
                        alt={item.title || "Item image"}
                      />
                    ) : col === "createdAt" ? (
                      formatDate(item[col])
                    ) : col.includes(".") ? (
                      col.split(".").reduce((o, k) => o?.[k], item) || "-"
                    ) : (
                      item[col] ?? "-"
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 flex gap-3">
                  <Link
                    href={`/dashboard/inventory/${resourceTitle}/update/${item.id}`}
                    className="text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  <DeleteBtn id={item.id} endpoint={resourceTitle} onSuccess={onDeleteSuccess} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
