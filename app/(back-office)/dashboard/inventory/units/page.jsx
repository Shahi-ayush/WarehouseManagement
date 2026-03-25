

"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import FixedHeader from "@/components/dashboard/FixedHeader";

export default function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch units from API
  useEffect(() => {
    async function fetchUnits() {
      try {
        const res = await fetch("/api/units");
        if (!res.ok) throw new Error("Failed to fetch units");
        const data = await res.json();
        setUnits(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUnits();
  }, []);

  const columns = ["title"];

  return (
    <div>
      <FixedHeader title="Units" newLink="/dashboard/inventory/units/new" />
      <div className="my-4 p-8">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <DataTable data={units} columns={columns} resourceTitle="units" />
        )}
      </div>
    </div>
  );
}

