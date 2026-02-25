"use client";

import React from "react";
import { 
  BarChart3, 
  DollarSign, 
  Layers, 
  TrendingUp, 
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  useGetSitterStatsQuery, 
  useGetSitterBookingRatioQuery, 
  useGetSitterBookingTrendsQuery 
} from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Skeleton } from "@nextui-org/react";
import { useSession } from "next-auth/react";

const COLORS = ["#0a0a0a", "#99a1af"];

interface SitterStatCardProps { 
  icon: React.ElementType, 
  title: string, 
  value: string, 
  trend: string,
  trendColor?: string
}

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  trendColor = "text-[#008236]" 
}: SitterStatCardProps) => (
  <div className="bg-white border-[#e5e7eb] border-[0.77px] p-5 rounded-[11.375px] shadow-[0px_0.77px_1.55px_0px_rgba(0,0,0,0.1),0px_0.77px_2.38px_0px_rgba(0,0,0,0.1)] flex flex-col justify-between h-36">
    <div className="flex items-center gap-2.5">
      <Icon size={19.5} className="text-[#0a0a0a]" />
      <span className="text-sm font-arimo text-[#0a0a0a] opacity-90">{title}</span>
    </div>
    <div className="text-3xl font-arimo text-[#4a5565] mt-2 leading-[29.25px]">
      {value}
    </div>
    <div className={`text-sm font-arimo ${trendColor} opacity-75 mt-auto`}>
      {trend}
    </div>
  </div>
);

export default function AnalyticsPage() {
  const { status: sessionStatus } = useSession();
  const { data: statsData, isLoading: isStatsLoading } = useGetSitterStatsQuery(undefined, {
    skip: sessionStatus === "loading",
  });
  const { data: ratioData, isLoading: isRatioLoading } = useGetSitterBookingRatioQuery(undefined, {
    skip: sessionStatus === "loading",
  });
  const { data: trendsData, isLoading: isTrendsLoading } = useGetSitterBookingTrendsQuery(new Date().getFullYear(), {
    skip: sessionStatus === "loading",
  });

  const stats = statsData?.data;
  const bookingRatio = (ratioData?.data || []).map((item: { type: string; percentage: number; count: number }) => ({
    name: item.type === "PACKAGE" ? "Package Booking" : "Regular Booking",
    value: item.percentage || 0,
    count: item.count || 0
  }));
  const bookingTrends = (trendsData?.data?.data || []).map((item: { month: string; totalBookings: number; revenue?: number }) => ({
    name: item.month,
    bookings: item.totalBookings || 0,
    // Using bookings as placeholder for revenue if not available, or mapping if exists
    revenue: item.revenue || item.totalBookings * 50 
  }));

  if (isStatsLoading || isRatioLoading || isTrendsLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-[11.375px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[326.6px]">
          <Skeleton className="h-full rounded-[11.375px]" />
          <Skeleton className="h-full rounded-[11.375px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 font-arimo">
      {/* Heading Section */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-normal text-[#0a0a0a] leading-[27.895px]">
          Analytics & Performance
        </h1>
        <p className="text-[12.398px] font-normal text-[#4a5565] leading-[18.597px]">
          Track your pet sitter service growth and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={BarChart3} 
          title="Total Bookings (2025)" 
          value={stats?.bookings?.total?.toString() || "0"} 
          trend="+12% from last year" 
        />
        <StatCard 
          icon={DollarSign} 
          title="Annual Revenue" 
          value={`$${(stats?.totalEarnings || 0).toLocaleString()}`} 
          trend="+18% from last year" 
        />
        <StatCard 
          icon={Layers} 
          title="Active Clients" 
          value={(stats?.activeClients || 1248).toString()} 
          trend="This Year" 
          trendColor="text-[#155dfc]"
        />
        <StatCard 
          icon={TrendingUp} 
          title="Average Services provide" 
          value={(stats?.avgServices || 6.2).toString()} 
          trend="Per month" 
          trendColor="text-[#155dfc]"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[326.6px]">
        {/* Revenue Trend Chart */}
        <div className="bg-white border-[#e5e7eb] border-[0.813px] p-5 rounded-[11.375px] shadow-[0px_0.813px_2.438px_0px_rgba(0,0,0,0.1),0px_0.813px_1.625px_0px_rgba(0,0,0,0.1)] flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-normal text-[#0a0a0a]">Revenue Trend</h2>
            <div className="flex items-center gap-1.5 text-[#ff7176] text-[13px]">
              <TrendingUp size={11} />
              <span>Revenue ($)</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7176" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ff7176" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 9.75 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 9.75 }}
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ff7176" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ratio Chart */}
        <div className="bg-white border-[#e5e7eb] border-[0.813px] p-5 rounded-[11.385px] flex flex-col gap-3">
          <h2 className="text-base font-normal text-[#0a0a0a]">Package & Regular Booking Ratio</h2>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={174}>
              <PieChart>
                <Pie
                  data={bookingRatio}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={52}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {bookingRatio.map((_entry: { name: string; value: number; count: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3">
            {bookingRatio.map((item: { name: string; value: number; count: number }, index: number) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-[#282828]">{item.name}</span>
                </div>
                <span className="text-[11.385px] font-normal text-[#0a0a0a]">{item.value}% ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Chart - Rating Trend */}
      <div className="bg-white border-[#e5e7eb] border-[0.813px] p-5 rounded-[11.375px] shadow-[0px_0.813px_2.438px_0px_rgba(0,0,0,0.1),0px_0.813px_1.625px_0px_rgba(0,0,0,0.1)] flex flex-col gap-5">
        <div className="flex items-center gap-1.5">
          <PieChartIcon size={16} className="text-[#0a0a0a]" />
          <h2 className="text-base font-normal text-[#0a0a0a]">Average Rating Trend</h2>
        </div>
        <div className="h-[243.75px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: "Week 1", rating: 4.2 },
              { name: "Week 2", rating: 4.5 },
              { name: "Week 3", rating: 4.8 },
              { name: "Week 4", rating: 4.6 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 9.75 }} />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 9.75 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="rating" 
                stroke="#0a0a0a" 
                strokeWidth={2}
                fill="#f2f4f8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
