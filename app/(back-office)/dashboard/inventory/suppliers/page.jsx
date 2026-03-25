

"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch suppliers from API
  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const res = await fetch("/api/suppliers");
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

  const columns = ["title", "notes" , "phone" ,"email"];

  return (
    <div>
      <FixedHeader title="Suppliers" newLink="/dashboard/inventory/suppliers/new" />
      <div className="my-4 p-8">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <DataTable data={suppliers} columns={columns} resourceTitle="suppliers" />
        )}
      </div>
    </div>
  );
}

