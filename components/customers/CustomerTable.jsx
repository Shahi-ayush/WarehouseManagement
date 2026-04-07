"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CustomerTable({
  customers = [],
  loading = false,
  onDelete,
  showActions = true,
  compact = false, // for dashboard small view
}) {
  if (loading) {
    return <p className="text-center py-6">Loading customers...</p>;
  }

  if (!customers.length) {
    return <p className="text-center py-6">No customers found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Phone</th>

            {!compact && (
              <>
                {/* <th className="border p-2 text-left">Email</th> */}
                <th className="border p-2 text-left">Created</th>
              </>
            )}

            {showActions && (
              <th className="border p-2 text-left">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-gray-100">
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.phone}</td>

              {!compact && (
                <>
                  {/* <td className="border p-2">{c.email || "-"}</td> */}
                  <td className="border p-2">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                </>
              )}

              {showActions && (
                <td className="border p-2 flex gap-2">
                  <Link
                    href={`/dashboard/purchases/customers/${c.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>

                  {onDelete && (
                    <button
                      onClick={() => onDelete(c.id)}
                      className="flex items-center text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}