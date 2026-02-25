"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { month: "Aug", revenue: 45000 },
  { month: "Sep", revenue: 52000 },
  { month: "Oct", revenue: 48000 },
  { month: "Nov", revenue: 61000 },
  { month: "Dec", revenue: 55000 },
  { month: "Jan", revenue: 68000 },
  { month: "Feb", revenue: 40000 },
];

export const RevenueFlowChart = () => {
  return (
    <div className="bg-white border border-[#e5e7eb] p-[25px] rounded-[14px] h-[394px] w-full">
      <h3 className="font-['Nunito',sans-serif] font-normal text-[18px] leading-[28px] text-[#0f172b] mb-[16px]">
        Revenue Flow
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 12 }} 
            />
            <Tooltip />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#ff7176" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
