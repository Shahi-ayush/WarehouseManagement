

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerPaymentForm() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [reference, setReference] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/customer/login");
        return;
      }
      try {
        const res = await fetch("/api/customer-auth/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBalance(data.dueBalance || 0);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount!");
      return;
    }
    if (Number(amount) > balance) {
      alert("Amount exceeds due balance!");
      return;
    }

    const token = localStorage.getItem("token");
    setPaying(true);

    try {
      if (method === "bank") {
        // Redirect to demo payment form
        router.push(`/demo-payment?amount=${Number(amount)}`);
      } else if (method === "khalti") {
        // Initiate Khalti payment via your backend
        const res = await fetch("/api/customer-auth/khalti-initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: Number(amount) }),
        });
        const data = await res.json();

        if (data.payment_url) {
          // Redirect user to Khalti hosted payment page
          window.location.href = data.payment_url;
        } else {
          alert("Failed to initiate Khalti payment: " + (data.message || "Unknown error"));
        }
      } else {
        // Cash
        const res = await fetch("/api/customer-auth/paymentclient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, method, reference }),
        });
        const data = await res.json();

        if (res.ok) {
          alert("Payment successful ✅");
          setAmount("");
          setReference("");
          setBalance((prev) => prev - Number(amount));
        } else {
          alert(data.message || "Payment failed ❌");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment request failed ❌");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Pay Due Balance</h2>
      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Due Balance</p>
        <p className="text-2xl font-bold text-red-600">NPR {balance}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded-lg"
          min="1"
          required
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="bank"> Demo Payment (Test Only)</option>
          <option value="khalti">Khalti</option>
        </select>

        {method !== "khalti" && method !== "bank" && (
          <input
            type="text"
            placeholder="Reference (optional)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        )}

        <button
          type="submit"
          disabled={paying}
          className="w-full bg-green-500 text-white py-2 rounded-lg disabled:opacity-60"
        >
          {paying ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
