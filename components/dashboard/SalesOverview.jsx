import { CheckCircle2 } from "lucide-react";
import SalesActivityCard from "./SalesActivityCard";
import InventorySummaryCard from "./InventorySummaryCard";
// import db from "@/lib/db";
import { db } from "@/lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function SalesOverview() {
  // ✅ Get logged-in user
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return <p className="text-red-500 p-4">Unauthorized. Please login to see overview.</p>;
  }

  // ✅ Fetch all data in parallel
  const [categories, items, warehouses, suppliers] = await Promise.all([
    db.category.findMany({ where: { userId } }),
    db.item.findMany({ where: { userId } }),
    db.warehouse.findMany({ where: { userId } }),
    db.supplier.findMany({ where: { userId } }),
  ]);

  // Prevent .map() errors
  const warehouseArray = Array.isArray(warehouses) ? warehouses : [];

  // Calculate stock per warehouse
  const inventorySummary = warehouseArray.map((warehouse) => {
    const totalQty = items
      .filter((item) => item.warehouseId === warehouse.id)
      .reduce((acc, i) => acc + (i.quantity || 0), 0);
    return { title: warehouse.title, number: totalQty };
  });

  const totalStock = inventorySummary.reduce((acc, cur) => acc + cur.number, 0);

  // Total records overview
  const totalOverview = (categories?.length || 0) + (items?.length || 0) + (warehouses?.length || 0) + (suppliers?.length || 0);

  // Sales activity cards
  const salesActivity = [
    { title: "Categories", number: categories.length, unit: "Qty", href: "/dashboard/inventory/categories", color: "text-blue-600" },
    { title: "Items", number: items.length, unit: "Pkgs", href: "/dashboard/inventory/items", color: "text-red-600" },
    { title: "Warehouses", number: warehouses.length, unit: "Pkgs", href: "/dashboard/inventory/warehouse", color: "text-green-600" },
    { title: "Suppliers", number: suppliers.length, unit: "Qty", href: "/dashboard/inventory/suppliers", color: "text-orange-600" },
  ];

  return (
    <section className="border-b border-slate-200 rounded-2xl shadow-sm p-8 my-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Inventory Overview */}
        <div className="xl:col-span-8 pr-0 xl:pr-4 border-slate-300 xl:border-r">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Inventory Overview</h2>
            <CheckCircle2 className="text-green-600 w-5 h-5" />
          </div>
          <p className="text-slate-600 mb-3 font-medium">
            Total Records: <span className="font-semibold">{totalOverview}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {salesActivity.map((item, i) => (
              <SalesActivityCard item={item} key={i} />
            ))}
          </div>
        </div>

        {/* Warehouse Summary */}
        <div className="xl:col-span-4 pl-0 xl:pl-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Warehouse Stock Summary</h2>
          <div className="space-y-3">
            {inventorySummary.map((item, i) => (
              <InventorySummaryCard item={item} key={i} />
            ))}
          </div>
          <p className="mt-4 text-slate-700 font-medium border-t pt-2">
            Total Stock Across Warehouses: <span className="font-semibold">{totalStock}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
