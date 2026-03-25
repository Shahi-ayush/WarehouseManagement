

"use client";

import { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { Loader2, X, Search } from "lucide-react";
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PurchasesPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [itemSearch, setItemSearch] = useState("");

  // Load transaction history from localStorage
  useEffect(() => {
    if (!session?.user?.email) return;
    const savedHistory =
      JSON.parse(localStorage.getItem(`purchaseHistory_${session.user.email}`)) || [];
    setTransactionHistory(savedHistory);
  }, [session]);

  // Fetch items, warehouses, and all customers
  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsData, warehousesData, customersData] = await Promise.all([
          getData("items"),
          getData("warehouse"),
          fetch("/api/customers").then((res) => res.json()),
        ]);

        const itemsWithWarehouse = itemsData.map((i) => ({
          ...i,
          warehouseTitle:
            warehousesData.find((w) => w.id === i.warehouseId)?.title || "Unknown",
        }));

        setItems(itemsWithWarehouse);
        setWarehouses(warehousesData);
        setAllCustomers(customersData.customers || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Select customer from list
  const selectCustomer = (c) => {
    setCustomer(c);
    setCustomerPhone(c.phone);
  };

  // Check customer by phone input
  useEffect(() => {
    async function fetchCustomer() {
      if (!customerPhone) {
        setCustomer(null);
        return;
      }
      try {
        const res = await fetch(`/api/customers?phone=${customerPhone}`);
        const data = await res.json();
        if (data?.customer) setCustomer(data.customer);
        else setCustomer(null);
      } catch (err) {
        console.error(err);
        setCustomer(null);
      }
    }
    fetchCustomer();
  }, [customerPhone]);

  // Item selection & quantity
  const handleQuantityChange = (itemId, qty) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) return prev.map((i) => (i.id === itemId ? { ...i, qty } : i));
      const item = items.find((i) => i.id === itemId);
      return [...prev, { ...item, qty }];
    });
  };
  const handleRemoveItem = (itemId) =>
    setSelectedItems((prev) => prev.filter((i) => i.id !== itemId));
  const totalAmount = selectedItems.reduce(
    (acc, i) => acc + i.qty * i.sellingPrice,
    0
  );

  // Purchase
  const handlePurchase = async () => {
    if (!customer) return alert("Please select a valid customer");
    if (selectedItems.length === 0) return alert("Select at least one item");

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          items: selectedItems,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Purchase saved successfully!");
        const newInvoice = {
          id: Date.now(),
          customerName: customer.name,
          date: new Date().toLocaleString(),
          items: selectedItems,
          totalAmount,
        };
        const updatedHistory = [newInvoice, ...transactionHistory];
        setTransactionHistory(updatedHistory);
        localStorage.setItem(
          `purchaseHistory_${session.user.email}`,
          JSON.stringify(updatedHistory)
        );
        setSelectedItems([]);
        setCustomerPhone("");
        setCustomer(null);
      } else {
        alert(data.message || "Purchase failed");
      }
    } catch (err) {
      console.error(err);
      alert("Purchase failed");
    }
  };

  // Generate PDF
  const generatePDF = (invoiceData) => {
    if (!invoiceData) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Invoice", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Customer: ${invoiceData.customerName}`, 20, 40);
    doc.text(`Date: ${invoiceData.date}`, 20, 50);
    let startY = 70;
    doc.text("Items", 20, startY);
    doc.text("Qty", 100, startY);
    doc.text("Price", 130, startY);
    doc.text("Total", 160, startY);
    startY += 10;
    invoiceData.items.forEach((i) => {
      doc.text(`${i.title} (${i.warehouseTitle})`, 20, startY);
      doc.text(i.qty.toString(), 100, startY);
      doc.text(i.sellingPrice.toFixed(2), 130, startY);
      doc.text((i.qty * i.sellingPrice).toFixed(2), 160, startY);
      startY += 10;
    });
    doc.text(`Grand Total: ${invoiceData.totalAmount.toFixed(2)}`, 130, startY + 10);
    doc.save(`invoice-${invoiceData.date.replace(/[: ]/g, "_")}.pdf`);
  };

  if (loading || !session)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  const itemsByWarehouse = warehouses.map((w) => ({
    ...w,
    items: items.filter(
      (i) =>
        i.warehouseId === w.id &&
        i.title.toLowerCase().includes(itemSearch.toLowerCase())
    ),
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Sales And Billing
      </h1>

      {/* Customer Selection */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Customer List</h2>
        <input
          type="text"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Search by phone..."
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full md:w-1/3"
        />
        {allCustomers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {allCustomers
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(customerPhone.toLowerCase()) ||
                    c.phone.includes(customerPhone)
                )
                .map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectCustomer(c)}
                  >
                    <td className="border p-2">{c.id}</td>
                    <td className="border p-2">{c.name}</td>
                    <td className="border p-2">{c.phone}</td>
                    <td className="border p-2">{c.email || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {customer && (
          <p className="mt-2 text-green-600 font-medium">
            Selected Customer: {customer.name} ({customer.phone})
          </p>
        )}
      </div>

      {/* Rest of items & purchase sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm max-h-[500px] overflow-y-auto">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
          </div>

          {itemsByWarehouse.map(
            (w) =>
              w.items.length > 0 && (
                <div key={w.id} className="mb-4">
                  <h2 className="font-semibold mb-2">
                    {w.title}{" "}
                    {w.items.every((i) => i.quantity === 0) && "(Out of Stock)"}
                  </h2>
                  <ul className="space-y-2">
                    {w.items.map((item) => (
                      <li
                        key={item.id}
                        className={`flex justify-between items-center border-b py-2 ${
                          item.quantity === 0 ? "opacity-50" : ""
                        }`}
                      >
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            Stock: {item.quantity}, Price: {item.sellingPrice}
                          </p>
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={item.quantity}
                          placeholder="Qty"
                          disabled={item.quantity === 0}
                          className="border px-2 py-1 w-20 rounded"
                          onChange={(e) =>
                            handleQuantityChange(item.id, Number(e.target.value))
                          }
                          value={
                            selectedItems.find((i) => i.id === item.id)?.qty || ""
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </div>

        {/* Selected Items */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm max-h-[500px] overflow-y-auto">
          <h2 className="font-semibold mb-4">Selected Items</h2>
          {selectedItems.length === 0 ? (
            <p className="text-gray-500">No items selected</p>
          ) : (
            <ul className="space-y-2">
              {selectedItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div>
                    <p className="font-medium">
                      {item.title} ({item.warehouseTitle})
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.qty} × {item.sellingPrice} ={" "}
                      {(item.qty * item.sellingPrice).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="text-red-500 font-semibold"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selectedItems.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-lg">
                Total: {totalAmount.toFixed(2)}
              </p>
              <button
                onClick={handlePurchase}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Complete Purchase
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mt-8">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        {transactionHistory.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.customerName}</td>
                  <td className="p-2">{t.date}</td>
                  <td className="p-2">{t.totalAmount.toFixed(2)}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => setViewInvoice(t)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => generatePDF(t)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[90%] md:w-[600px] relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setViewInvoice(null)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-2">Invoice Details</h2>
            <p>Customer: {viewInvoice.customerName}</p>
            <p>Date: {viewInvoice.date}</p>
            <ul className="mt-3 space-y-2 border-t pt-3">
              {viewInvoice.items.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>
                    {i.title} ({i.warehouseTitle}) × {i.qty}
                  </span>
                  <span>{(i.qty * i.sellingPrice).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="font-semibold mt-4 text-right">
              Total: {viewInvoice.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
