/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetHotelBookingsQuery,
  useCancelHotelBookingMutation,
} from "@/redux/features/api/dashboard/hotel/booking/hotelBookingApi";
import {
  Search,
  Loader2,
  Calendar,
  Clock,
  User,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
  Ban,
} from "lucide-react";
import { useState } from "react";
import BookingDetailsModal from "./BookingDetailsModal";
import { useToast } from "@/contexts/ToastContext";

export default function HotelBookingsClient() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: bookingsData,
    isLoading,
    refetch,
  } = useGetHotelBookingsQuery({
    page: 1,
    limit: 50,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: searchTerm,
  });

  const [cancelBooking] = useCancelHotelBookingMutation();

  const bookings = bookingsData?.data?.items || [];

  const handleCancel = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking({ bookingId, cancelledBy: "HOTEL" }).unwrap();
        showToast("Booking cancelled successfully", "success");
        refetch();
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to cancel booking", "error");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
            Reservations
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            View and manage all incoming bookings for your hotel rooms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID or owner..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-arimo text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-2xl bg-white text-sm font-bold text-gray-600 font-arimo focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest font-arimo border-b border-gray-50">
                  Booking details
                </th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest font-arimo border-b border-gray-50">
                  Pet Owner
                </th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest font-arimo border-b border-gray-50">
                  Dates
                </th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest font-arimo border-b border-gray-50">
                  Status
                </th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest font-arimo border-b border-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-400 font-arimo italic">
                      Synchronizing reservation book...
                    </p>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-nunito font-bold">
                      No reservations found
                    </p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking: any) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 font-nunito">
                            #{booking.id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-400 font-arimo mt-0.5">
                            {booking.room?.name || "Standard Room"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {booking.owner?.user?.image ? (
                            <img
                              src={booking.owner.user.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-700 font-arimo">
                          {booking.owner?.fullName || "Guest User"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-600 font-arimo">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-gray-400 font-arimo flex items-center gap-1">
                          to {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-gray-400 hover:text-primary shadow-sm cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {booking.status === "PENDING" && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="p-2.5 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all text-red-400 shadow-sm"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-300 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {!isLoading && bookings.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl shadow-gray-200">
          <div>
            <h3 className="text-lg font-bold font-nunito">
              Reservation Insights
            </h3>
            <p className="text-gray-400 text-sm font-arimo mt-1">
              You have{" "}
              {bookings.filter((b: any) => b.status === "PENDING").length}{" "}
              pending requests requiring immediate attention.
            </p>
          </div>
          <button className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all mt-4 md:mt-0 shadow-lg shadow-primary/20">
            View Calendar
          </button>
        </div>
      )}

      <BookingDetailsModal
        isOpen={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
