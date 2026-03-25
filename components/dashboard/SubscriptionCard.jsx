import Link from "next/link";
import React from "react";

export default function SubscriptionCard() {
  return (
    <div className="w-full px-3">
      <div className="w-full rounded-lg bg-slate-900 shadow-md p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="border-b border-slate-700 pb-2">
          <p className="text-sm text-slate-200">
            Your premium plan's trial expires in{" "}
            <span className="text-orange-400 font-semibold">13 days</span>.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 transition py-2 rounded-md border border-slate-700">
            Cancel
          </button>
          <Link
            href="#"
            className="flex-1 text-sm text-white bg-orange-500 hover:bg-orange-600 transition py-2 rounded-md text-center font-medium"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </div>
  );
}
