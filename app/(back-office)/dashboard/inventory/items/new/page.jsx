"use client";

import CreateItemForm from "@/components/dashboard/CreateItemForm";
import { useEffect, useState } from "react";

export default function NewItemPage() {
  const [dropdowns, setDropdowns] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [categories, brands, warehouses, suppliers] = await Promise.all([
          fetch("/api/categories").then(res => res.ok ? res.json() : []),
          // fetch("/api/units").then(res => res.ok ? res.json() : []),
          fetch("/api/brands").then(res => res.ok ? res.json() : []),
          fetch("/api/warehouse").then(res => res.ok ? res.json() : []),
          fetch("/api/suppliers").then(res => res.ok ? res.json() : []),
        ]);

        setDropdowns({ categories, brands, warehouses, suppliers });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDropdowns();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!dropdowns) return <p className="text-center mt-10">Failed to load dropdown data</p>;

  return (
    <CreateItemForm
      isUpdate={false}
      initialData={{}}
      categories={dropdowns.categories}
      // units={dropdowns.units}
      brands={dropdowns.brands}
      warehouses={dropdowns.warehouses}
      suppliers={dropdowns.suppliers}
    />
  );
}
