import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SalesActivityCard({ item }) {
  return (
    <Link
      href={item.href}
      className="group relative cursor-pointer shadow-sm rounded-xl border border-slate-200 
        hover:border-blue-400 hover:shadow-lg bg-white 
        flex items-center flex-col gap-3 px-6 py-6
        w-full min-w-0 transition-all duration-300 
        hover:scale-[1.03] active:scale-[0.98]"
    >
      <h4 className={`font-bold text-3xl ${item.color} transition-colors`}>
        {item.number}
      </h4>

      <div className="flex items-center space-x-2 text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
        <CheckCircle2 className="w-4 h-4" />
        <span className="uppercase text-xs tracking-wide font-medium">
          {item.title}
        </span>
      </div>

      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-blue-400 rounded-xl blur-xl transition duration-300"></div>
    </Link>
  );
}
