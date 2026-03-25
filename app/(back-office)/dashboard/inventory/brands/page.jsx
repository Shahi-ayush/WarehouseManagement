
"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch brands from API
  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/brands");
        if (!res.ok) throw new Error("Failed to fetch brands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const columns = ["title"];

  return (
    <div>
      <FixedHeader title="Brands" newLink="/dashboard/inventory/brands/new" />
      <div className="my-4 p-8">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <DataTable data={brands} columns={columns} resourceTitle="brands" />
        )}
      </div>
    </div>
  );
}

