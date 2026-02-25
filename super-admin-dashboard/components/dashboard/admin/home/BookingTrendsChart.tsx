"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Aug", bookings: 120 },
  { month: "Sep", bookings: 180 },
  { month: "Oct", bookings: 150 },
  { month: "Nov", bookings: 250 },
  { month: "Dec", bookings: 210 },
  { month: "Jan", bookings: 320 },
  { month: "Feb", bookings: 280 },
];

export const BookingTrendsChart = () => {
  return (
    <div className="bg-white border border-[#e5e7eb] p-[25px] rounded-[14px] h-[394px] w-full">
      <h3 className="font-['Nunito',sans-serif] font-normal text-[18px] leading-[28px] text-[#0f172b] mb-[16px]">
        Platform Booking Trends
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#155dfc"
              strokeWidth={3}
              dot={{ r: 4, fill: "#155dfc" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
