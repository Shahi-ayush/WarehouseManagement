"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ViewCustomerPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [itemMap, setItemMap] = useState({});
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchCustomer() {
    try {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      if (res.ok) {
        setCustomer(data.customer);
        setItemMap(data.itemMap || {});
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id]);


async function handlePaymentSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const amount = parseFloat(form.amount.value);
  const method = form.method.value;
  const reference = form.reference.value;

  // Check for negative or zero amounts
  if (amount <= 0) {
    alert("Amount must be greater than zero");
    return;
  }

  // Check if amount exceeds balance
  if (summary && amount > summary.balance) {
    alert(`Amount cannot exceed current balance: NPR ${summary.balance.toFixed(2)}`);
    return;
  }

  const res = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId: customer.id, amount, method, reference }),
  });

  if (res.ok) {
    alert("Payment recorded!");
    form.reset();
    fetchCustomer();
  } else {
    alert("Payment failed");
  }
}

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );

  if (!customer)
    return <div className="text-center py-10 text-gray-500">Customer not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Customer Details</h1>

      <div className="space-y-3 text-gray-800 mb-6">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Email:</strong> {customer.email || "-"}</p>
        <p><strong>Address:</strong> {customer.address || "-"}</p>
        <p><strong>Created At:</strong> {new Date(customer.createdAt).toLocaleString()}</p>
      </div>

      {summary && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md shadow-sm">
          <p><strong>Total Sales:</strong> NPR {summary.totalSales.toFixed(2)}</p>
          <p><strong>Total Paid:</strong> NPR {summary.totalPaid.toFixed(2)}</p>
          <p><strong>Balance:</strong> NPR {summary.balance.toFixed(2)}</p>
        </div>
      )}

      <form onSubmit={handlePaymentSubmit} className="mb-6 space-y-2">
        <input type="number" name="amount" placeholder="Amount" required className="border p-2 rounded w-full"/>
        <select name="method" required className="border p-2 rounded w-full">
          <option value="">Select Method</option>
          <option value="CASH">Cash</option>
          <option value="BANK">Bank</option>
        </select>
        <input type="text" name="reference" placeholder="Reference (optional)" className="border p-2 rounded w-full"/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Pay</button>
      </form>

      {/* --- Transaction History Table --- */}
{customer.payments.length > 0 && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Method</th>
            <th className="px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {customer.payments.map(payment => (
            <tr key={payment.id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">{new Date(payment.createdAt).toLocaleTimeString()}</td>
              <td className="px-4 py-2">{payment.method}</td>
              <td className="px-4 py-2">NPR {payment.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


      <h2 className="text-xl font-semibold mb-3">Sales History</h2>

      {customer.sales.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Notes</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {customer.sales.map((sale) => {
                let notesDisplay = "-";
                if (sale.notes) {
                  try {
                    const parsed = JSON.parse(sale.notes);
                    notesDisplay = parsed.map(item => `${itemMap[item.itemId] || item.itemId}: ${item.qty}`).join(", ");
                  } catch {}
                }
                return (
                  <tr key={sale.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-gray-800">NPR {sale.total.toFixed(2)}</td>
                    <td className="px-6 py-3 text-gray-600">{notesDisplay}</td>
                    <td className="px-6 py-3 text-gray-600">{new Date(sale.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic">No sales found for this customer.</p>
      )}

      <div className="mt-6">
        <Link href="/dashboard/purchases/allcustomers/new" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
          ← Back to Customers
        </Link>
      </div>
    </div>
  );
}
