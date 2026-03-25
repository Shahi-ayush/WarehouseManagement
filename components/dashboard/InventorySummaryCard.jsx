import React from 'react';

export default function InventorySummaryCard({ item }) {
  return (
    <div className="
      mb-4 shadow rounded-lg 
      border border-slate-200 hover:border-blue-400 
      p-4 bg-white py-2 flex items-center justify-between 
      gap-3 transition-all duration-300
      hover:shadow-lg
    ">
      <h2 className="uppercase text-sm text-slate-500">{item.title}</h2>
      <h4 className="text-2xl font-semibold text-slate-800">{item.number}</h4>
    </div>
  );
}
