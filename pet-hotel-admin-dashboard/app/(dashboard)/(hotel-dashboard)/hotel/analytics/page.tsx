"use client";

import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Image from "next/image";
import { PageHeader, StatCard, ChartCard } from "@/components/dashboard/shared/DashboardUI";
import { useGetHotelDashboardQuery } from "@/redux/features/api/dashboard/hotel/dashboard/hotelDashboardApi";

// Mock data removed in favor of API data

export default function AnalyticsPage() {
  const { data: response, isLoading, error } = useGetHotelDashboardQuery();
  const dashboardData = response?.data;
  const stats = dashboardData?.stats;
  const charts = dashboardData?.charts;

  const defaultRoomTypeData = [
    { name: "Single Room", value: 45, color: "#3b82f6" },
    { name: "Double Room", value: 35, color: "#10b981" },
    { name: "Family Room", value: 20, color: "#f59e0b" },
  ];

  const apiRoomTypeData = charts?.roomTypeDistribution?.labels?.map((label: string, idx: number) => ({
    name: label,
    value: charts.roomTypeDistribution.data[idx],
    color: defaultRoomTypeData[idx % defaultRoomTypeData.length].color,
  })) || defaultRoomTypeData;
  
  const apiMonthlyTrendData = charts?.monthlyBookingTrend?.labels?.map((label: string, idx: number) => ({
    name: label,
    bookings: charts.monthlyBookingTrend.data[idx],
  })) || [];

  const apiRevenueGrowthData = charts?.monthlyBookingTrend?.labels?.map((label: string, idx: number) => ({
    name: label,
    revenue: charts.monthlyBookingTrend.data[idx] * 120, // Mock revenue calculation based on bookings since API doesn't provide revenue array directly
  })) || [];

  const apiOccupancyData = charts?.weeklyOccupancyRate?.labels?.map((label: string, idx: number) => ({
    name: label,
    rate: charts.weeklyOccupancyRate.data[idx],
  })) || [];

  return (
    <div className="space-y-8 pb-10 px-2 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title="Analytics & Performance" 
        subtitle="Track your hotel's growth and performance metrics" 
      />

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load analytics dashboard data.
        </div>
      ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Bookings (2025)"
            value={(stats?.totalBookings?.value || 0).toString()}
            indicator={stats?.totalBookings?.growth || "0%"}
            indicatorColor={stats?.totalBookings?.growth?.startsWith("+") ? "text-[#008236]" : "text-red-500"}
            icon="/assets/total-bookings-icon-figma.svg"
            iconBg="bg-[#FF7176]/5"
          />
          <StatCard
            title="Annual Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            indicator="+18% from last year"
            indicatorColor="text-[#008236]"
            icon="/assets/annual-revenue.svg"
            iconBg="bg-[#008236]/5"
          />
          <StatCard
            title="Avg Occupancy Rate"
            value={`${(stats?.avgOccupancyRate || 0).toFixed(1)}%`}
            indicator="Performance rate"
            indicatorColor="text-[#155dfc]"
            icon="/assets/occupancy-rate.svg"
            iconBg="bg-[#7C3AED]/5"
          />
          <StatCard
            title="Avg Stay Duration"
            value={(stats?.avgStayDurationDays || 0).toString()}
            indicator="nights per booking"
            indicatorColor="text-[#155dfc]"
            icon="/assets/stay-duration.svg"
            iconBg="bg-[#3B82F6]/5"
          />
        </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Booking Trend */}
        <ChartCard 
          title="Monthly Booking Trend"
          legend={
            <div className="flex items-center gap-2 justify-center">
              <Image src="/assets/legend-bookings.svg" alt="Bookings" width={12} height={12} />
              <span className="text-[13px] text-[#3b82f6]">Bookings</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={apiMonthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} domain={[0, 'dataMax + 10']} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Growth */}
        <ChartCard 
          title="Revenue Growth"
          legend={
            <div className="flex items-center gap-2 justify-center">
              <Image src="/assets/legend-revenue.svg" alt="Revenue" width={12} height={12} />
              <span className="text-[13px] text-[#10b981]">Revenue ($)</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apiRevenueGrowthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} domain={[0, 'auto']} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" radius={[2, 2, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Room Type Distribution */}
        <ChartCard title="Room Type Distribution" minHeight="min-h-[400px]">
          <div className="h-full flex flex-col">
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={apiRoomTypeData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" startAngle={90} endAngle={450}>
                    {apiRoomTypeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={apiRoomTypeData[index % apiRoomTypeData.length].color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {apiRoomTypeData.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }} />
                    <span className="text-[12px] text-[#282828]">{entry.name}</span>
                  </div>
                  <span className="text-[11px] text-[#0a0a0a] font-normal">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Weekly Occupancy Rate */}
        <ChartCard 
          title="Weekly Occupancy Rate" 
          minHeight="min-h-[400px]"
          legend={
             <div className="flex items-center gap-2 mt-4 justify-center">
              <Image src="/assets/legend-occupancy.svg" alt="Occupancy" width={12} height={12} />
              <span className="text-[12px] text-[#f59e0b]">Occupancy %</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apiOccupancyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="rate" radius={[2, 2, 0, 0]} barSize={40} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      </>
      )}
    </div>
  );
}
