"use client";

import {
  X,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Send,
  PawPrint,
  Package,
  Timer,
  Ban,
  Phone,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useGetBookingByIdQuery } from "@/redux/features/api/dashboard/sitter/bookings/sitterBookingApi";
import { BookingStatus } from "@/types/dashboard/sitter/sitterBookingTypes";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onMarkInProgress?: (id: string, status: BookingStatus) => void;
  onRequestComplete?: (id: string) => void;
}

const formatPrice = (price: number) => {
  return `$${(price / 100).toFixed(2)}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusConfig = (status: BookingStatus) => {
  const configs: Record<
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
      color: "text-gray-700",
      bg: "bg-gray-100",
      icon: <Ban size={14} />,
    },
  };
  return configs[status] || configs.PENDING;
};

export default function BookingDetailsModal({
  isOpen,
  onClose,
  bookingId,
  onConfirm,
  onCancel,
  onMarkInProgress,
  onRequestComplete,
}: BookingDetailsModalProps) {
  const { data, isLoading } = useGetBookingByIdQuery(bookingId ?? "", {
    skip: !isOpen || !bookingId,
  });

  if (!isOpen || !bookingId) return null;

  const booking = data?.data ?? null;
  const status = booking?.bookingStatus;
  const statusConfig = status ? getStatusConfig(status) : null;

  const canConfirm = status === "PENDING";
  const canCancel =
    status === "PENDING" || status === "CONFIRMED" || status === "LATE";
  const canMarkInProgress = status === "CONFIRMED" || status === "LATE";
  const canRequestComplete = status === "IN_PROGRESS";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#00000040] backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[32px] w-full max-w-[540px] max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-[20px] font-bold text-[#111827]">
            Booking Details
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-[#6B7280]"
          >
            <X size={24} />
          </button>
        </div>

        {isLoading || !booking ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff7176]" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff717610] flex items-center justify-center text-[#ff7176]">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#111827]">
                      {booking.name}
                    </h3>
                    <p className="text-[14px] text-[#6B7280]">
                      Booking ID: #{bookingId?.toUpperCase().slice(0, 8)}
                    </p>
                  </div>
                </div>
                {statusConfig && (
                  <div
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1.5`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </div>
                )}
              </div>

              {/* Booking Info Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#ff7176]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider">Date & Time</p>
                    <p className="text-[15px] font-semibold text-[#111827]">
                      {formatDate(booking.dateTime)} • {formatTime(booking.dateTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#ff7176]">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider">Location</p>
                    <p className="text-[15px] font-semibold text-[#111827] line-clamp-1">
                      {booking.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#ff7176]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider">Customer Phone</p>
                    <p className="text-[15px] font-semibold text-[#111827]">
                      +1 (555) 000-0000
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Instructions / Notes */}
              <div className="space-y-3">
                <h4 className="text-[16px] font-bold text-[#111827]">Special Instructions</h4>
                <div className="p-4 bg-[#FFF1F2] rounded-2xl border border-[#FFE4E6]">
                  <p className="text-[14px] text-[#991B1B] leading-relaxed">
                    Please make sure to feed the cat at exactly 8:00 AM. They are very sensitive about their schedule and might hide if delayed. Also, please check the water bowl is clean.
                  </p>
                </div>
              </div>

              {/* Pets Section */}
              {booking.pets && booking.pets.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[16px] font-bold text-[#111827]">Pets Information</h4>
                    <span className="text-[13px] text-[#ff7176] font-semibold bg-[#ff717610] px-2 py-0.5 rounded-lg">
                      {booking.pets.length} {booking.pets.length === 1 ? 'Pet' : 'Pets'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {booking.pets.map((pet, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-2xl">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-[15px] font-semibold text-[#111827]">{pet.name}</p>
                          <p className="text-[13px] text-[#6B7280]">{pet.age} • Golden Retriever</p>
                        </div>
                        <ChevronRight size={18} className="text-[#D1D5DB]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[16px] font-bold text-[#111827]">Payment Summary</h4>
                <div className="bg-[#f9fafb] rounded-[24px] p-5 space-y-3">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6b7280]">Service Fee</span>
                    <span className="font-semibold text-[#111827]">{formatPrice(booking.price)}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6b7280]">Platform Commission (10%)</span>
                    <span className="font-semibold text-[#111827]">{formatPrice(booking.platformFee)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-[15px] font-bold text-[#111827]">Earnings</span>
                    <span className="text-[20px] font-bold text-[#00a63e]">
                      {formatPrice(booking.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
              {(canConfirm || canMarkInProgress || canRequestComplete) && (
                <div className="grid grid-cols-2 gap-3">
                  {canConfirm && (
                    <button
                      onClick={() => onConfirm?.(bookingId)}
                      className="px-4 py-3.5 bg-[#ff7176] hover:bg-[#ff5a60] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#ff717630] active:scale-[0.98]"
                    >
                      Confirm Booking
                    </button>
                  )}
                  {canMarkInProgress && (
                    <button
                      onClick={() => onMarkInProgress?.(bookingId, status!)}
                      className="px-4 py-3.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
                    >
                      Start Task
                    </button>
                  )}
                  {canRequestComplete && (
                    <button
                      onClick={() => onRequestComplete?.(bookingId)}
                      className="px-4 py-3.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
                    >
                      Complete
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => onCancel?.(bookingId)}
                      className="px-4 py-3.5 bg-white border-2 border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-[0.98]"
                    >
                      Decline
                    </button>
                  )}
                </div>
              )}
              {!canConfirm && !canMarkInProgress && !canRequestComplete && (
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] font-bold rounded-2xl transition-all"
                >
                  Close
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
