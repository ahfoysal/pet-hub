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
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">
              Booking Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {isLoading || !booking ? (
            <div className="px-6 pb-6 flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="px-6 pb-6 space-y-5 flex-1 overflow-y-auto">
                {/* Image + Status */}
                {booking.image && (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                    <img
                      src={booking.image}
                      alt={booking.name}
                      className="w-full h-full object-cover"
                    />
                    {statusConfig && (
                      <div
                        className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.color} ${statusConfig.bg} backdrop-blur-md`}
                      >
                        {statusConfig.icon}
                        {statusConfig.label}
                      </div>
                    )}
                  </div>
                )}

                {/* Title Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {booking.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          booking.bookingType === "PACKAGE"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        <Package size={12} />
                        {booking.bookingType}
                      </span>
                    </div>
                  </div>
                  {!booking.image && statusConfig && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.color} ${statusConfig.bg}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  )}
                </div>

                {/* Late Warning */}
                {status === "LATE" && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">
                        This booking is late
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        The 15-minute window after confirmation has passed. You
                        can still start this booking, but it will be marked as a
                        late start.
                      </p>
                    </div>
                  </div>
                )}

                {/* Date, Time & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1.5">
                      <Calendar size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Date & Time
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(booking.dateTime)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatTime(booking.dateTime)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1.5">
                      <MapPin size={16} />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Location
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      {booking.location}
                    </p>
                  </div>
                </div>

                {/* Pets */}
                {booking.pets && booking.pets.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                      <PawPrint size={16} />
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Pets ({booking.pets.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {booking.pets.map((pet, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="h-11 w-11 rounded-xl object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {pet.name}
                            </p>
                            <p className="text-xs text-gray-500">{pet.age}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services */}
                {booking.servicesInPackage &&
                  booking.servicesInPackage.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-700 mb-3">
                        <Package size={16} />
                        <span className="text-sm font-semibold uppercase tracking-wide">
                          Services
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.servicesInPackage.map((service, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Price Breakdown */}
                <div className="p-4 bg-primary/5 rounded-2xl">
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <DollarSign size={16} />
                    <span className="text-sm font-semibold uppercase tracking-wide">
                      Price Breakdown
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Price</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(booking.price)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(booking.platformFee)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between text-sm pt-2 mt-2"
                      style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
                    >
                      <span className="font-semibold text-gray-900">
                        Grand Total
                      </span>
                      <span className="font-bold text-primary text-base">
                        {formatPrice(booking.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cancel Info */}
                {booking.cancelInfo && (
                  <div className="p-4 bg-red-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <XCircle size={16} />
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Cancellation Info
                      </span>
                    </div>
                    {booking.cancelInfo.reason && (
                      <p className="text-sm text-gray-700">
                        {booking.cancelInfo.reason}
                      </p>
                    )}
                    {booking.cancelInfo.cancelledBy && (
                      <p className="text-xs text-gray-500 mt-1">
                        Cancelled by: {booking.cancelInfo.cancelledBy}
                      </p>
                    )}
                  </div>
                )}

                {/* Completion Info */}
                {booking.completionInfo && (
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Completion Info
                      </span>
                    </div>
                    {booking.completionInfo.completionNote && (
                      <p className="text-sm text-gray-700">
                        {booking.completionInfo.completionNote}
                      </p>
                    )}
                    {booking.completionInfo.files &&
                      booking.completionInfo.files.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {booking.completionInfo.files.map((file, idx) => (
                            <img
                              key={idx}
                              src={file}
                              alt={`Proof ${idx + 1}`}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="px-6 pt-4 pb-6 bg-white flex-shrink-0">
                {(canConfirm ||
                  canCancel ||
                  canMarkInProgress ||
                  canRequestComplete) && (
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    {canConfirm && (
                      <button
                        onClick={() => onConfirm?.(bookingId)}
                        className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Confirm Booking
                      </button>
                    )}
                    {canMarkInProgress && (
                      <button
                        onClick={() =>
                          onMarkInProgress?.(bookingId, status!)
                        }
                        className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <Play size={18} />
                        Mark In Progress
                      </button>
                    )}
                    {canRequestComplete && (
                      <button
                        onClick={() => onRequestComplete?.(bookingId)}
                        className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <Send size={18} />
                        Request Completion
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => onCancel?.(bookingId)}
                        className="flex-1 px-4 py-3 bg-white text-red-500 font-medium rounded-xl transition-colors inline-flex items-center justify-center gap-2 hover:bg-red-50"
                        style={{ border: "1px solid #fecaca" }}
                      >
                        <XCircle size={18} />
                        Cancel
                      </button>
                    )}
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
