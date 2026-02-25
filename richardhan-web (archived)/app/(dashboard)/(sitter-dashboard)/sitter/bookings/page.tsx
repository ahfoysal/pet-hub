"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Send,
  Ban,
  Package,
  Loader2,
  ChevronDown,
  CalendarCheck,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetMyBookingsQuery,
  useConfirmBookingMutation,
} from "@/redux/features/api/dashboard/sitter/bookings/sitterBookingApi";
import { useSession } from "next-auth/react";
import {
  SitterBookingListItem,
  BookingStatus,
  BookingType,
} from "@/types/dashboard/sitter/sitterBookingTypes";
import BookingDetailsModal from "@/components/dashboard/sitter/bookings/BookingDetailsModal";
import CancelBookingModal from "@/components/dashboard/sitter/bookings/CancelBookingModal";
import MarkInProgressModal from "@/components/dashboard/sitter/bookings/MarkInProgressModal";
import RequestCompleteModal from "@/components/dashboard/sitter/bookings/RequestCompleteModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Status configurations
const STATUS_CONFIGS: Record<
  BookingStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
    icon: <Clock size={14} />,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: <CheckCircle2 size={14} />,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    icon: <Play size={14} />,
  },
  LATE: {
    label: "Late",
    color: "text-orange-700",
    bg: "bg-orange-50",
    icon: <AlertTriangle size={14} />,
  },
  REQUEST_TO_COMPLETE: {
    label: "Awaiting Approval",
    color: "text-purple-700",
    bg: "bg-purple-50",
    icon: <Send size={14} />,
  },
  COMPLETED: {
    label: "Completed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: <CheckCircle2 size={14} />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50",
    icon: <XCircle size={14} />,
  },
  EXPIRED: {
    label: "Expired",
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: <Ban size={14} />,
  },
};

const STATUS_TABS: { value: BookingStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "LATE", label: "Late" },
  { value: "REQUEST_TO_COMPLETE", label: "Awaiting" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
];

const formatPrice = (price: number) => `$${(price / 100).toFixed(2)}`;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SitterBookingsPage() {
  const { status: sessionStatus } = useSession();
  const { showToast } = useToast();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<BookingType | "">("");

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isInProgressModalOpen, setIsInProgressModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<SitterBookingListItem | null>(null);
  const [inProgressBookingStatus, setInProgressBookingStatus] =
    useState<BookingStatus | null>(null);

  // Data fetching
  const { data, isLoading, isError, refetch } = useGetMyBookingsQuery(
    {
      limit: 20,
      status: statusFilter || undefined,
      bookingType: typeFilter || undefined,
    },
    {
      skip: sessionStatus === "loading",
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Confirm mutation (quick action from list)
  const [confirmBooking, { isLoading: isConfirming }] =
    useConfirmBookingMutation();

  const bookings = data?.data?.data ?? [];

  // Client-side search filter
  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm) return true;
    return b.petOwnerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Stats from current data
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(
    (b) => b.bookingStatus === "PENDING"
  ).length;
  const inProgressCount = bookings.filter(
    (b) =>
      b.bookingStatus === "IN_PROGRESS" || b.bookingStatus === "CONFIRMED"
  ).length;
  const completedCount = bookings.filter(
    (b) => b.bookingStatus === "COMPLETED"
  ).length;

  // Action handlers
  const handleView = (booking: SitterBookingListItem) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleConfirm = async (bookingId: string) => {
    try {
      const result = await confirmBooking(bookingId).unwrap();
      showToast(result.message || "Booking confirmed!", "success");
      setIsDetailModalOpen(false);
      setSelectedBooking(null);
    } catch (err: any) {
      showToast(
        err?.data?.message || "Failed to confirm booking",
        "error"
      );
    }
  };

  const handleOpenCancel = (booking: SitterBookingListItem) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleOpenCancelFromDetail = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsCancelModalOpen(true);
      setIsDetailModalOpen(false);
    }
  };

  const handleOpenInProgress = (
    bookingId: string,
    status: BookingStatus
  ) => {
    setSelectedBooking(
      bookings.find((b) => b.id === bookingId) ?? null
    );
    setInProgressBookingStatus(status);
    setIsInProgressModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleOpenComplete = (bookingId: string) => {
    setSelectedBooking(
      bookings.find((b) => b.id === bookingId) ?? null
    );
    setIsCompleteModalOpen(true);
    setIsDetailModalOpen(false);
  };

  // Quick actions from card/table row
  const handleQuickConfirm = async (
    e: React.MouseEvent,
    booking: SitterBookingListItem
  ) => {
    e.stopPropagation();
    try {
      const result = await confirmBooking(booking.id).unwrap();
      showToast(result.message || "Booking confirmed!", "success");
    } catch (err: any) {
      showToast(
        err?.data?.message || "Failed to confirm booking",
        "error"
      );
    }
  };

  const handleQuickCancel = (
    e: React.MouseEvent,
    booking: SitterBookingListItem
  ) => {
    e.stopPropagation();
    handleOpenCancel(booking);
  };

  const handleQuickInProgress = (
    e: React.MouseEvent,
    booking: SitterBookingListItem
  ) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setInProgressBookingStatus(booking.bookingStatus);
    setIsInProgressModalOpen(true);
  };

  const handleQuickComplete = (
    e: React.MouseEvent,
    booking: SitterBookingListItem
  ) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsCompleteModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load bookings
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

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground font-bold">
            My Bookings
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your pet sitting appointments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Total Bookings
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {totalBookings}
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-blue-50 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Pending
              </p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-amber-50 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Active
              </p>
              <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">
                {inProgressCount}
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-indigo-50 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Completed
              </p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                {completedCount}
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-emerald-50 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by pet owner name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
              style={{ border: "none" }}
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as BookingType | "")}
            className="px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all min-w-[160px]"
            style={{ border: "none" }}
          >
            <option value="">All Types</option>
            <option value="PACKAGE">Package</option>
            <option value="SERVICE">Service</option>
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value as BookingStatus | "")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === tab.value
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Bookings
            <span className="ml-2 text-sm font-normal text-gray-500">
              {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? "s" : ""}
            </span>
          </h2>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => {
              const statusConfig = STATUS_CONFIGS[booking.bookingStatus];
              const canConfirm = booking.bookingStatus === "PENDING";
              const canCancel =
                booking.bookingStatus === "PENDING" ||
                booking.bookingStatus === "CONFIRMED" ||
                booking.bookingStatus === "LATE";
              const canStart =
                booking.bookingStatus === "CONFIRMED" ||
                booking.bookingStatus === "LATE";
              const canComplete =
                booking.bookingStatus === "IN_PROGRESS";

              return (
                <div
                  key={booking.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  style={{
                    borderTop:
                      index !== 0 ? "1px solid #f3f4f6" : "none",
                  }}
                  onClick={() => handleView(booking)}
                >
                  {/* Top Row: Image + Info */}
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={booking.image || "/placeholder-service.jpg"}
                      alt={booking.petOwnerName}
                      className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {booking.petOwnerName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${statusConfig.color} ${statusConfig.bg}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
                            booking.bookingType === "PACKAGE"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          <Package size={10} />
                          {booking.bookingType}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(booking.dateTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pets Row */}
                  {booking.pets && booking.pets.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex -space-x-2">
                        {booking.pets.slice(0, 3).map((pet, idx) => (
                          <img
                            key={idx}
                            src={pet.image}
                            alt={pet.name}
                            className="h-7 w-7 rounded-full object-cover border-2 border-white"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {booking.pets
                          .map((p) => p.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Bottom Row: Price + Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(booking.grandTotal)}
                    </span>
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canConfirm && (
                        <button
                          onClick={(e) =>
                            handleQuickConfirm(e, booking)
                          }
                          disabled={isConfirming}
                          className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {canStart && (
                        <button
                          onClick={(e) =>
                            handleQuickInProgress(e, booking)
                          }
                          className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {canComplete && (
                        <button
                          onClick={(e) =>
                            handleQuickComplete(e, booking)
                          }
                          className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={(e) =>
                            handleQuickCancel(e, booking)
                          }
                          className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(booking);
                        }}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CalendarCheck className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-600">
                No bookings found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || statusFilter || typeFilter
                  ? "Try adjusting your search or filter"
                  : "Your bookings will appear here when pet owners book your services"}
              </p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pet Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pets
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => {
                  const statusConfig =
                    STATUS_CONFIGS[booking.bookingStatus];
                  const canConfirm =
                    booking.bookingStatus === "PENDING";
                  const canCancel =
                    booking.bookingStatus === "PENDING" ||
                    booking.bookingStatus === "CONFIRMED" ||
                    booking.bookingStatus === "LATE";
                  const canStart =
                    booking.bookingStatus === "CONFIRMED" ||
                    booking.bookingStatus === "LATE";
                  const canComplete =
                    booking.bookingStatus === "IN_PROGRESS";

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      style={{
                        borderTop:
                          index !== 0
                            ? "1px solid #f3f4f6"
                            : "none",
                      }}
                      onClick={() => handleView(booking)}
                    >
                      {/* Booking */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              booking.image ||
                              "/placeholder-service.jpg"
                            }
                            alt="Booking"
                            className="h-11 w-11 rounded-xl object-cover"
                          />
                          <div className="ml-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                booking.bookingType === "PACKAGE"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-purple-50 text-purple-600"
                              }`}
                            >
                              <Package size={10} />
                              {booking.bookingType}
                            </span>
                            {booking.servicesInPackage.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1 max-w-[180px] truncate">
                                {booking.servicesInPackage.join(
                                  ", "
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Pet Owner */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {booking.petOwnerName}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.color} ${statusConfig.bg}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(booking.dateTime)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatTime(booking.dateTime)}
                        </div>
                      </td>

                      {/* Pets */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {booking.pets
                              .slice(0, 3)
                              .map((pet, idx) => (
                                <img
                                  key={idx}
                                  src={pet.image}
                                  alt={pet.name}
                                  title={pet.name}
                                  className="h-8 w-8 rounded-full object-cover border-2 border-white"
                                />
                              ))}
                          </div>
                          {booking.pets.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{booking.pets.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPrice(booking.grandTotal)}
                        </div>
                        {booking.platformFee > 0 && (
                          <div className="text-[11px] text-gray-400">
                            Fee: {formatPrice(booking.platformFee)}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          {canConfirm && (
                            <button
                              onClick={(e) =>
                                handleQuickConfirm(e, booking)
                              }
                              disabled={isConfirming}
                              className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Confirm Booking"
                            >
                              Confirm
                            </button>
                          )}
                          {canStart && (
                            <button
                              onClick={(e) =>
                                handleQuickInProgress(
                                  e,
                                  booking
                                )
                              }
                              className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                              title="Mark In Progress"
                            >
                              Start
                            </button>
                          )}
                          {canComplete && (
                            <button
                              onClick={(e) =>
                                handleQuickComplete(e, booking)
                              }
                              className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                              title="Request Completion"
                            >
                              Complete
                            </button>
                          )}
                          {canCancel && (
                            <button
                              onClick={(e) =>
                                handleQuickCancel(e, booking)
                              }
                              className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                              title="Cancel Booking"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(booking);
                            }}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarCheck className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-base font-medium text-gray-600">
                      No bookings found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchTerm || statusFilter || typeFilter
                        ? "Try adjusting your search or filter"
                        : "Your bookings will appear here when pet owners book your services"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        {data?.data?.nextCursor && (
          <div className="p-4 flex justify-center">
            <button
              onClick={() => {
                // Next cursor pagination would be implemented here
                // For now, increase limit
              }}
              className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl transition-colors inline-flex items-center gap-2 text-sm"
            >
              <ChevronDown size={16} />
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingDetailsModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBooking(null);
        }}
        bookingId={selectedBooking?.id ?? null}
        onConfirm={handleConfirm}
        onCancel={handleOpenCancelFromDetail}
        onMarkInProgress={handleOpenInProgress}
        onRequestComplete={handleOpenComplete}
      />

      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />

      <MarkInProgressModal
        isOpen={isInProgressModalOpen}
        onClose={() => {
          setIsInProgressModalOpen(false);
          setSelectedBooking(null);
          setInProgressBookingStatus(null);
        }}
        bookingId={selectedBooking?.id ?? null}
        currentStatus={inProgressBookingStatus}
      />

      <RequestCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setSelectedBooking(null);
        }}
        bookingId={selectedBooking?.id ?? null}
      />
    </div>
  );
}