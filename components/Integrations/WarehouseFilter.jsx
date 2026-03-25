"use client";

import React, { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ItemsByWarehousePage() {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsData, warehousesData] = await Promise.all([
          getData("items"),
          getData("warehouse"), // ✅ Correct endpoint
        ]);

        console.log("Warehouses fetched:", warehousesData);
        console.log("Items fetched:", itemsData);

        setItems(Array.isArray(itemsData) ? itemsData : []);
        setWarehouses(Array.isArray(warehousesData) ? warehousesData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Filter items by selected warehouse
  const filteredItems =
    selectedWarehouse === "all"
      ? items
      : items.filter(
          (item) => item.warehouse?.title === selectedWarehouse
        );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Items by Warehouse
      </h1>

      {/* ✅ Warehouse Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedWarehouse("all")}
          className={`px-4 py-2 rounded-full border transition ${
            selectedWarehouse === "all"
              ? "bg-blue-600 text-white"
              : "border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>

        {warehouses.length > 0 ? (
          warehouses.map((warehouse) => (
            <button
              key={warehouse.id}
              onClick={() => setSelectedWarehouse(warehouse.title)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedWarehouse === warehouse.title
                  ? "bg-blue-600 text-white"
                  : "border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {warehouse.title}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No warehouses found.</p>
        )}
      </div>

      {/* ✅ Item Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
      ) : filteredItems.length === 0 ? (
        <p className="text-gray-500 text-center">No items found.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm transition flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Category: {item.category?.title || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Brand: {item.brand?.title || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Warehouse: {item.warehouse?.title || "N/A"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Stock: <strong>{item.quantity}</strong> Left
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Price: NPR {item.sellingPrice?.toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
