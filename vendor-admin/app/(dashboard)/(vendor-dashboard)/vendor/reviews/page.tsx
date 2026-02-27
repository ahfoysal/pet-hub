"use client";

import React, { useState, useMemo } from "react";
import ReviewStats from "./components/ReviewStats";
import ReviewFilters from "./components/ReviewFilters";
import ReviewCard from "./components/ReviewCard";
import { 
  useGetVendorReviewsQuery, 
  useGetVendorReviewStatsQuery,
  useReplyToReviewMutation,
  useFlagReviewMutation 
} from "@/redux/features/api/dashboard/vendor/reviews/vendorReviewApi";
import { toast } from "sonner";

export default function VendorReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Reviews");

  const { data: reviewsData, isLoading: isReviewsLoading } = useGetVendorReviewsQuery();
  const { data: statsData, isLoading: isStatsLoading } = useGetVendorReviewStatsQuery();
  
  const [replyToReview] = useReplyToReviewMutation();
  const [flagReview] = useFlagReviewMutation();

  const statsResponse = statsData?.data || {
    totalReviews: 0,
    pendingReviews: 0,
    repliedReviews: 0,
    flaggedReviews: 0,
    avgRating: "0.0",
  };

  const reviews = reviewsData?.data || [];

  const handleReply = async (reviewId: string, reply: string) => {
    try {
      await replyToReview({ reviewId, reply }).unwrap();
      toast.success("Reply submitted successfully");
    } catch (error) {
      toast.error("Failed to submit reply");
    }
  };

  const handleFlag = async (reviewId: string, reason: string) => {
    try {
      await flagReview({ reviewId, reason }).unwrap();
      toast.success("Review flagged successfully");
    } catch (error) {
      toast.error("Failed to flag review");
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((review: any) => {
      const matchesSearch =
        review.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.review.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "All Reviews" ||
        (activeFilter === "Pending" && !review.reply && !review.isFlagged) ||
        (activeFilter === "Replied" && !!review.reply) ||
        (activeFilter === "Flagged" && review.isFlagged);

      return matchesSearch && matchesFilter;
    });
  }, [reviews, searchQuery, activeFilter]);

  if (isReviewsLoading || isStatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#101828] font-inter">Customer Reviews</h1>
        <p className="text-sm text-[#4a5565] font-inter">Manage and respond to your product reviews.</p>
      </div>

      <ReviewStats
        total={statsResponse.totalReviews}
        pending={statsResponse.pendingReviews}
        replied={statsResponse.repliedReviews}
        flagged={statsResponse.flaggedReviews}
        avgRating={statsResponse.avgRating}
      />

      <ReviewFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearchQuery}
      />

      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review: any) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              user={{
                name: review.user.fullName,
                image: review.user.image || "/assets/images/placeholder-user.png",
                userName: review.user.userName,
              }}
              productName={review.product.name}
              rating={review.rating}
              date={new Date(review.createdAt).toLocaleDateString()}
              content={review.review}
              status={review.isFlagged ? "flagged" : review.reply ? "replied" : "pending"}
              adminResponse={review.reply ? { text: review.reply, date: new Date(review.repliedAt!).toLocaleDateString() } : undefined}
              onReply={(reply) => handleReply(review.id, reply)}
              onFlag={() => handleFlag(review.id, "Flagged by vendor")}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-[14px] border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-inter">No reviews found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
