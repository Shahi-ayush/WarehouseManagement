"use client";
import {
  BaggageClaim,
  BarChart,
  Book,
  Cable,
  ChevronLeft,
  Home,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SubscriptionCard from "./SubscriptionCard";
import SidebarDropdownLink from "./SidebarDropdownLink";

export default function Leftmenu() {
  const inventoryLinks = [
    { title: "All", href: "/dashboard/inventory" },
    { title: "Items", href: "/dashboard/inventory/items" },
    { title: "Categories", href: "/dashboard/inventory/categories" },
    { title: "Brands", href: "/dashboard/inventory/brands" },
    // { title: "Units", href: "/dashboard/inventory/units" },
    { title: "Warehouse", href: "/dashboard/inventory/warehouse" },
    { title: "Supplier", href: "/dashboard/inventory/suppliers" },
    { title: "Inventory Adjustment", href: "/dashboard/inventory/adjustments" },
  ];

    const salesLinks = [
    
    { title: "Customers", href: "/dashboard/purchases/allcustomers/new" },
    // { title: "New Customers ", href: "/dashboard/purchases/customers/new" },


  ];

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-50 shadow-xl flex flex-col justify-between fixed">
      
      {/* ===== TOP SECTION ===== */}
      <div>
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center space-x-3 py-4 px-5 border-b border-slate-700 hover:bg-slate-800/60 transition-all duration-200"
        >
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-wide">STOCK SEEK</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-2 px-4 py-6">
          {/* Home */}
          <Link
            href="/dashboard/home/overview"
            className="flex items-center space-x-3 bg-blue-600/90 hover:bg-blue-700 transition-all duration-200 text-white font-medium py-2.5 px-3 rounded-lg shadow-sm"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>

          {/* Inventory Dropdown */}
          <SidebarDropdownLink
            items={inventoryLinks}
            title="Inventory"
            icon={BaggageClaim}
          />

      

  {/* Inventory Dropdown */}
          <SidebarDropdownLink
            items={salesLinks}
            title="Customers"
            icon={ShoppingBasket}
          />

          
          {/* Integrations */}
          <Link
            href="/dashboard/purchases"
            className="flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200 py-2 px-3 rounded-lg"
          >
            <Cable className="w-5 h-5" />
            <span>Sales</span>
          </Link>
          {/* Reports */}
          <Link
            href="/dashboard/reports"
            className="flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200 py-2 px-3 rounded-lg"
          >
            <BarChart className="w-5 h-5" />
            <span>Reports</span>
          </Link>

         
        </nav>
      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className=" py-3 flex flex-col items-center gap-3 px-3">
        {/* Full-width Subscription Card */}
        <SubscriptionCard />

        {/* Back button */}
        <button className="border-t border-slate-700 w-full flex justify-center items-center py-2.5 hover:bg-slate-800 transition-colors duration-200 rounded-md">
          <ChevronLeft className="text-slate-400 hover:text-white transition-colors duration-200" />
        </button>
      </div>
    </aside>
  );
}
