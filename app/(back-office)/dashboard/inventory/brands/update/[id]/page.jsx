
"use client";


import NewBrand from "@/components/categorybyuser/NewBrand";
import { useEffect, useState } from "react";

export default function UpdateBrand({ params }) {
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch(`/api/brands/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!initialData) return <p className="text-center text-lg">Brand not found</p>;

  return <NewBrand initialData={initialData} isUpdate={true} />;
}
