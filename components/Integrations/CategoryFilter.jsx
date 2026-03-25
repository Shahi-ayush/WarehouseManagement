"use client";

import React, { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const itemsData = await getData("items");
        const categoriesData = await getData("categories");
        setItems(itemsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category?.title === selectedCategory);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Inventory Items
      </h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full border transition ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.title)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === category.title
                ? "bg-blue-600 text-white"
                : "border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Items List */}
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
              whileHover={{ scale: 1.06 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm transition flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Text content */}
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
