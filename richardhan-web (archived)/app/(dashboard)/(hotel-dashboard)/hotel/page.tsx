"use client";

import { useSession } from "next-auth/react";
import {
  Calendar,
  TrendingUp,
  Clock,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useGetHotelDashboardQuery } from "@/redux/features/api/dashboard/hotel/dashboard/hotelDashboardApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  AreaChart,
  Area,
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
  Legend,
} from "recharts";

const PIE_COLORS = ["#ff868a", "#6366f1", "#f59e0b", "#10b981"];

export default function HotelDashboard() {
  const { status } = useSession();
  const { data, isLoading, isError, refetch } = useGetHotelDashboardQuery(
    undefined,
    { skip: status === "loading" }
  );

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-gray-500 mb-5">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.data?.stats;
  const charts = data?.data?.charts;

  // Transform chart data for recharts
  const bookingTrendData =
    charts?.monthlyBookingTrend?.labels.map((label, i) => ({
      name: label,
      bookings: charts.monthlyBookingTrend.data[i] ?? 0,
    })) ?? [];

  const occupancyData =
    charts?.weeklyOccupancyRate?.labels.map((label, i) => ({
      name: label,
      rate: charts.weeklyOccupancyRate.data[i] ?? 0,
    })) ?? [];

  const roomDistData =
    charts?.roomTypeDistribution?.labels.map((label, i) => ({
      name: label,
      value: charts.roomTypeDistribution.data[i] ?? 0,
    })) ?? [];

  const statCards = [
    {
      label: "Active Bookings",
      value: stats?.totalActiveBookings ?? 0,
      icon: Calendar,
      color: "blue",
      bgClass: "bg-blue-50",
      textClass: "text-blue-500",
      valueClass: "text-gray-900",
    },
    {
      label: "Avg Occupancy",
      value: `${(stats?.avgOccupancyRate ?? 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: "emerald",
      bgClass: "bg-emerald-50",
      textClass: "text-emerald-500",
      valueClass: "text-emerald-600",
    },
    {
      label: "Avg Stay Duration",
      value: `${stats?.avgStayDurationDays ?? 0} days`,
      icon: Clock,
      color: "purple",
      bgClass: "bg-purple-50",
      textClass: "text-purple-500",
      valueClass: "text-purple-600",
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: "primary",
      bgClass: "bg-primary/10",
      textClass: "text-primary",
      valueClass: "text-primary",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl text-foreground font-bold">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Welcome back! Here&apos;s what&apos;s happening with your hotel
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {card.label}
                </p>
                <p
                  className={`text-xl sm:text-2xl font-bold ${card.valueClass} mt-1`}
                >
                  {card.value}
                </p>
              </div>
              <div
                className={`order-1 sm:order-2 p-2.5 sm:p-3.5 ${card.bgClass} rounded-xl w-fit transition-transform duration-300 group-hover:scale-110`}
              >
                <card.icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${card.textClass}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Monthly Booking Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Monthly Booking Trend
            </h3>
          </div>
          <div className="h-64 sm:h-72">
            {bookingTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingTrendData}>
                  <defs>
                    <linearGradient
                      id="bookingGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#ff868a"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#ff868a"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#ff868a"
                    strokeWidth={2.5}
                    fill="url(#bookingGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No booking data available yet
              </div>
            )}
          </div>
        </div>

        {/* Room Type Distribution */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <PieChartIcon className="h-4 w-4 text-purple-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Room Types
            </h3>
          </div>
          <div className="h-64 sm:h-72">
            {roomDistData.length > 0 &&
            roomDistData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomDistData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {roomDistData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No room data available yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      {occupancyData.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Weekly Occupancy Rate
            </h3>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    fontSize: "13px",
                  }}
                  formatter={((value: any) => [`${value}%`, "Occupancy"]) as any}
                />
                <Bar
                  dataKey="rate"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
