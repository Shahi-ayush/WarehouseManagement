
"use client";

import NewSupplier from "@/components/categorybyuser/NewSupplier";
import { useEffect, useState } from "react";

export default function UpdateSupplier({ params }) {
  const { id } = params;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchSupplier() {
      try {
        const res = await fetch(`/api/suppliers/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSupplier();
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!initialData) return <p className="text-center text-lg">Supplier not found</p>;

  return <NewSupplier initialData={initialData} isUpdate={true} />;
}
