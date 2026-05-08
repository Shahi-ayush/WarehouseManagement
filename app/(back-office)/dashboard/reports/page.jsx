"use client";

import { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Reports() {
  const [items, setItems] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [mostSoldDaily, setMostSoldDaily] = useState([]);
  const [mostSoldMonthly, setMostSoldMonthly] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const [itemsData, salesHistory] = await Promise.all([
          getData("items"),
          getData("purchases")
        ]);

        setItems(itemsData || []);
        setSalesData(salesHistory || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const outOfStockItems = items.filter(item => item.quantity === 0);
  const lowStockItems = items.filter(
    item => item.quantity > 0 && item.quantity <= (item.reOrderPoint || 5)
  );
  const highStockItems = items.filter(
    item => item.quantity > (item.reOrderPoint || 5) * 2
  );

  useEffect(() => {
    if (!salesData.length) {
      setMostSoldDaily([]);
      setMostSoldMonthly([]);
      setTopCategories([]);
      setTopSuppliers([]);
      setTopCustomers([]);
      return;
    }

    const dailyCounts = {};
    const monthlyCounts = {};
    const categoryCounts = {};
    const supplierCounts = {};
    const customerTotals = {};
    const itemLookup = new Map(items.map((item) => [item.id, item]));

    salesData.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const day = date.toISOString().split("T")[0];
      const month = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const customerName =
        sale.customer?.name || sale.customer?.phone || sale.customerId || "Unknown customer";

      if (!customerTotals[customerName]) {
        customerTotals[customerName] = { name: customerName, amount: 0, orders: 0 };
      }

      customerTotals[customerName].amount += sale.total || 0;
      customerTotals[customerName].orders += 1;

      sale.items?.forEach((item) => {
        if (!dailyCounts[day]) dailyCounts[day] = {};
        if (!dailyCounts[day][item.name]) dailyCounts[day][item.name] = 0;
        dailyCounts[day][item.name] += item.qty;

        if (!monthlyCounts[month]) monthlyCounts[month] = {};
        if (!monthlyCounts[month][item.name]) monthlyCounts[month][item.name] = 0;
        monthlyCounts[month][item.name] += item.qty;

        const inventoryItem = itemLookup.get(item.itemId);
        const categoryName = inventoryItem?.category?.title || "Uncategorized";
        const supplierName = inventoryItem?.supplier?.title || "No supplier";

        if (!categoryCounts[categoryName]) categoryCounts[categoryName] = 0;
        if (!supplierCounts[supplierName]) supplierCounts[supplierName] = 0;

        categoryCounts[categoryName] += item.qty || 0;
        supplierCounts[supplierName] += item.qty || 0;
      });
    });

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = `${new Date().getMonth() + 1}-${new Date().getFullYear()}`;

    const sortedDaily = Object.entries(dailyCounts[today] || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    const sortedMonthly = Object.entries(monthlyCounts[currentMonth] || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    const sortedSuppliers = Object.entries(supplierCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    const sortedCustomers = Object.values(customerTotals)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((customer) => ({
        name: customer.name,
        qty: `NPR ${customer.amount.toFixed(2)} (${customer.orders} orders)`,
      }));

    setMostSoldDaily(sortedDaily);
    setMostSoldMonthly(sortedMonthly);
    setTopCategories(sortedCategories);
    setTopSuppliers(sortedSuppliers);
    setTopCustomers(sortedCustomers);
  }, [items, salesData]);

  const forecastInsights = items
    .map((item) => {
      const weeklyBuckets = [0, 0, 0, 0];

      salesData.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        const ageInDays = Math.floor((Date.now() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
        if (ageInDays < 0 || ageInDays >= 28) return;

        sale.items?.forEach((saleItem) => {
          if (saleItem.itemId !== item.id) return;
          weeklyBuckets[Math.floor(ageInDays / 7)] += saleItem.qty || 0;
        });
      });

      const weights = [0.4, 0.3, 0.2, 0.1];
      const weeklyForecast = weeklyBuckets.reduce(
        (sum, qty, index) => sum + qty * weights[index],
        0
      );
      const avgDailyDemand = weeklyForecast / 7;
      const reOrderPoint = item.reOrderPoint || 5;
      const projectedDaysLeft = avgDailyDemand > 0 ? item.quantity / avgDailyDemand : null;
      const projectedShortfall = Math.max(
        Math.ceil(weeklyForecast + reOrderPoint - item.quantity),
        0
      );

      return {
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        avgDailyDemand,
        projectedDaysLeft,
        projectedShortfall,
        weeklyForecast,
      };
    })
    .filter(item => item.weeklyForecast > 0)
    .sort((a, b) => {
      if (a.projectedShortfall !== b.projectedShortfall) {
        return b.projectedShortfall - a.projectedShortfall;
      }

      if (a.projectedDaysLeft === null) return 1;
      if (b.projectedDaysLeft === null) return -1;
      return a.projectedDaysLeft - b.projectedDaysLeft;
    })
    .slice(0, 6);

  const urgentForecastCount = forecastInsights.filter(
    item => item.projectedDaysLeft !== null && item.projectedDaysLeft <= 7
  ).length;

  const pieData = [
    { name: "Out of Stock", value: outOfStockItems.length },
    { name: "Low Stock", value: lowStockItems.length },
    {
      name: "Normal/High Stock",
      value: items.length - lowStockItems.length - outOfStockItems.length
    }
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Stock Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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

      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
        <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold">Demand Forecast</h2>
            <p className="text-sm text-gray-500">
              Uses a 4-week weighted moving average so the newest sales influence the forecast the most.
            </p>
          </div>
          <div className="text-sm md:text-right">
            <p className="font-medium text-amber-600">{urgentForecastCount} urgent restock signals</p>
            <p className="text-gray-500">Based on current stock and recent demand</p>
          </div>
        </div>

        {forecastInsights.length === 0 ? (
          <p className="text-gray-500">Not enough recent sales data to generate a forecast yet</p>
        ) : (
          <div className="space-y-3">
            {forecastInsights.map(item => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">
                      Forecast {item.weeklyForecast.toFixed(1)} units over the next 7 days
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    Need {item.projectedShortfall} more
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                  <div>
                    <p className="text-gray-500">In stock</p>
                    <p className="font-semibold">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg / day</p>
                    <p className="font-semibold">{item.avgDailyDemand.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Coverage</p>
                    <p className="font-semibold">
                      {item.projectedDaysLeft === null ? "Stable" : `${item.projectedDaysLeft.toFixed(1)} days`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Top Sold Items Today</h2>
          {mostSoldDaily.length === 0 ? (
            <p className="text-gray-500">No sales today</p>
          ) : (
            <ul>
              {mostSoldDaily.map(item => (
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
              {mostSoldMonthly.map(item => (
                <li key={item.name} className="flex justify-between py-1 border-b">
                  <span>{item.name}</span>
                  <span>{item.qty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ReportListCard
          title="Top Sold Items by Category"
          emptyText="No category sales yet"
          items={topCategories}
        />

        <ReportListCard
          title="Top Suppliers by Sold Items"
          emptyText="No supplier sales yet"
          items={topSuppliers}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ReportListCard
          title="Top Customers"
          emptyText="No customer sales yet"
          items={topCustomers}
        />
      </div>
    </div>
  );
}

function ReportListCard({ title, emptyText, items }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
      <h2 className="font-semibold mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">{emptyText}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.name} className="flex justify-between py-1 border-b">
              <span>{item.name}</span>
              <span>{item.qty}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
          {items.map(item => (
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
