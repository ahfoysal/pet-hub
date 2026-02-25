"use client";

import { X, AlertTriangle, Play, Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useMarkInProgressMutation } from "@/redux/features/api/dashboard/sitter/bookings/sitterBookingApi";
import { BookingStatus } from "@/types/dashboard/sitter/sitterBookingTypes";

interface MarkInProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  currentStatus: BookingStatus | null;
}

export default function MarkInProgressModal({
  isOpen,
  onClose,
  bookingId,
  currentStatus,
}: MarkInProgressModalProps) {
  const { showToast } = useToast();
  const [markInProgress, { isLoading }] = useMarkInProgressMutation();

  const isLate = currentStatus === "LATE";

  const handleMarkInProgress = async () => {
    if (!bookingId) return;
    try {
      const result = await markInProgress(bookingId).unwrap();
      showToast(
        result.message || "Booking marked as in progress",
        "success"
      );
      onClose();
    } catch (err: any) {
      showToast(
        err?.data?.message || "Failed to mark booking as in progress",
        "error"
      );
    }
  };

  if (!isOpen || !bookingId) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Start Booking
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-6">
            {/* Late Warning */}
            {isLate && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Late Start Warning
                  </p>
                  <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                    The 15-minute window after confirmation has passed. Starting
                    now will mark this booking as a late start. This may affect
                    your sitter rating.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-12 h-12 ${
                  isLate ? "bg-amber-50" : "bg-indigo-50"
                } rounded-xl flex items-center justify-center`}
              >
                <Play
                  className={`w-6 h-6 ${
                    isLate ? "text-amber-500" : "text-indigo-500"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {isLate
                    ? "Start this booking anyway?"
                    : "Ready to start this booking?"}
                </h3>
                <p className="text-sm text-gray-500">
                  {isLate
                    ? "This booking will be marked as started with a late flag. Proceed only if you are ready to begin."
                    : "Once you mark this as in progress, the pet owner will be notified that the service has begun."}
                </p>
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
              Not Yet
            </button>
            <button
              type="button"
              onClick={handleMarkInProgress}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2 transition-colors inline-flex items-center justify-center gap-2 ${
                isLate
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : isLate ? (
                "Start Anyway"
              ) : (
                "Start Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
