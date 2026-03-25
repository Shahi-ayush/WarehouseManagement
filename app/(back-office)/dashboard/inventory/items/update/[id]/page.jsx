

"use client";

import CreateItemForm from "@/components/dashboard/CreateItemForm";
import { useEffect, useState } from "react";

export default function UpdateItem({ params }) {
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [dropdowns, setDropdowns] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemRes, categories, units, brands, warehouses, suppliers] = await Promise.all([
          fetch(`/api/items/${id}`).then(res => res.json()),
          fetch("/api/categories").then(res => res.json()),
          fetch("/api/units").then(res => res.json()),
          fetch("/api/brands").then(res => res.json()),
          fetch("/api/warehouse").then(res => res.json()),
          fetch("/api/suppliers").then(res => res.json()),
        ]);

        setInitialData(itemRes);
        setDropdowns({ categories, units, brands, warehouses, suppliers });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!initialData) return <p className="text-center mt-10">Item not found</p>;

  return (
    <CreateItemForm
      isUpdate={true}
      initialData={initialData}
      categories={dropdowns.categories}
      units={dropdowns.units}
      brands={dropdowns.brands}
      warehouses={dropdowns.warehouses}
      suppliers={dropdowns.suppliers}
    />
  );
}



