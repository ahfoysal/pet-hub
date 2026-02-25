"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Pet Sitters", value: 36, color: "#155dfc" },
  { name: "Vendors", value: 27, color: "#ff7176" },
  { name: "Pet Hotels", value: 24, color: "#fe9a00" },
  { name: "Pet Schools", value: 14, color: "#00c950" },
];

export const ProviderDistributionChart = () => {
  return (
    <div className="bg-white border border-[#e5e7eb] p-[25px] rounded-[14px] h-[494px] w-full flex flex-col gap-[24px]">
      <h3 className="font-['Nunito',sans-serif] font-medium text-[16px] leading-[28px] text-[#282828]">
        Provider Distribution
      </h3>
      
      <div className="h-[220px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-[24px] font-bold text-[#0f172b]">100%</span>
          <span className="text-[12px] text-[#64748b]">Total Growth</span>
        </div>
      </div>

      <div className="flex flex-col gap-[12px]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="size-[12px] rounded-[3px]" style={{ backgroundColor: item.color }} />
              <span className="font-['Nunito',sans-serif] text-[14px] text-[#4a5565]">{item.name}</span>
            </div>
            <span className="font-['Nunito',sans-serif] font-bold text-[14px] text-[#0f172b]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
