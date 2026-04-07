"use client";

import { Suspense } from "react";
import CustomerPaymentForm from "@/components/payment/PaymentForm";
import PaymentStatusBanner from "@/components/payment/PaymentStatusBanner";

export default function PaymentPage() {
  return (
    <div className="p-6">
      <Suspense fallback={null}>
        {/* <PaymentStatusBanner /> */}
      </Suspense>
      <CustomerPaymentForm />
    </div>
  );
}