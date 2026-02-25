/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetOwnerBookingHistoryQuery,
  useGetOwnerBookingSummaryQuery,
} from "@/redux/features/api/dashboard/owner/summary/ownerSummaryApi";
import { useSubmitSitterReviewMutation } from "@/redux/features/api/dashboard/owner/reviews/ownerSitterReviewApi";
import {
  Search,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import OwnerBookingDetailsModal from "./OwnerBookingDetailsModal";
import OwnerLiveFeedModal from "./OwnerLiveFeedModal";
import CreateReviewModal from "../reviews/CreateReviewModal";
import { toast } from "sonner";

export default function OwnerBookingsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedLiveFeedBooking, setSelectedLiveFeedBooking] = useState<
    any | null
  >(null);
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const { data: bookingData, isLoading: isBookingsLoading } =
    useGetOwnerBookingHistoryQuery({ limit: 50 });
  const { data: summaryData, refetch } = useGetOwnerBookingSummaryQuery();
  const [submitSitterReview] = useSubmitSitterReviewMutation();

  const handleSaveReview = async (rating: number, comment: string) => {
    if (!reviewBooking) return;
    setIsReviewSubmitting(true);
    try {
      await submitSitterReview({
        petSitterId: reviewBooking.petSitterId,
        data: { rating, comment, isPublished: true },
      }).unwrap();
      toast.success("Review submitted successfully!");
      setReviewBooking(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const bookings = bookingData?.data?.items || [];
  const summary = summaryData?.data || {
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
  };

  const filteredBookings = bookings.filter(
    (booking: any) =>
      booking.petSitter?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
            My Bookings
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Manage your pet care reservations and check service status.
          </p>
        </div>

        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by ID or sitter name..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-arimo text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-arimo">
            Total Bookings
          </p>
          <p className="text-2xl font-black text-gray-900 font-nunito mt-1">
            {summary.totalBookings}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest font-arimo">
            Pending
          </p>
          <p className="text-2xl font-black text-gray-900 font-nunito mt-1">
            {summary.pendingBookings}
          </p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest font-arimo">
            Completed
          </p>
          <p className="text-2xl font-black text-gray-900 font-nunito mt-1">
            {summary.completedBookings}
          </p>
        </div>
        <div className="bg-primary p-5 rounded-3xl shadow-lg shadow-primary/10">
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest font-arimo">
            Active sessions
          </p>
          <p className="text-2xl font-black text-white font-nunito mt-1">2</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {isBookingsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-gray-400 font-arimo italic">
              Gearing up your pet's schedule...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-nunito font-bold text-lg">
              No bookings found
            </p>
            <p className="text-gray-400 font-arimo text-sm">
              You haven't made any reservations yet.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking: any) => (
            <div
              key={booking.id}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-primary/20 transition-all"
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 shrink-0 overflow-hidden relative">
                {booking.petSitter?.user?.image ? (
                  <img
                    src={booking.petSitter.user.image}
                    alt={booking.petSitter.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Calendar className="w-8 h-8 opacity-20" />
                )}
                <div
                  className={`absolute bottom-0 right-0 w-6 h-6 rounded-tl-xl border-2 border-white flex items-center justify-center text-white ${
                    booking.status === "COMPLETED"
                      ? "bg-green-500"
                      : booking.status === "PENDING"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                >
                  {booking.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h3 className="text-xl font-black text-gray-900 font-nunito">
                    {booking.petSitter?.fullName || "Pet Sitter"}
                  </h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    #{booking.id.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 text-xs font-arimo">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    10:00 AM - 02:00 PM
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {booking.petSitter?.user?.address || "At Sitter's Place"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="text-right hidden sm:block px-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-arimo">
                    Total Amount
                  </p>
                  <p className="text-xl font-black text-gray-900 font-nunito">
                    ${booking.totalPrice || "45.00"}
                  </p>
                </div>
                <div className="flex-1 md:flex-none flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex-1 md:w-32 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setSelectedLiveFeedBooking(booking)}
                    className="flex-1 md:w-32 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Live Feed
                  </button>
                  {booking.status === "COMPLETED" && (
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="flex-1 md:w-full py-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-100 transition-all active:scale-95 mt-2 md:mt-0"
                    >
                      Leave Review
                    </button>
                  )}
                </div>
                <button className="p-2 text-gray-300 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <OwnerBookingDetailsModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />

      <OwnerLiveFeedModal
        isOpen={!!selectedLiveFeedBooking}
        onClose={() => setSelectedLiveFeedBooking(null)}
        booking={selectedLiveFeedBooking}
      />

      <CreateReviewModal
        isOpen={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        onSubmit={handleSaveReview}
        targetName={reviewBooking?.petSitter?.fullName || "the sitter"}
        isSubmitting={isReviewSubmitting}
      />
    </div>
  );
}
