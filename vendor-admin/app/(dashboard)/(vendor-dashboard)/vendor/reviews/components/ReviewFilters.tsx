"use client";

import React from "react";
import { Search } from "lucide-react";

interface ReviewFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (query: string) => void;
}

export default function ReviewFilters({
  activeFilter,
  onFilterChange,
  onSearchChange,
}: ReviewFiltersProps) {
  const tabs = [
    { id: "All Reviews", label: "All Reviews" },
    { id: "Pending", label: "Pending" },
    { id: "Replied", label: "Replied" },
    { id: "Flagged", label: "Flagged" },
  ];

  return (
    <div className="bg-white border border-[#dbdbdb] rounded-[14px] p-4 flex flex-col md:flex-row gap-5 items-center justify-between shadow-sm">
      <div className="relative w-full lg:max-w-[673px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by reviewer name or comment..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d1d5dc] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#ff7176]/50 transition-all text-sm font-inter"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-[10px] text-sm font-medium transition-all font-inter h-10 flex items-center justify-center ${
              activeFilter === tab.id
                ? "bg-[#ff7176] text-white shadow-sm"
                : "bg-[#f3f4f6] text-[#364153] hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
