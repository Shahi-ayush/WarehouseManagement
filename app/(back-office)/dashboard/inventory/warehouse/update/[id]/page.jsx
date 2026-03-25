
"use client";



import NewWarehouse from "@/components/categorybyuser/NewWarehouse";
import { useEffect, useState } from "react";

export default function UpdateWarehouse({ params }) {
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchWarehouse() {
      try {
        const res = await fetch(`/api/warehouse/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWarehouse();
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!initialData) return <p className="text-center text-lg">warehouse not found</p>;

  return <NewWarehouse initialData={initialData} isUpdate={true} />;
}
