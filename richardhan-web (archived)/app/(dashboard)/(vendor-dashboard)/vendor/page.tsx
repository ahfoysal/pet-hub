// app/(dashboard)/(vendor-dashboard)/vendor/page.tsx
"use client";

import { useGetVendorDashboardQuery } from "@/redux/features/api/dashboard/vendor/dashboard/vendorDashboardApi";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  Boxes,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Types for API response
interface ChartData {
  labels: string[];
  data: number[];
}

interface VendorDashboardData {
  totalProducts: number;
  totalStock: number;
  totalUnitsSold: number;
  totalRevenue: number;
  averageRating: number;
  charts: {
    revenueChart: ChartData;
    unitsSoldChart: ChartData;
    ratingChart: ChartData;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: VendorDashboardData;
}

// Stat Card Component - Clean design with shadow, no borders
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
}

function StatCard({ title, value, icon, iconBg, valueColor = "text-gray-900" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-2 ${valueColor}`}>{value}</p>
        </div>
        <div className={`p-3.5 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for stats
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="w-24 h-4 bg-gray-100 rounded mb-3" />
          <div className="w-20 h-7 bg-gray-100 rounded" />
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// Chart Card Component - Clean with shadow
function ChartCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="h-72 sm:h-80">
        {children}
      </div>
    </div>
  );
}

// Chart skeleton
function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm animate-pulse">
      <div className="w-40 h-6 bg-gray-100 rounded mb-6" />
      <div className="h-72 bg-gray-50 rounded-xl flex items-center justify-center">
        <div className="text-gray-300">Loading chart...</div>
      </div>
    </div>
  );
}

// Format number with commas
function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

// Format currency
function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
}

// Transform chart data for recharts
function transformChartData(labels: string[], data: number[], labelKey: string = "date", valueKey: string = "value") {
  return labels.map((label, index) => {
    let formattedLabel = label;
    if (label.includes("-")) {
      const date = new Date(label);
      if (!isNaN(date.getTime())) {
        formattedLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    }
    return {
      [labelKey]: formattedLabel,
      [valueKey]: data[index] || 0,
    };
  });
}

// Custom tooltip for charts
function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="font-bold text-base">{prefix}{formatNumber(payload[0].value)}{suffix}</p>
      </div>
    );
  }
  return null;
}

// Empty chart state
function EmptyChartState({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
          <Icon className="w-8 h-8 text-gray-300" />
        </div>
        <p className="font-medium text-gray-600">{title}</p>
        <p className="text-sm mt-1 text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  const { status } = useSession();
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetVendorDashboardQuery(undefined, {
    skip: status === "loading",
  }) as { data: ApiResponse | undefined; isLoading: boolean; isError: boolean; refetch: () => void };

  const dashboardData = response?.data;

  // Transform chart data
  const revenueChartData = dashboardData?.charts?.revenueChart?.labels?.length
    ? transformChartData(dashboardData.charts.revenueChart.labels, dashboardData.charts.revenueChart.data, "date", "revenue")
    : [];

  const unitsSoldChartData = dashboardData?.charts?.unitsSoldChart?.labels?.length
    ? transformChartData(dashboardData.charts.unitsSoldChart.labels, dashboardData.charts.unitsSoldChart.data, "date", "units")
    : [];

  const ratingChartData = dashboardData?.charts?.ratingChart?.labels?.length
    ? transformChartData(dashboardData.charts.ratingChart.labels, dashboardData.charts.ratingChart.data, "period", "rating")
    : [];

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-500 mb-5">Something went wrong. Please try again.</p>
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

  return (
    <div className="min-h-screen">
       <div className=" mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Sales performance, product growth, and inventory insights
          </p>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Products"
              value={formatNumber(dashboardData?.totalProducts ?? 0)}
              icon={<Package className="h-6 w-6 text-blue-500" />}
              iconBg="bg-blue-50"
            />
            <StatCard
              title="Units Sold"
              value={formatNumber(dashboardData?.totalUnitsSold ?? 0)}
              icon={<ShoppingCart className="h-6 w-6 text-emerald-500" />}
              iconBg="bg-emerald-50"
              valueColor="text-emerald-600"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(dashboardData?.totalRevenue ?? 0)}
              icon={<DollarSign className="h-6 w-6 text-violet-500" />}
              iconBg="bg-violet-50"
              valueColor="text-violet-600"
            />
            <StatCard
              title="Total Stock"
              value={formatNumber(dashboardData?.totalStock ?? 0)}
              icon={<Boxes className="h-6 w-6 text-primary" />}
              iconBg="bg-primary/10"
              valueColor="text-primary"
            />
            <StatCard
              title="Avg Rating"
              value={dashboardData?.averageRating ? dashboardData.averageRating.toFixed(1) : "N/A"}
              icon={<Star className="h-6 w-6 text-amber-500 fill-amber-500" />}
              iconBg="bg-amber-50"
              valueColor="text-amber-500"
            />
          </div>
        )}

        {/* Charts Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Revenue Trend */}
            <ChartCard title="Revenue Trend">
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#9ca3af' }}
                      tickLine={false}
                      axisLine={{ stroke: '#f3f4f6' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#9ca3af' }}
                      tickLine={false}
                      axisLine={{ stroke: '#f3f4f6' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip prefix="$" />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ff868a"
                      strokeWidth={3}
                      dot={{ fill: "#ff868a", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: "#ff868a", stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Legend 
                      formatter={() => <span className="text-sm text-gray-400">Revenue ($)</span>}
                      wrapperStyle={{ paddingTop: 15 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState 
                  icon={DollarSign}
                  title="No revenue data yet"
                  subtitle="Revenue will appear once you make sales"
                />
              )}
            </ChartCard>

            {/* Units Sold */}
            <ChartCard title="Units Sold Over Time">
              {unitsSoldChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={unitsSoldChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#9ca3af' }}
                      tickLine={false}
                      axisLine={{ stroke: '#f3f4f6' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#9ca3af' }}
                      tickLine={false}
                      axisLine={{ stroke: '#f3f4f6' }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip suffix=" units" />} />
                    <Bar
                      dataKey="units"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                    />
                    <Legend 
                      formatter={() => <span className="text-sm text-gray-400">Units Sold</span>}
                      wrapperStyle={{ paddingTop: 15 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChartState 
                  icon={ShoppingCart}
                  title="No sales data yet"
                  subtitle="Sales will appear once orders are placed"
                />
              )}
            </ChartCard>
          </div>
        )}

        {/* Average Rating Trend */}
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Average Rating Trend" icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}>
            {ratingChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={{ stroke: '#f3f4f6' }}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={{ stroke: '#f3f4f6' }}
                  />
                  <Tooltip content={<CustomTooltip suffix=" stars" />} />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
                  />
                  <Legend 
                    formatter={() => <span className="text-sm text-gray-400">Average Rating</span>}
                    wrapperStyle={{ paddingTop: 15 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState 
                icon={Star}
                title="No ratings yet"
                subtitle="Rating trends will appear once customers leave reviews"
              />
            )}
          </ChartCard>
        )}
      </div>
    </div>
  );
}
