
"use client";


import NewUnit from "@/components/categorybyuser/NewUnits";
import { useEffect, useState } from "react";

export default function UpdateUnit({ params }) {
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchUnit() {
      try {
        const res = await fetch(`/api/units/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUnit();
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!initialData) return <p className="text-center text-lg">Unit not found</p>;

  return <NewUnit initialData={initialData} isUpdate={true} />;
}
