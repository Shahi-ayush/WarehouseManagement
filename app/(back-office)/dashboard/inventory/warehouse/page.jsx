
"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import Link from "next/link";
import { HelpCircle, LayoutGrid, List, MoreHorizontal, Plus } from "lucide-react";
import ItemsByWarehousePage from "@/components/Integrations/WarehouseFilter";

export default function Warehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch warehouses from API
  useEffect(() => {
    async function fetchWarehouse() {
      try {
        const res = await fetch("/api/warehouse");
        if (!res.ok) throw new Error("Failed to fetch warehouse");
        const data = await res.json();
        setWarehouses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWarehouse();
  }, [refreshKey]);

  // Columns including total quantity
  const columns = ["title", "location", "warehouseType", "description", "totalQuantity"];

  // Map warehouses to include total quantity of items
  const warehousesWithQuantity = warehouses.map((w) => ({
    ...w,
    totalQuantity: w.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center bg-white py-6 px-4">
        <button className="text-2xl font-semibold">Warehouses</button>

        <div className="flex gap-4 items-center">
          {/* New */}
          <div className="pr-2 border-r border-gray-300">
            <Link
              href={"/dashboard/inventory/warehouse/new"}
              className="p-1 bg-blue-600 px-3 text-white rounded-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </Link>
          </div>

          {/* Layout Toggle */}
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => setShowGrid(false)}
              className={`p-2 ${!showGrid ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowGrid(true)}
              className={`p-2 ${showGrid ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* More / Help */}
          <button className="bg-gray-100 p-2 rounded-md">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button className="bg-orange-600 p-2 rounded-md">
            <HelpCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Table or Grid */}
      <div className="my-4 p-8">
        {loading ? (
          <p>Loading...</p>
        ) : showGrid ? (
          <ItemsByWarehousePage warehouses={warehousesWithQuantity} />
        ) : (
          <DataTable
            data={warehousesWithQuantity}
            columns={columns}
            resourceTitle="warehouse"
            onDeleteSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
      </div>
    </div>
  );
}
