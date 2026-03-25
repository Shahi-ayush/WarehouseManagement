// app/page.jsx

"use client";

import { ShoppingCart, Users, BarChart2 } from "lucide-react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

export default function HomePage() {
  const stockData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        label: "Available Stock",
        data: [120, 90, 60, 150],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Your Orders",
        data: [20, 35, 25, 40, 50],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/customer/home" className="flex items-center gap-2 group transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors">
              STOCK<span className="text-blue-600">SEEK</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</Link>
            <Link href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
            <Link href="/register" className="text-gray-700 hover:text-blue-600 font-medium">Register</Link>
            <Link href="/customer/login" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300">Login</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-center min-h-screen pt-24">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/lift.jpeg')" }}></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-5xl font-bold text-white mb-6">
            Track Your Orders & Inventory Easily
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Stay updated on your purchases, monitor stock availability, and never miss an item you need.
          </p>
          <Link href="/customer/login" className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition">
            Login to Your Account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-900 dark:text-white">Customer Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <ShoppingCart className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">Order Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See all your orders in one place, track delivery status, and get notifications on updates.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <BarChart2 className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">Purchase Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your purchases and spending trends over time with interactive charts.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <Users className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">Profile & Preferences</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your profile, contact information, and preferences to receive updates tailored to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview with Charts */}
      <section id="analytics" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-900 dark:text-white">Your Dashboard Preview</h2>
          <p className="mb-8 text-gray-700 dark:text-gray-300">
            See a snapshot of your stock availability and order history, even before logging in.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Available Stock</h3>
              <Bar data={stockData} options={options} />
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Your Orders</h3>
              <Line data={salesData} options={options} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-blue-600 text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to start managing your orders?</h2>
        <p className="text-lg mb-8">Sign up now to keep track of your purchases and stay updated on stock availability!</p>
        <Link href="customer-auth/signup" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition">
          Register Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} StockSeek. All rights reserved.
      </footer>
    </div>
  );
}
