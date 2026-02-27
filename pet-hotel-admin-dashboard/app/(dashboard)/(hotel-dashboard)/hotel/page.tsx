"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetHotelDashboardQuery } from "@/redux/features/api/dashboard/hotel/dashboard/hotelDashboardApi";
import { useGetHotelBookingsQuery } from "@/redux/features/api/dashboard/hotel/booking/hotelBookingApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { PageHeader } from "@/components/dashboard/shared/DashboardUI";

export default function HotelDashboard() {
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isLoading, isError, refetch } = useGetHotelDashboardQuery(undefined, {
    skip: status === "loading"
  });

  const { data: bookingsData, isLoading: isBookingsLoading } = useGetHotelBookingsQuery({
    page: currentPage,
    limit: itemsPerPage,
  }, {
    skip: status === "loading"
  });

  if (isLoading || isBookingsLoading) return <LoadingSpinner />;

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
  const recentBookings = bookingsData?.data?.data || [];
  const meta = bookingsData?.data?.meta || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

  return (
    <div className="space-y-8 pb-10 px-2 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title={`Hey ${session?.user?.name?.split(" ")[0] || "Habib"} -`} 
        subtitle="Welcome back! Here's your hotel overview" 
      />

      {/* Stat Cards - Matches Figma perfectly */}
      <div className="flex flex-col lg:flex-row items-center gap-[10px] w-full">
        <div className="flex-1 w-full bg-white border border-[#e5e7eb] border-solid rounded-[14px] h-[144px] flex items-center p-6 shadow-sm">
          <div className="flex flex-col gap-[10px] w-full">
            <div className="bg-[#eff6ff] rounded-[10px] w-[48px] h-[48px] flex items-center justify-center">
              <Image src="/assets/total-bookings-icon-figma.svg" alt="Total" width={24} height={24} className="object-contain opacity-50" />
            </div>
            <p className="font-arimo font-normal text-[30px] leading-[36px] text-[#0a0a0a]">
              {stats?.totalBookings?.value ?? 0}
            </p>
            <div className="flex items-center justify-between w-full h-[20px]">
              <p className="font-arimo text-[#4a5565] text-[14px]">Total Bookings</p>
              <div className="flex items-center gap-[4.8px]">
                <span className={`font-['Plus_Jakarta_Sans'] font-medium text-[15.8px] ${stats?.totalBookings?.growth?.startsWith("+") ? "text-[#22c55e]" : "text-red-500"}`}>
                  {stats?.totalBookings?.growth ?? "0%"}
                </span>
                <Image src={stats?.totalBookings?.growth?.startsWith("+") ? "/assets/arrow-up-green-figma.svg" : "/assets/arrow-down-red-figma.svg"} alt="Trend" width={12} height={12} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-white border border-[#e5e7eb] border-solid rounded-[14px] h-[144px] flex items-center p-6 shadow-sm">
          <div className="flex flex-col gap-[10px] w-full">
            <div className="bg-[#f0fdf4] rounded-[10px] w-[48px] h-[48px] flex items-center justify-center">
              <Image src="/assets/active-bookings-icon-figma.svg" alt="Active" width={24} height={24} className="object-contain opacity-50" />
            </div>
            <p className="font-arimo font-normal text-[30px] leading-[36px] text-[#0a0a0a]">
              {stats?.activeBookings?.value ?? 0}
            </p>
            <div className="flex items-center justify-between w-full h-[20px]">
              <p className="font-arimo text-[#4a5565] text-[14px]">Active Bookings</p>
              <div className="flex items-center gap-[4.8px]">
                <span className={`font-['Plus_Jakarta_Sans'] font-medium text-[15.8px] ${stats?.activeBookings?.growth?.startsWith("+") ? "text-[#22c55e]" : "text-red-500"}`}>
                   {stats?.activeBookings?.growth ?? "0%"}
                </span>
                <Image src={stats?.activeBookings?.growth?.startsWith("+") ? "/assets/arrow-up-green-figma.svg" : "/assets/arrow-down-red-figma.svg"} alt="Trend" width={12} height={12} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-white border border-[#e5e7eb] border-solid rounded-[14px] h-[144px] flex items-center p-6 shadow-sm">
          <div className="flex flex-col gap-[10px] w-full">
            <div className="bg-[rgba(152,16,250,0.1)] rounded-[10px] w-[48px] h-[48px] flex items-center justify-center">
              <Image src="/assets/completed-icon-figma.svg" alt="Completed" width={24} height={24} className="object-contain opacity-50" />
            </div>
            <p className="font-arimo font-normal text-[30px] leading-[36px] text-[#0a0a0a]">
              {stats?.completedBookings?.value ?? 0}
            </p>
            <div className="flex items-center justify-between w-full h-[20px]">
              <p className="font-arimo text-[#4a5565] text-[14px]">Completed</p>
              <div className="flex items-center gap-[4.8px]">
                <span className={`font-['Plus_Jakarta_Sans'] font-medium text-[15.8px] ${stats?.completedBookings?.growth?.startsWith("+") ? "text-[#22c55e]" : "text-red-500"}`}>
                  {stats?.completedBookings?.growth ?? "0%"}
                </span>
                <Image src={stats?.completedBookings?.growth?.startsWith("+") ? "/assets/arrow-up-green-figma.svg" : "/assets/arrow-down-red-figma.svg"} alt="Trend" width={12} height={12} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-white border border-[#e5e7eb] border-solid rounded-[14px] h-[144px] flex items-center p-6 shadow-sm">
          <div className="flex flex-col gap-[10px] w-full">
            <div className="bg-[rgba(255,105,0,0.1)] rounded-[10px] w-[48px] h-[48px] flex items-center justify-center">
              <Image src="/assets/upcoming-icon-figma.svg" alt="Upcoming" width={24} height={24} className="object-contain opacity-50" />
            </div>
            <p className="font-arimo font-normal text-[30px] leading-[36px] text-[#0a0a0a]">
              {stats?.upcomingCheckins?.value ?? 0}
            </p>
            <div className="flex items-center justify-between w-full h-[20px]">
              <p className="font-arimo text-[#4a5565] text-[14px]">Upcoming Check-ins</p>
              <div className="flex items-center gap-[4.8px]">
                <span className={`font-['Plus_Jakarta_Sans'] font-medium text-[15.8px] ${stats?.upcomingCheckins?.growth?.startsWith("+") ? "text-[#22c55e]" : "text-red-500"}`}>
                  {stats?.upcomingCheckins?.growth ?? "0%"}
                </span>
                <Image src={stats?.upcomingCheckins?.growth?.startsWith("+") ? "/assets/arrow-up-green-figma.svg" : "/assets/arrow-down-red-figma.svg"} alt="Trend" width={12} height={12} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table - Matches Figma exactly */}
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] w-full flex flex-col pt-[24px]">
        <div className="px-[24px] pb-5 border-b border-[#e5e7eb]">
          <h2 className="text-[#0a0a0a] text-[20px] font-arimo font-normal leading-[28px]">Recent Bookings</h2>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e5e7eb] h-[44.5px]">
                <th className="px-6 py-3 text-[14px] font-arimo font-bold text-[#4a5565]">Pet Name</th>
                <th className="px-6 py-3 text-[14px] font-arimo font-bold text-[#4a5565]">Owner</th>
                <th className="px-6 py-3 text-[14px] font-arimo font-bold text-[#4a5565]">Room</th>
                <th className="px-6 py-3 text-[14px] font-arimo font-bold text-[#4a5565]">Check In</th>
                <th className="px-6 py-3 text-[14px] font-arimo font-bold text-[#4a5565]">Check Out</th>
                <th className="px-6 py-3 text-[14px] font-arimo font-bold text-[#4a5565]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? recentBookings.map((booking: any, index: number) => (
                <tr key={booking._id || index} className="h-[57px] border-b border-[#e5e7eb] hover:bg-gray-50/50">
                  <td className="px-6 text-[16px] font-arimo text-[#0a0a0a] font-normal">{booking.petName || "Max"}</td>
                  <td className="px-6 text-[16px] font-arimo text-[#0a0a0a] font-normal">{booking.guestName || booking.ownerName || "John Smith"}</td>
                  <td className="px-6 text-[16px] font-arimo text-[#0a0a0a] font-normal">{booking.roomType || booking.roomName || "Comfort Den 103"}</td>
                  <td className="px-6 text-[14px] font-arimo text-[#0a0a0a]">
                    <div className="flex items-center gap-2">
                      <Image src="/assets/calendar.svg" alt="date" width={16} height={16} className="opacity-60" />
                      {booking.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : "2025-12-10"}
                    </div>
                  </td>
                  <td className="px-6 text-[14px] font-arimo text-[#0a0a0a]">
                    <div className="flex items-center gap-2">
                       <Image src="/assets/calendar.svg" alt="date" width={16} height={16} className="opacity-60" />
                      {booking.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : "2025-12-10"}
                    </div>
                  </td>
                  <td className="px-[16px] flex items-center gap-[4px] h-[57px]">
                    {/* Render different actions based on status */}
                    {(booking.status === "pending" || booking.status === "upcoming") ? (
                      <button className="flex items-center justify-center rounded-[10px] w-[40px] h-[40px] hover:bg-gray-50 transition-colors">
                        <Image src="/assets/check-circle-figma.svg" alt="Accept" width={24} height={24} />
                      </button>
                    ) : (booking.status === "completed" || booking.status === "cancelled") ? (
                      <button className="flex items-center justify-center rounded-[10px] w-[40px] h-[40px] hover:bg-gray-50 transition-colors">
                        <Image src="/assets/history-circle-figma.svg" alt="History" width={24} height={24} />
                      </button>
                    ) : (
                      <button className="flex items-center justify-center rounded-[10px] w-[40px] h-[40px] hover:bg-gray-50 transition-colors">
                        <Image src="/assets/history-circle-figma.svg" alt="History" width={24} height={24} />
                      </button>
                    )}
                    <button className="flex items-center justify-center rounded-[10px] w-[40px] h-[40px] hover:bg-gray-50 transition-colors">
                      <Image src="/assets/view-eye-action-figma.svg" alt="View" width={24} height={24} />
                    </button>
                    <button className="flex items-center justify-center rounded-[10px] w-[40px] h-[40px] hover:bg-gray-50 transition-colors">
                      <Image src="/assets/delete-trash-figma.svg" alt="Delete" width={20} height={20} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr className="h-[200px]">
                  <td colSpan={6} className="text-center text-gray-500 font-arimo text-[15px]">No recent bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination aligned with the rest of the dashboard */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#e5e7eb] rounded-b-[14px]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {[...Array(meta.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-[#FF7176]/10 text-[#FF7176]"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={currentPage === meta.totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
