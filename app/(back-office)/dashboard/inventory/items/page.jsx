"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/dashboard/DataTable";
import Link from "next/link";
import {
  HelpCircle,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
} from "lucide-react";

export default function Items() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");


  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/items");
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [refreshKey]);

  // Extract unique categories
  const categories = [
    ...new Set(items.map((item) => item.category?.title).filter(Boolean)),
  ];


  // Filter items based on search, category, and date range
useEffect(() => {
  let filtered = items;

  if (searchTerm) {
    filtered = filtered.filter((item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (selectedCategory) {
    filtered = filtered.filter(
      (item) => item.category?.title === selectedCategory
    );
  }

  // ✅ DATE RANGE FILTER (runs after clicking Filter button)
  if (fromDate && toDate) {
    filtered = filtered.filter((item) => {
      const created = new Date(item.createdAt);
      return (
        created >= new Date(fromDate) &&
        created <= new Date(toDate)
      );
    });
  }

  setFilteredItems(filtered);
}, [searchTerm, selectedCategory, fromDate, toDate, items]);


  const columns = ["imageUrl", "title", "quantity" ,"category.title", "warehouse.title","buyingPrice","sellingPrice","createdAt",];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center bg-white py-6 px-4 flex-wrap gap-4">
        <h1 className="text-2xl font-semibold">Items</h1>

        <div className="flex gap-5 items-center flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3.25 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>


          {/* Category Filter */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3 w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-9 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>


           {/* ✅ DATE RANGE FILTER (HERE) */}
  <div className="flex items-center gap-2">
    <input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-2"
    />
    <span className="text-gray-500">to</span>
    <input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-2"
    />
  </div>

          {/* New Button */}
          <div className="pr-2 border-r border-gray-300">
            <Link
              href="/dashboard/inventory/items/new"
              className="p-1 bg-blue-600 px-3 text-white rounded-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="my-4 p-8">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center">No items found</p>
        ) : (
          <DataTable
            data={filteredItems}
            columns={columns}
            resourceTitle="items"
            onDeleteSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
      </div>
    </div>
  );
}
