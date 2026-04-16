"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

const DEMO_PHONE = "9702237404";
const DEMO_MPIN = "0000";
const DEMO_OTP = "98765";

function DemoPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = searchParams.get("amount");
  const [phone, setPhone] = useState("");
  const [mpin, setMpin] = useState("");
  const [otp, setOtp] = useState("");
  const [reference, setReference] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("credentials");
  const [error, setError] = useState("");

  const handleVerifyCredentials = () => {
    setError("");

    if (phone !== DEMO_PHONE || mpin !== DEMO_MPIN) {
      setError("Invalid phone or mpin");
      return;
    }

    setStep("otp");
  };

  const handleConfirmPayment = async () => {
    if (otp !== DEMO_OTP) {
      setError("Invalid OTP");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/customer-auth/paymentclient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          method: "bank",
          reference,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Payment successful ✅");
        router.push("/customer/dashboard");
      } else {
        alert(data.message || "Payment failed ❌");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment request failed ❌");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
          <p className="text-gray-500 text-sm mt-2">Secure and fast payment processing</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-gray-800">NPR {amount}</span>
          </div>

          {step === "credentials" ? (
            <>
              <div className="border-t pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MPIN
                </label>
                <input
                  type="password"
                  placeholder="Enter 4-digit MPIN"
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            </>
          ) : (
            <>
              <div className="border-t pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="Enter 5-digit OTP sent to your device"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

           
            </>
          )}
        </div>

      
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-2">
          {step === "credentials" ? (
            <button
              onClick={handleVerifyCredentials}
              disabled={processing}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
            >
              Verify Credentials
            </button>
          ) : (
            <button
              onClick={handleConfirmPayment}
              disabled={processing}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {processing ? "Processing..." : "Confirm Payment"}
            </button>
          )}

          <button
            onClick={() => (step === "otp" ? setStep("credentials") : router.back())}
            disabled={processing}
            className="w-full py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition disabled:opacity-60"
          >
            {step === "otp" ? "Back to Credentials" : "Go Back"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Secured Payment Processes | Demo Only - No Real Transactions
        </p>
      </div>
    </div>
  );
}

export default function DemoPaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DemoPaymentContent />
    </Suspense>
  );
}
