"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { DollarSign, Activity, Users, ArrowUpRight, Download } from "lucide-react";
import {
  useGetFinanceStatsQuery,
  useGetGrowthAnalyticsQuery,
  useGetCategoryAnalyticsQuery,
} from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";

// No mock data needed anymore for major charts

export default function AdminAnalyticsClient() {
  const { data: financeStats, isLoading: isFinanceLoading } = useGetFinanceStatsQuery();
  const { data: growthDataResponse } = useGetGrowthAnalyticsQuery();
  const { data: categoryDataResponse } = useGetCategoryAnalyticsQuery();

  const [growthFilter, setGrowthFilter] = useState("12 Months");

  const displayUsers = isFinanceLoading ? "..." : (financeStats?.data?.activeUsers || 0).toLocaleString();
  const displayRevenue = isFinanceLoading ? "..." : (financeStats?.data?.totalRevenue ? `$${(financeStats.data.totalRevenue / 1000).toFixed(1)}K` : "$0");
  
  const displayBookings = isFinanceLoading ? "..." : (financeStats?.data?.totalBookings || 0).toLocaleString();

  const cards = [
    {
      title: "Total Revenue",
      value: displayRevenue,
      trend: "↑ 23.5%",
      trendColor: "text-[#00a63e]",
      icon: <DollarSign size={20} className="text-[#00c875]" />,
      bgIcon: "bg-[#dcfce7]",
    },
    {
      title: "Total Bookings",
      value: displayBookings,
      trend: "↑ 23.5%",
      trendColor: "text-[#00a63e]",
      icon: <Activity size={20} className="text-[#ff7176]" />,
      bgIcon: "bg-[rgba(255,113,118,0.1)]",
    },
    {
      title: "Active Users",
      value: displayUsers,
      trend: "↑ 23.5%",
      trendColor: "text-[#00a63e]",
      icon: <Users size={20} className="text-[#8b5cf6]" />,
      bgIcon: "bg-[#f3e8ff]",
    },
    {
      title: "Platform Growth",
      value: "90%",
      trend: "↑ 23.5%",
      trendColor: "text-[#00a63e]",
      icon: <ArrowUpRight size={20} className="text-[#3b82f6]" />,
      bgIcon: "bg-[#e0e7ff]",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-272.5 mx-auto mt-7">
      <div>
        <h1 className="font-['Arimo',sans-serif] font-normal text-[30px] leading-9 text-[#0a0a0a] m-0">
          Platform Analytics
        </h1>
        <p className="font-['Arimo',sans-serif] font-normal text-[16px] leading-6 text-[#4a5565] m-0 mt-2">
          Comprehensive insights and performance metrics
        </p>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white border-[0.893px] border-[rgba(197,197,197,0.2)] border-solid flex flex-col h-[139.43px] items-start p-4 relative rounded-[8.929px] w-full"
          >
            <div className={`w-9 h-9 rounded-[7.682px] flex items-center justify-center mb-3 ${card.bgIcon}`}>
              {card.icon}
            </div>
            <div className="w-full">
              <p className="font-['Nunito',sans-serif] font-normal text-[16px] text-[#282828] mb-2 leading-4">
                {card.title}
              </p>
              <div className="flex items-center justify-between opacity-90">
                <p className="font-['Nunito',sans-serif] font-bold text-[26px] text-[#282828] leading-8">
                  {card.value}
                </p>
                <p className={`font-['Inter',sans-serif] font-medium text-[16px] ${card.trendColor}`}>
                  {card.trend}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Category */}
        <div className="bg-white rounded-[14px] p-6 border border-[#e5e7eb]">
          <h3 className="font-['Arial'] font-medium text-[16px] text-[#282828] mb-6">
            Total Bookings by Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  categoryDataResponse?.data?.map((item) => ({
                    name: item.category.replace("_", " "),
                    value: item.bookings,
                  })) || []
                }
                barSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "1px solid #eee", 
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                    fontFamily: "Nunito, sans-serif"
                  }}
                />
                <Bar dataKey="value" fill="#ff7176" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Provider */}
        <div className="bg-white rounded-[14px] p-6 border border-[#e5e7eb]">
          <h3 className="font-['Arial'] font-medium text-[16px] text-[#282828] mb-6">
            Revenue by Provider Type
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  categoryDataResponse?.data?.map((item) => ({
                    name: item.category.replace("_", " "),
                    value: item.revenue,
                  })) || []
                }
                barSize={60}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #eee",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                    fontFamily: "Nunito, sans-serif"
                  }}
                />
                <Bar dataKey="value" fill="#00a63e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart Row */}
      <div className="bg-white rounded-[14px] p-6 border border-[#e5e7eb]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h3 className="font-['Arial'] font-bold text-[20px] text-[#282828]">
            Growth Report
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              {["12 Months", "6 Months", "30 Days", "7 Days"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setGrowthFilter(filter)}
                  className={`font-['Arial'] text-[14px] transition-colors ${
                    growthFilter === filter
                      ? "text-[#282828] font-medium border border-[#282828] rounded-md px-3 py-1.5"
                      : "text-[#62748e] hover:text-[#282828]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#d0d0d0] rounded-md text-[#282828] hover:bg-gray-50 transition-colors">
              <Download size={16} />
              <span className="font-['Arial'] font-bold text-[14px]">
                Export PDF
              </span>
            </button>
          </div>
        </div>

        <div className="h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={
                growthDataResponse?.data?.map((item) => ({
                  name: item.name,
                  value1: item.users * 10, // Scale for better visualization if small nums
                  value2: item.bookings,
                })) || []
              }
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#52525b", fontSize: 14, fontFamily: "Plus Jakarta Sans, sans-serif" }}
                dy={10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #eee",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  fontFamily: "Nunito, sans-serif"
                }}
              />
              <Line
                type="monotone"
                dataKey="value1"
                stroke="#ff7176"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 8,
                  fill: "#ff7176",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="value2"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
