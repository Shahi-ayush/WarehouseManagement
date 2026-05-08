"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const DEMO_PHONE = "9702237404";
const DEMO_MPIN = "0000";
const DEMO_OTP = "98765";
const OTP_LENGTH = 5;

function DemoPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = Number(searchParams.get("amount")) || 0;

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [phone, setPhone] = useState("");
  const [mpin, setMpin] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("credentials");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/customer-auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser({
            name: data.customer?.name || "Unknown",
            phone: data.account?.phone || "",
            email: data.account?.email || "",
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return undefined;

    const timerId = setInterval(() => setTimeLeft((previous) => previous - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);

    if (value && index < OTP_LENGTH - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const getOtpValue = () => otp.join("");

  const handleVerifyCredentials = () => {
    setError("");

    if (phone !== DEMO_PHONE || mpin !== DEMO_MPIN) {
      setError("Invalid mobile number or MPIN");
      return;
    }

    setStep("otp");
  };

  const handleConfirmPayment = async () => {
    if (getOtpValue() !== DEMO_OTP) {
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
          amount,
          method: "bank",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Payment successful");
        router.push("/customer/dashboard");
      } else {
        alert(data.message || "Payment failed");
      }
    } catch {
      alert("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex overflow-hidden">
        <div className="w-1/2 border-r p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Payment Details
          </h2>

          <div className="bg-[#fff4d6] text-[#8a6d3b] text-sm px-4 py-3 rounded mb-5">
            This transaction will expire in <b>{formatTime()}</b>
          </div>

          <div className="mb-5 text-sm text-gray-700">
            <p className="font-medium mb-1">Billing Information</p>

            {loadingUser ? (
              <p className="text-gray-400">Loading user...</p>
            ) : user ? (
              <>
                <p>{user.name}</p>
                <p className="text-gray-500">{user.phone}</p>
                <p className="text-gray-500">{user.email}</p>
              </>
            ) : (
              <p className="text-red-500">Failed to load user</p>
            )}
          </div>

          <div className="border rounded-lg p-4 text-sm">
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>Rs {amount}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-10">
            Powered by Custom Payment Gateway | Demo Only - No Real Transactions
          </p>
        </div>

        <div className="w-1/2 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded">
              $
            </div>
            <h2 className="text-base font-semibold text-gray-800">
              Demo Wallet
            </h2>
          </div>

          {step === "credentials" ? (
            <>
              <input
                type="text"
                placeholder="9800000000"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full border px-3 py-3 rounded mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="password"
                placeholder="MPIN"
                value={mpin}
                onChange={(event) => setMpin(event.target.value)}
                className="w-full border px-3 py-3 rounded mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </>
          ) : (
            <div className="flex gap-2 justify-between mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpChange(event.target.value, index)}
                  onKeyDown={(event) => handleOtpKeyDown(event, index)}
                  className="w-12 h-12 text-center border rounded text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {step === "credentials" ? (
            <button
              onClick={handleVerifyCredentials}
              className="w-full bg-gray-400 text-white py-3 rounded text-sm font-medium"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleConfirmPayment}
              disabled={processing || timeLeft <= 0}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded text-sm font-medium disabled:opacity-60"
            >
              {processing ? "Processing..." : `Pay Rs ${amount}`}
            </button>
          )}

          <button
            onClick={() => (step === "otp" ? setStep("credentials") : router.back())}
            className="w-full mt-3 text-xs text-gray-500"
          >
            {step === "otp" ? "Edit Details" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-md text-center text-gray-500">
        Loading payment page...
      </div>
    </div>
  );
}

export default function CustomerPaymentForm() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DemoPaymentContent />
    </Suspense>
  );
}
