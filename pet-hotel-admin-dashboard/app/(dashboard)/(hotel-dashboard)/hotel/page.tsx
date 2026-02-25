"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { BarChart3 } from "lucide-react";
import { useGetHotelDashboardQuery } from "@/redux/features/api/dashboard/hotel/dashboard/hotelDashboardApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { PageHeader, StatCard, ChartCard, TableContainer } from "@/components/dashboard/shared/DashboardUI";

const PIE_COLORS = ["#ff7176", "#6366f1", "#f59e0b", "#10b981"];

export default function HotelDashboard() {
  const { data: session, status } = useSession();
  const { data, isLoading, isError, refetch } = useGetHotelDashboardQuery(undefined, {
    skip: status === "loading"
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><BarChart3 className="w-8 h-8 text-red-500" /></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load dashboard</h2>
          <button onClick={() => refetch()} className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">Try Again</button>
        </div>
      </div>
    );
  }

  const stats = data?.data?.stats;
  const charts = data?.data?.charts;

  const bookingTrendData = charts?.monthlyBookingTrend?.labels.map((label, i) => ({
    name: label, bookings: charts.monthlyBookingTrend.data[i] ?? 0,
  })) ?? [];

  const roomDistData = charts?.roomTypeDistribution?.labels.map((label, i) => ({
    name: label, value: charts.roomTypeDistribution.data[i] ?? 0,
  })) ?? [];

  const recentBookings = [
    { id: "1024", petName: "Sheru", guestName: "Habib", date: "22/02/2026", duration: "3 Days", type: "Home Sitter", status: "Active" },
    { id: "1025", petName: "Bella", guestName: "Sarah", date: "23/02/2026", duration: "1 Week", type: "Full Boarding", status: "Active" },
    { id: "1026", petName: "Rocky", guestName: "Mike", date: "24/02/2026", duration: "2 Days", type: "Day Care", status: "Upcoming" },
  ];

  return (
    <div className="space-y-8 pb-10 px-2 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title={`Hey ${session?.user?.name?.split(" ")[0] || "Habib"}`} 
        subtitle="Welcome back! Here's what's happening with your hotel" 
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Bookings" value={stats?.totalActiveBookings ?? 0} indicator="12.5% increase" indicatorColor="text-[#10B981]" icon="/assets/calendar.svg" iconBg="bg-[#FF7176]/10" />
        <StatCard title="Active Bookings" value={stats?.totalActiveBookings ?? 0} indicator="5.2% increase" indicatorColor="text-[#10B981]" icon="/assets/calendar.svg" iconBg="bg-[#FF7176]/10" />
        <StatCard title="Completed" value={stats?.totalActiveBookings ?? 0} indicator="8.1% increase" indicatorColor="text-[#10B981]" icon="/assets/calendar.svg" iconBg="bg-[#FF7176]/10" />
        <StatCard title="Upcoming Check-ins" value={stats?.totalActiveBookings ?? 0} indicator="2.4% increase" indicatorColor="text-[#10B981]" icon="/assets/calendar.svg" iconBg="bg-[#FF7176]/10" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Monthly Booking Trend" 
            legend={<div className="flex items-center gap-1 text-[12px] text-gray-500 justify-center"><span className="w-2 h-2 rounded-full bg-[#FF7176]"></span> Bookings</div>}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrendData}>
                <defs><linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF7176" stopOpacity={0.1}/><stop offset="95%" stopColor="#FF7176" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="bookings" stroke="#FF7176" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <ChartCard title="Room Types">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={roomDistData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {roomDistData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Bookings Table */}
      <TableContainer title="Recent Bookings" action={<button className="text-[14px] text-[#FF7176] font-semibold hover:underline">View All</button>}>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              {["Booking ID", "Pet Name", "Guest Name", "Date", "Duration", "Type", "Status", "Action"].map(h => (
                <th key={h} className="px-6 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F1F1]">
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-[14px] font-medium text-gray-900">#{booking.id}</td>
                <td className="px-6 py-4 text-[14px] text-gray-600">{booking.petName}</td>
                <td className="px-6 py-4 text-[14px] text-gray-600">{booking.guestName}</td>
                <td className="px-6 py-4 text-[14px] text-gray-600">{booking.date}</td>
                <td className="px-6 py-4 text-[14px] text-gray-600">{booking.duration}</td>
                <td className="px-6 py-4 text-[14px] text-gray-600">{booking.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-[10px] py-[4px] rounded-full text-[12px] font-bold ${booking.status === 'Active' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-amber-100 text-amber-600'}`}>{booking.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-[12px]">
                    <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-gray-50 hover:bg-gray-100 border border-[#EEEEEE] transition-all"><Image src="/assets/re-book.svg" alt="Re-book" width={16} height={16} /></button>
                    <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-gray-50 hover:bg-gray-100 border border-[#EEEEEE] transition-all"><Image src="/assets/view.svg" alt="View" width={16} height={16} /></button>
                    <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] bg-red-50 hover:bg-red-100 border border-red-100 transition-all"><Image src="/assets/delete.svg" alt="Delete" width={16} height={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
}
