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
  LineChart,
  Line,
} from "recharts";
import { useSession } from "next-auth/react";
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  ArrowUpRight 
} from "lucide-react";
import { useGetVendorDashboardQuery } from "@/redux/features/api/dashboard/vendor/dashboard/vendorDashboardApi";
import { PageHeader, StatCard, ChartCard } from "@/components/dashboard/shared/DashboardUI";

export default function VendorAnalyticsPage() {
  const { status } = useSession();
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetVendorDashboardQuery(undefined, {
    skip: status === "loading",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
          <BarChart3 size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 font-arimo">Failed to load analytics</h2>
        <p className="text-gray-500 mb-6 font-arimo">We couldn't retrieve your performance data at this time.</p>
        <button 
          onClick={() => refetch()} 
          className="px-6 py-2 bg-[#ff7176] text-white rounded-xl font-medium hover:bg-[#ff7176]/90 transition-all shadow-md cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const data = response.data;
  const charts = data.charts;

  // Transform chart data for Recharts
  const revenueData = charts.revenueChart.labels.map((label: string, index: number) => ({
    name: label,
    revenue: charts.revenueChart.data[index],
  }));

  const unitsData = charts.unitsSoldChart.labels.map((label: string, index: number) => ({
    name: label,
    units: charts.unitsSoldChart.data[index],
  }));

  // Derived stats
  const avgCompletionRate = Math.min(100, (data.averageRating * 20)).toFixed(0);
  const avgSalesPerMonth = (data.totalUnitsSold / 12).toFixed(1);

  const statCards = [
    { 
      title: "Total Bookings (2025)", 
      value: data.totalUnitsSold, 
      indicator: "+12% from last year", 
      icon: <ShoppingCart className="text-[#ff7176]" size={18} />, 
      iconBg: "bg-[#ff7176]/10",
      trendIcon: <ArrowUpRight size={10} className="text-[#008236]" />,
      isPositive: true
    },
    { 
      title: "Annual Revenue", 
      value: `$${data.totalRevenue.toLocaleString()}`, 
      indicator: "+18% from last year", 
      icon: <DollarSign className="text-[#008236]" size={18} />, 
      iconBg: "bg-[#008236]/10",
      trendIcon: <ArrowUpRight size={10} className="text-[#008236]" />,
      isPositive: true
    },
    { 
      title: "Avg Completion Rate", 
      value: `${avgCompletionRate}%`, 
      indicator: "Excellent performance", 
      indicatorColor: "text-[#155dfc]",
      icon: <TrendingUp className="text-[#155dfc]" size={18} />, 
      iconBg: "bg-[#155dfc]/10",
      isPositive: true 
    },
    { 
      title: "Average Sales (Per Month)", 
      value: avgSalesPerMonth, 
      indicator: "product sales", 
      indicatorColor: "text-[#666]",
      icon: <BarChart3 className="text-[#7C3AED]" size={18} />, 
      iconBg: "bg-[#7C3AED]/10",
      isPositive: true
    },
  ];

  return (
    <div className="space-y-8 pb-10 px-1 font-arimo">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Trend */}
        <ChartCard 
          title="Revenue Trend"
          legend={
            <div className="flex items-center gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-[#ff7176]" />
              <span className="text-[13px] text-[#ff7176]">Revenue ($)</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 10 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 10 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#ff7176" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#ff7176', strokeWidth: 0 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Units Sold Over Time */}
        <ChartCard 
          title="Units Sold Over Time"
          legend={
            <div className="flex items-center gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
              <span className="text-[13px] text-[#7C3AED]">Units Sold</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={unitsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 10 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#666', fontSize: 10 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="units" 
                fill="#7C3AED" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
