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

// Mock data remains the same
const monthlyTrendData = [
  { name: "Jan", bookings: 12 }, { name: "Feb", bookings: 18 }, { name: "Mar", bookings: 22 },
  { name: "Apr", bookings: 26 }, { name: "May", bookings: 24 }, { name: "Jun", bookings: 30 },
  { name: "Jul", bookings: 35 }, { name: "Aug", bookings: 32 }, { name: "Sep", bookings: 28 },
  { name: "Oct", bookings: 31 }, { name: "Nov", bookings: 34 }, { name: "Dec", bookings: 40 },
];

const revenueGrowthData = [
  { name: "Jan", revenue: 1200 }, { name: "Feb", revenue: 1800 }, { name: "Mar", revenue: 1950 },
  { name: "Apr", revenue: 2400 }, { name: "May", revenue: 2700 }, { name: "Jun", revenue: 3200 },
  { name: "Jul", revenue: 3800 }, { name: "Aug", revenue: 3600 }, { name: "Sep", revenue: 2800 },
  { name: "Oct", revenue: 3000 }, { name: "Nov", revenue: 3400 }, { name: "Dec", revenue: 4200 },
];

const roomTypeData = [
  { name: "Single Room", value: 45, color: "#3b82f6" },
  { name: "Double Room", value: 35, color: "#10b981" },
  { name: "Family Room", value: 20, color: "#f59e0b" },
];

const occupancyData = [
  { name: "Mon", rate: 58 }, { name: "Tue", rate: 68 }, { name: "Wed", rate: 62 },
  { name: "Thu", rate: 72 }, { name: "Fri", rate: 82 }, { name: "Sat", rate: 95 }, { name: "Sun", rate: 88 },
];

const statCards = [
  { title: "Total Bookings (2025)", value: "304", indicator: "+12% from last year", indicatorColor: "text-[#008236]", icon: "/assets/total-bookings.svg", iconBg: "bg-[#FF7176]/5" },
  { title: "Annual Revenue", value: "$33,250", indicator: "+18% from last year", indicatorColor: "text-[#008236]", icon: "/assets/annual-revenue.svg", iconBg: "bg-[#008236]/5" },
  { title: "Avg Occupancy Rate", value: "78%", indicator: "Excellent performance", indicatorColor: "text-[#155dfc]", icon: "/assets/occupancy-rate.svg", iconBg: "bg-[#7C3AED]/5" },
  { title: "Avg Stay Duration", value: "6.2", indicator: "nights per booking", indicatorColor: "text-[#155dfc]", icon: "/assets/stay-duration.svg", iconBg: "bg-[#3B82F6]/5" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-10 px-2 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title="Analytics & Performance" 
        subtitle="Track your hotel's growth and performance metrics" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
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
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} domain={[0, 40]} />
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
            <BarChart data={revenueGrowthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} domain={[0, 4000]} />
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
                  <Pie data={roomTypeData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" startAngle={90} endAngle={450}>
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Overlay labels */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-[#3b82f6] mb-[60px] translate-x-10">Single: 45%</span>
                <div className="mt-20 -translate-x-12"><span className="text-[10px] text-[#10b981]">Double: 35%</span></div>
                <div className="mt-2 translate-x-16"><span className="text-[10px] text-[#f59e0b]">Family: 20%</span></div>
              </div>
            </div>
            <div className="space-y-3 mt-6">
              {roomTypeData.map((entry, index) => (
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
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="rate" radius={[2, 2, 0, 0]} barSize={40} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
