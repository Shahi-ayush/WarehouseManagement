

"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [refreshKey]);

  const columns = ["title", "description"];

  return (
    <div>
      <FixedHeader title="Categories" newLink="/dashboard/inventory/categories/new" />
      <div className="my-4 p-8">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <DataTable
            data={categories}
            columns={columns}
            resourceTitle="categories"
            onDeleteSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
      </div>
    </div>
  );
}

