"use client";
import { CreditCard, X } from "lucide-react";
import React, { useState } from "react";

export default function DashboardBanner() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="relative isolate overflow-hidden mx-6 my-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white shadow-lg transition-all duration-300">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-10" />

      <div className="grid grid-cols-12 items-center gap-6 px-12 py-8 relative">
        {/* Icon */}
        <div className="col-span-2 flex justify-center">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
            <CreditCard className="w-14 h-14 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="col-span-6 space-y-2">
          <h2 className="font-semibold text-2xl tracking-wide">
            Start accepting online payments
          </h2>
          <p className="text-slate-100/90 text-sm leading-relaxed">
            Businesses are moving toward online payments as they're easy,
            secure, and fast. Enable them for your business today and get paid
            seamlessly.
          </p>
        </div>

        {/* Button */}
        <div className="col-span-3 flex justify-end">
          <button
            className="py-2.5 px-8 uppercase bg-white text-blue-600 font-semibold text-sm rounded-lg 
              shadow-sm hover:bg-slate-100 transition-all duration-200"
          >
            Enable
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setHidden(true)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-all duration-200"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
