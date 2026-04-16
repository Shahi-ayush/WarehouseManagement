
"use client";

import { useState, useEffect } from "react";

// Forms
import NewCategory from "@/components/categorybyuser/NewCategory";
import NewBrand from "@/components/categorybyuser/NewBrand";
import NewSupplier from "@/components/categorybyuser/NewSupplier";
import NewWarehouse from "@/components/categorybyuser/NewWarehouse";

// Table Components
import DataTable from "@/components/dashboard/DataTable";
// import FixedHeader from "@/components/dashboard/FixedHeader";

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState("category");

  // States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch data based on tab
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let url = "";

        if (activeTab === "category") url = "/api/categories";
        if (activeTab === "brand") url = "/api/brands";
        if (activeTab === "supplier") url = "/api/suppliers";
        if (activeTab === "warehouse") url = "/api/warehouse";

        const res = await fetch(url);
        const result = await res.json();

        // If warehouse, calculate total quantity
        if (activeTab === "warehouse") {
          const warehousesWithQuantity = result.map((w) => ({
            ...w,
            totalQuantity: w.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
          }));
          setData(warehousesWithQuantity);
        } else {
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeTab, refreshKey]);

  // Dynamic columns
  const getColumns = () => {
    if (activeTab === "category") return ["title", "description"];
    if (activeTab === "brand") return ["title"];
    if (activeTab === "supplier") return ["title", "phone", "email", "notes"];
    if (activeTab === "warehouse") return ["title", "location", "warehouseType", "description", "totalQuantity"];
  };

  const getTitle = () => {
    if (activeTab === "category") return "Categories";
    if (activeTab === "brand") return "Brands";
    if (activeTab === "supplier") return "Suppliers";
    if (activeTab === "warehouse") return "Warehouse";
  };

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {["category", "brand", "supplier", "warehouse"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${activeTab === tab ? "border-b-2 border-blue-500 font-semibold" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* FORM SECTION */}
      <div className="mb-10">
        {activeTab === "category" && (
          <NewCategory
            isUpdate={false}
            initialData={{}}
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
        {activeTab === "brand" && (
          <NewBrand
            isUpdate={false}
            initialData={{}}
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
        {activeTab === "supplier" && (
          <NewSupplier
            isUpdate={false}
            initialData={{}}
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
        {activeTab === "warehouse" && (
          <NewWarehouse
            isUpdate={false}
            initialData={{}}
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        )}
      </div>

      {/* TABLE SECTION */}
      <div>
        {/* <FixedHeader title={getTitle()} /> */}
        <h2 className="text-xl font-semibold mb-4 ml-5">List of {getTitle()}</h2>

        <div className="my-4 p-4">
          {loading ? (
            <p className="text-center text-lg">Loading...</p>
          ) : (
            <DataTable
              data={data}
              columns={getColumns()}
              resourceTitle={getTitle().toLowerCase()}
              onDeleteSuccess={() => setRefreshKey((prev) => prev + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}