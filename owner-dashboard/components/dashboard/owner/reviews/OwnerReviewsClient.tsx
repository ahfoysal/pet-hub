/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useGetSubmittedSitterReviewsQuery,
  useGetSubmittedPackageReviewsQuery,
  useDeleteSitterReviewMutation,
  useDeletePackageReviewMutation,
  useUpdateSitterReviewMutation,
  useUpdatePackageReviewMutation,
} from "@/redux/features/api/dashboard/owner/reviews/ownerSitterReviewApi";
import {
  Star,
  MessageSquare,
  Trash2,
  Pencil,
  Calendar,
  Loader2,
  Package,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/contexts/ToastContext";
import CreateReviewModal from "./CreateReviewModal";

type ReviewTab = "sitters" | "packages";

export default function OwnerReviewsClient() {
  const [activeTab, setActiveTab] = useState<ReviewTab>("sitters");
  const { showToast } = useToast();

  const { data: sitterReviews, isLoading: isSitterLoading } =
    useGetSubmittedSitterReviewsQuery({});
  const { data: packageReviews, isLoading: isPackageLoading } =
    useGetSubmittedPackageReviewsQuery({});

  const [deleteSitterReview] = useDeleteSitterReviewMutation();
  const [deletePackageReview] = useDeletePackageReviewMutation();
  const [updateSitterReview] = useUpdateSitterReviewMutation();
  const [updatePackageReview] = useUpdatePackageReviewMutation();

  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const handleDelete = async (id: string, type: ReviewTab) => {
    try {
      if (type === "sitters") {
        await deleteSitterReview(id).unwrap();
      } else {
        await deletePackageReview(id).unwrap();
      }
      showToast("Review deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete review", "error");
    }
  };

  const handleEditSubmit = async (rating: number, comment: string) => {
    if (!editingReview) return;
    setIsEditSubmitting(true);
    try {
      const data = { rating, comment };
      if (activeTab === "sitters") {
        await updateSitterReview({ reviewId: editingReview.id, data }).unwrap();
      } else {
        await updatePackageReview({
          reviewId: editingReview.id,
          data,
        }).unwrap();
      }
      showToast("Review updated successfully", "success");
      setEditingReview(null);
    } catch (error) {
      showToast("Failed to update review", "error");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const reviews =
    activeTab === "sitters" ? sitterReviews?.data : packageReviews?.data;
  const isLoading =
    activeTab === "sitters" ? isSitterLoading : isPackageLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-nunito">
            My Reviews
          </h1>
          <p className="text-sm text-gray-500 font-arimo mt-1">
            Manage and track all reviews you've submitted.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 bg-gray-100/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("sitters")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "sitters"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
          }`}
        >
          <User className="w-4 h-4" />
          Sitter Reviews
        </button>
        <button
          onClick={() => setActiveTab("packages")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "packages"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
          }`}
        >
          <Package className="w-4 h-4" />
          Package Reviews
        </button>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="font-arimo italic">Loading your reviews...</p>
          </div>
        ) : !reviews || reviews.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="font-arimo">No reviews found in this category.</p>
          </div>
        ) : (
          reviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                      <Image
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.petSitter?.fullName || review.package?.name || "Review"}`}
                        alt="Target"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 font-nunito line-clamp-1">
                        {review.petSitter?.fullName || review.package?.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingReview(review)}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id, activeTab)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 font-arimo leading-relaxed italic mb-4">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-arimo uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(review.createdAt), "MMM dd, yyyy")}
                </div>
                {review.isUpdated && (
                  <span className="text-primary font-bold">Updated</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CreateReviewModal
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        onSubmit={handleEditSubmit}
        targetName={
          editingReview?.petSitter?.fullName ||
          editingReview?.package?.name ||
          "Review"
        }
        isSubmitting={isEditSubmitting}
        initialRating={editingReview?.rating}
        initialComment={editingReview?.comment}
        isEditMode
      />
    </div>
  );
}
