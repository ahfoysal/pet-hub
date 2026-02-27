// Figma Node: Platform Booking Trends Chart
// Architectural Intent: Line chart showing monthly booking counts from API growth analytics

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
import { useGetGrowthAnalyticsQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";

export const BookingTrendsChart = () => {
  const { data: growthData, isLoading } = useGetGrowthAnalyticsQuery({});

  const chartData = growthData?.data?.map((item) => ({
    month: item.name,
    bookings: item.bookings,
  })) ?? [];

  return (
    <div className="bg-white border border-[#e5e7eb] p-[25px] rounded-[14px] h-[394px] w-full">
      <h3 className="font-['Nunito',sans-serif] font-normal text-[18px] leading-[28px] text-[#0f172b] mb-[16px]">
        Platform Booking Trends
      </h3>
      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-[#4379EE] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={true} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Nunito" }} 
                stroke="#e5e7eb"
              />
              <YAxis 
                axisLine={true} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Nunito" }} 
                stroke="#e5e7eb"
              />
              <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)" }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#4379EE"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ffffff", stroke: "#4379EE", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#4379EE", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
