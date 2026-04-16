

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Loader2, Link2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function CustomersPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const prefillPhone = searchParams.get("phone") || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const [successMsg, setSuccessMsg] = useState("");
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pre-fill phone
  useEffect(() => {
    if (prefillPhone) {
      setValue("phone", prefillPhone);
    }
  }, [prefillPhone, setValue]);

  // Fetch customers and accounts
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const accountsRes = await fetch("/api/customer-auth/customer-accounts");
        const accountsData = await accountsRes.json();
        setAccounts(accountsData.accounts || []);

        const customersRes = await fetch("/api/customers");
        const customersData = await customersRes.json();
        setCustomers(customersData.customers || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load customers/accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Handle form submit with phone validation
  const onSubmit = async (data) => {
    setSuccessMsg("");

    if (!session?.user) {
      toast.error("You must be logged in to add customers");
      return;
    }

    // Check if phone exists in accounts
    const accountExists = accounts.some(
      (acc) => acc.phone === data.phone
    );

    if (!accountExists) {
      toast.error("Phone number not registered");
      return;
    }

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Customer registered successfully!");
        setSuccessMsg(`✅ ${result.customer.name} has been added.`);
        reset();
        setCustomers((prev) => [...prev, result.customer]);
      } else {
        toast.error(result.message || "Failed to register customer");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Customer deleted successfully!");
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete customer");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* --- Customer Form --- */}
      <div className="bg-white shadow-md rounded-xl p-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Search For Registered Customer
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Enter a registered phone number to find the customer. </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{7,15}$/,
                  message: "Enter a valid phone number",
                },
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 9800000000"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

  {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customers Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter customer's full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Linking...
              </>
            ) : (
              "Search For Registered Customer"
            )}
          </button>
        </form>

        {successMsg && (
          <p className="mt-4 text-green-600 text-sm text-center">{successMsg}</p>
        )}
      </div>

      {/* --- Customers Table --- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Customer List</h1>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Created At</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-100">
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.phone}</td>
                  <td className="border p-2">{c.email}</td>
                  <td className="border p-2">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="border p-2 flex gap-2">
                    <Link
                      href={`/dashboard/purchases/customers/${c.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}