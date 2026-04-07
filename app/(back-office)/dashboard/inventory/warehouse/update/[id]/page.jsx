

"use client";

import { useEffect, useState } from "react";
import NewWarehouse from "@/components/categorybyuser/NewWarehouse";
import { useRouter } from "next/navigation";

export default function UpdateWarehouse({ params }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Since params is now a promise, we can unwrap it inside useEffect
  useEffect(() => {
    async function fetchWarehouse() {
      try {
        const { id } = await params; // unwrap params
        const res = await fetch(`/api/warehouse/${id}`);
        if (!res.ok) throw new Error("Failed to fetch warehouse");
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWarehouse();
  }, [params]);

  if (loading) return <p>Loading...</p>;
  if (!initialData) return <p>Warehouse not found</p>;

  return <NewWarehouse isUpdate={true} initialData={initialData} />;
}