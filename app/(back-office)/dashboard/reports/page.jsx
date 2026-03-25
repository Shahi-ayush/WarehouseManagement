"use client";

import { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Reports() {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [addAdjustments, setAddAdjustments] = useState([]);
  const [transferAdjustments, setTransferAdjustments] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [mostSoldDaily, setMostSoldDaily] = useState([]);
  const [mostSoldMonthly, setMostSoldMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const [
          itemsData,
          warehousesData,
          categoriesData,
          brandsData,
          suppliersData,
          addAdjustmentsData,
          transferAdjustmentsData,
          salesData
        ] = await Promise.all([
          getData("items"),
          getData("warehouse"),
          getData("categories"),
          getData("brands"),
          getData("suppliers"),
          getData("adjustments/add"),
          getData("adjustments/transfer"),
          getData("purchases")
        ]);

        setItems(itemsData || []);
        setWarehouses(warehousesData || []);
        setCategories(categoriesData || []);
        setBrands(brandsData || []);
        setSuppliers(suppliersData || []);
        setAddAdjustments(addAdjustmentsData || []);
        setTransferAdjustments(transferAdjustmentsData || []);
        setSalesData(salesData || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  // 🔹 Stock Logic
  const outOfStockItems = items.filter((item) => item.quantity === 0);
  const lowStockItems = items.filter(
    (item) => item.quantity > 0 && item.quantity <= (item.reOrderPoint || 5)
  );
  const highStockItems = items.filter(
    (item) => item.quantity > (item.reOrderPoint || 5) * 2
  );

  // 🔹 Most Sold Items Calculation
  useEffect(() => {
    if (!salesData.length) return;

    const dailyCounts = {};
    const monthlyCounts = {};

    salesData.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const day = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const month = date.getMonth() + 1 + "-" + date.getFullYear(); // MM-YYYY

      sale.items.forEach((i) => {
        // Daily
        if (!dailyCounts[day]) dailyCounts[day] = {};
        if (!dailyCounts[day][i.name]) dailyCounts[day][i.name] = 0;
        dailyCounts[day][i.name] += i.qty;

        // Monthly
        if (!monthlyCounts[month]) monthlyCounts[month] = {};
        if (!monthlyCounts[month][i.name]) monthlyCounts[month][i.name] = 0;
        monthlyCounts[month][i.name] += i.qty;
      });
    });

    // Top 5 today
    const today = new Date().toISOString().split("T")[0];
    if (dailyCounts[today]) {
      const sortedDaily = Object.entries(dailyCounts[today])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));
      setMostSoldDaily(sortedDaily);
    }

    // Top 5 this month
    const currentMonth = new Date().getMonth() + 1 + "-" + new Date().getFullYear();
    if (monthlyCounts[currentMonth]) {
      const sortedMonthly = Object.entries(monthlyCounts[currentMonth])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));
      setMostSoldMonthly(sortedMonthly);
    }
  }, [salesData]);

  // 🔹 Add Stock Activities
  const addStockActivities = addAdjustments.map((a) => {
    const item = items.find((i) => i.id === a.itemId);
    const warehouse = warehouses.find((w) => w.id === a.receivingWarehouseId);
    return {
      id: a.id,
      type: "Stock Added",
      message: `Added ${a.addStockQty} units of "${item?.title ?? a.itemId}" to "${warehouse?.title ?? a.receivingWarehouseId}"`,
      createdAt: a.createdAt
    };
  });

  // 🔹 Transfer Stock Activities
  const transferActivities = transferAdjustments.map((t) => {
    const item = items.find((i) => i.id === t.itemId);
    const givingWarehouse = warehouses.find((w) => w.id === t.givingWarehouseId);
    const receivingWarehouse = warehouses.find(
      (w) => w.id === t.receivingWarehouseId
    );
    return {
      id: t.id,
      type: "Stock Transferred",
      message: `Transferred ${t.transferStockQty} units of "${item?.title ?? t.itemId}" from "${givingWarehouse?.title ?? t.givingWarehouseId}" to "${receivingWarehouse?.title ?? t.receivingWarehouseId}"`,
      createdAt: t.createdAt
    };
  });

  // 🔹 Base Activities
  const baseActivities = [
    ...items.map((i) => ({
      id: i.id,
      type: "Item Created",
      message: `Item "${i.title}" was created.`,
      createdAt: i.createdAt
    })),
    ...categories.map((c) => ({
      id: c.id,
      type: "Category Created",
      message: `Category "${c.title}" was created.`,
      createdAt: c.createdAt
    })),
    ...brands.map((b) => ({
      id: b.id,
      type: "Brand Created",
      message: `Brand "${b.title}" was created.`,
      createdAt: b.createdAt
    })),
    ...suppliers.map((s) => ({
      id: s.id,
      type: "Supplier Created",
      message: `Supplier "${s.title}" was added.`,
      createdAt: s.createdAt
    }))
  ];

  const activities = [...baseActivities, ...addStockActivities, ...transferActivities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const pieData = [
    { name: "Out of Stock", value: outOfStockItems.length },
    { name: "Low Stock", value: lowStockItems.length },
    { name: "Normal/High Stock", value: items.length - lowStockItems.length - outOfStockItems.length }
  ];
  const COLORS = ["#ef4444", "#facc15", "#4ade80"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Inventory Reports</h1>

      {/* Stock Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Stock Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Stock Status</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            <StockCard title="Out of Stock Items" items={outOfStockItems} type="out" />
            <StockCard title="Low Stock Items" items={lowStockItems} type="low" />
            <StockCard title="High Stock Items" items={highStockItems} type="high" />
          </div>
        </div>
      </div>

      {/* Top Sold Items */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Top Sold Items Today</h2>
          {mostSoldDaily.length === 0 ? (
            <p className="text-gray-500">No sales today</p>
          ) : (
            <ul>
              {mostSoldDaily.map((item) => (
                <li key={item.name} className="flex justify-between py-1 border-b">
                  <span>{item.name}</span>
                  <span>{item.qty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Top Sold Items This Month</h2>
          {mostSoldMonthly.length === 0 ? (
            <p className="text-gray-500">No sales this month</p>
          ) : (
            <ul>
              {mostSoldMonthly.map((item) => (
                <li key={item.name} className="flex justify-between py-1 border-b">
                  <span>{item.name}</span>
                  <span>{item.qty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-4">Recent Activities</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activities</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {activities.map((a) => (
              <li key={a.id} className="flex justify-between border-b py-1 text-sm">
                <span>
                  <strong>{a.type}</strong>: {a.message}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// 🔹 StockCard Component
function StockCard({ title, items, type }) {
  const bgColors = {
    out: "bg-gray-100 dark:bg-gray-700",
    low: "bg-red-50 dark:bg-red-800",
    high: "bg-green-50 dark:bg-green-800",
  };

  return (
    <div className={`p-3 rounded-xl shadow-sm ${bgColors[type]}`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      {items.length === 0 ? (
        <p className="text-gray-500">No items</p>
      ) : (
        <ul className="space-y-1 max-h-40 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between border-b py-1 text-sm">
              <span>{item.title}</span>
              <span>{item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
