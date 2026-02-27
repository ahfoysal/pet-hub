// Figma Node: Revenue Flow Bar Chart
// Architectural Intent: Bar chart showing monthly revenue from API monthly-revenue endpoint

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
import { useGetMonthlyRevenueQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";

export const RevenueFlowChart = () => {
  const { data: revenueData, isLoading } = useGetMonthlyRevenueQuery();

  const chartData = revenueData?.data ?? [];

  return (
    <div className="bg-white border border-[#e5e7eb] p-[25px] rounded-[14px] h-[394px] w-full">
      <h3 className="font-['Nunito',sans-serif] font-normal text-[18px] leading-[28px] text-[#0f172b] mb-[16px]">
        Revenue Flow
      </h3>
      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-[#00c875] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
              <Bar dataKey="revenue" fill="#00c875" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#00c875" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
