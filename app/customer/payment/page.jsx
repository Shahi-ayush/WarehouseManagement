// "use client";

// import { Suspense } from "react";
// import CustomerPaymentForm from "@/components/payment/PaymentForm";
// // import PaymentStatusBanner from "@/components/payment/PaymentStatusBanner";

// export default function PaymentPage() {
//   return (
//     <div className="p-6">
//       <Suspense fallback={null}>
//       </Suspense>
//       <CustomerPaymentForm />
//     </div>
//   );
// }


"use client";

import { Suspense } from "react";
import CustomerPaymentForm from "@/components/payment/PaymentForm";

function Loading() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-10 bg-gray-200 rounded mt-4"></div>
      </div>
      <p className="text-sm text-gray-500 mt-4">Loading payment gateway...</p>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 flex items-center justify-center p-4">

      {/* Background glow */}
      <div className="absolute w-72 h-72 bg-purple-300 blur-3xl opacity-20 rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-300 blur-3xl opacity-20 rounded-full bottom-10 right-10"></div>

      {/* Main container */}
      <div className="relative w-full max-w-5xl">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Secure Payment Gateway
          </h1>
          <p className="text-sm text-gray-500">
            Complete your transaction safely via online
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <Suspense fallback={<Loading />}>
            <CustomerPaymentForm />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5">
          © {new Date().getFullYear()} Secure Payments • Powered by your system
        </p>
      </div>
    </div>
  );
}