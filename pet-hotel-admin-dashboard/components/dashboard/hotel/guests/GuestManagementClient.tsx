/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  useGetHotelBookingsQuery,
} from "@/redux/features/api/dashboard/hotel/booking/hotelBookingApi";
import { 
  PageHeader, 
  TableContainer 
} from "@/components/dashboard/shared/DashboardUI";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import GuestDetailsModal from "./GuestDetailsModal";

export default function GuestManagementClient() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: bookingsData,
    isLoading,
    isError,
    refetch,
  } = useGetHotelBookingsQuery({
    page: currentPage,
    limit: 10,
    status: filterStatus === "ALL" ? undefined : filterStatus,
    search: searchTerm,
  });

  const bookings = bookingsData?.data?.items || [];
  const statusOptions = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
    "CHECKED_OUT",
    "CANCELLED",
    "COMPLETED",
  ];

  const [detailsBookingId, setDetailsBookingId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load guests</h2>
          <button onClick={() => refetch()} className="px-5 py-2.5 bg-[#ff7176] text-white rounded-xl font-medium">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[25px] pb-10 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title="Guest Management" 
        subtitle="Manage pets and their stay details" 
      />

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] p-[17px] shadow-sm flex items-center justify-between gap-4">
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-[12px] pointer-events-none">
            <Image src="/assets/search-gray.svg" alt="Search" width={20} height={20} />
          </div>
          <input
            type="text"
            placeholder="Search by pet or owner name..."
            className="w-full pl-[40px] pr-4 py-[9px] border border-[#d1d5dc] rounded-[10px] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 text-[#0a0a0a] placeholder:text-[#0a0a0a]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white rounded-lg border border-transparent hover:bg-gray-50 transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="#4A5565" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="sr-only">Filter</span>
            </button>
            <div className="relative group">
                <select 
                    className="appearance-none bg-white border border-[#d1d5dc] rounded-[10px] pl-4 pr-10 py-[9px] text-[16px] text-[#282828] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 transition-all cursor-pointer min-w-[140px]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt === "ALL" ? "All Status" : opt.charAt(0) + opt.slice(1).toLowerCase().replace('_', ' ')}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Image src="/assets/next-arrow.svg" alt="Arrow" width={16} height={16} className="rotate-90 opacity-40" />
                </div>
            </div>
        </div>
      </div>

      <TableContainer 
        title="All Guests" 
        footer={
          <div className="flex items-center justify-between">
            <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-[14px] py-[8px] bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[14px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Image src="/assets/prev-arrow.svg" alt="Prev" width={20} height={20} />
              Previous
            </button>
            <div className="flex items-center gap-[2px]">
              {[1, 2, 3].map((page) => (
                <button 
                    key={page} 
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-medium transition-all ${currentPage === page ? "bg-[#ff7176]/10 text-[#ff7176]" : "text-[#667085] hover:bg-gray-50"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="flex items-center gap-2 px-[14px] py-[8px] bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors"
            >
              Next
              <Image src="/assets/next-arrow.svg" alt="Next" width={20} height={20} />
            </button>
          </div>
        }
      >
        <table className="w-full border-collapse">
          <thead className="bg-[#f9fafb]">
            <tr>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Pet Details</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Owner</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Room</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Check In</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Check Out</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Vaccination</th>
              <th className="px-6 py-4 text-right text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            {bookings.map((booking: any) => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors h-[89px]">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-normal text-[#0a0a0a] leading-tight">{booking.petProfile?.name || "Max"}</span>
                    <span className="text-[14px] font-normal text-[#4a5565]">Dog - {booking.petProfile?.breed || "Golden Retriever"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-normal text-[#0a0a0a] leading-tight">{booking.user?.fullName || "John Smith"}</span>
                    <span className="text-[14px] font-normal text-[#4a5565]">{booking.user?.phone || "+1 234-567-8900"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-normal text-[#0a0a0a] leading-tight">{booking.room?.name || "Comfort Den 103"}</span>
                    <span className="text-[14px] font-normal text-[#4a5565] capitalize">{booking.room?.category?.toLowerCase() || "Single"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Image src="/assets/calendar.svg" alt="Date" width={16} height={16} className="opacity-60" />
                    <span className="text-[14px] font-normal text-[#0a0a0a]">
                        {format(new Date(booking.checkInDate), "yyyy-MM-dd")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Image src="/assets/calendar.svg" alt="Date" width={16} height={16} className="opacity-60" />
                    <span className="text-[14px] font-normal text-[#0a0a0a]">
                        {format(new Date(booking.checkOutDate), "yyyy-MM-dd")}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-[#dcfce7] text-[#008236] text-[12px] px-[12px] py-[4px] rounded-full font-normal">
                    Up to Date
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setDetailsBookingId(booking.id)}
                    className="text-[#ff7176] text-[16px] font-normal hover:underline inline-flex items-center gap-1.5"
                  >
                    <Image src="/assets/view-eye.svg" alt="View" width={16} height={16} />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-20 text-gray-500">
                        No guests or bookings found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </TableContainer>

      <GuestDetailsModal 
        isOpen={!!detailsBookingId} 
        onClose={() => setDetailsBookingId(null)} 
        bookingId={detailsBookingId}
      />
    </div>
  );
}
