

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/customer-auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });

      const data = await res.json();
      if (res.ok) {
        setToast("OTP sent successfully!");
        setStep("otp");

        // Start countdown
        setTimer(300); // 5 minutes in seconds
        if (intervalId) clearInterval(intervalId);

        const id = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(id);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setIntervalId(id);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and register
  const verifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (timer === 0) {
      setError("OTP expired. Please resend.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/customer-auth/verify-otp-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setToast("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/customer/login"), 2000);
      } else {
        setError(data.error || "OTP invalid");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Format timer for display
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center px-6 py-8 w-full max-w-md">
        {/* Logo */}
        <a
          href="/customer/home"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-10 h-10 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Inventory System
        </a>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 w-full rounded-lg shadow-md p-8 space-y-6 relative">
          <h1 className="text-center text-xl font-bold text-gray-900 dark:text-white">
            Create Customer Account
          </h1>

          {/* Toast */}
          {toast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md text-sm">
              {toast}
            </div>
          )}

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={step === "form" ? sendOtp : verifyOtpAndRegister}
          >
            {/* Step 1: Form Fields */}
            {step === "form" && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Show Password */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="showPassword"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Show password
                  </label>
                </div>
              </>
            )}

            {/* Step 2: OTP input */}
            {step === "otp" && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Countdown */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {timer > 0
                    ? `OTP expires in ${formatTimer(timer)}`
                    : "OTP expired."}
                </div>

                {/* Resend OTP */}
                {timer === 0 && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </>
            )}

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || (step === "otp" && timer === 0)}
              className={`w-full text-white py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-4 ${
                loading || (step === "otp" && timer === 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              }`}
            >
              {loading
                ? "Please wait..."
                : step === "form"
                ? "Register"
                : "Verify & Register"}
            </button>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Already have an account?{" "}
              <Link
                href="/customer/login"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
