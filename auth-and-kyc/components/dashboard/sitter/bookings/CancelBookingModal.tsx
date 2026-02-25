"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useCancelBookingMutation } from "@/redux/features/api/dashboard/sitter/bookings/sitterBookingApi";
import { SitterBookingListItem } from "@/types/dashboard/sitter/sitterBookingTypes";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: SitterBookingListItem | null;
}

const formatPrice = (price: number) => {
  return `$${(price / 100).toFixed(2)}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function CancelBookingModal({
  isOpen,
  onClose,
  booking,
}: CancelBookingModalProps) {
  const { showToast } = useToast();
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();

  const handleCancel = async () => {
    if (!booking?.id) return;
    try {
      const result = await cancelBooking(booking.id).unwrap();
      showToast(result.message || "Booking cancelled successfully", "success");
      onClose();
    } catch (err: any) {
      showToast(
        err?.data?.message || "Failed to cancel booking",
        "error"
      );
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Cancel Booking</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Are you sure you want to cancel this booking?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  This action cannot be undone. The pet owner will be notified
                  about the cancellation.
                </p>
                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  {booking.image && (
                    <img
                      src={booking.image}
                      alt={booking.petOwnerName}
                      className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {booking.petOwnerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(booking.grandTotal)} •{" "}
                      {formatDate(booking.dateTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-100 disabled:opacity-50 order-2 sm:order-1 transition-colors"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2 transition-colors inline-flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Booking"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
