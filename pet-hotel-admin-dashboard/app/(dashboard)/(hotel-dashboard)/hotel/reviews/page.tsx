"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  Flag, 
  Star, 
  Search,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { 
  useGetReviewStatsQuery,
  useGetHotelReviewsQuery,
  useRespondToReviewMutation 
} from "@/redux/features/api/dashboard/hotel/review/hotelReviewApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

export default function CustomerReviewsPage() {
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const { data: statsData, isLoading: isStatsLoading } = useGetReviewStatsQuery();
  const { data: reviewsData, isLoading: isReviewsLoading, refetch } = useGetHotelReviewsQuery({ page: 1, limit: 50 });
  const [respondToReview, { isLoading: isResponding }] = useRespondToReviewMutation();

  const reviewStats = statsData?.data || {};
  const allReviews = reviewsData?.data?.data || [];

  const stats = [
    { label: "Total Reviews", value: reviewStats.totalReviews || 0, icon: MessageCircle, color: "text-[#101828]" },
    { label: "Pending", value: reviewStats.pendingReviews || 0, icon: Clock, color: "text-[#f54900]" },
    { label: "Replied", value: reviewStats.repliedReviews || 0, icon: CheckCircle2, color: "text-[#00a63e]" },
    { label: "Flagged", value: reviewStats.flaggedReviews || 0, icon: Flag, color: "text-[#e7000b]" },
    { label: "Avg Rating", value: reviewStats.avgRating || 0, icon: Star, color: "text-[#101828]", isRating: true },
  ];

  const TABS = ["All Reviews", "Pending", "Replied", "Flagged"];

  const filteredReviews = allReviews.filter((review: any) => {
    const matchesTab = 
      activeTab === "All Reviews" ||
      (activeTab === "Pending" && !review.reply && !review.isFlagged) ||
      (activeTab === "Replied" && !!review.reply) ||
      (activeTab === "Flagged" && review.isFlagged);
    
    const matchesSearch = 
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleSendReply = async (reviewId: string) => {
    const reply = replyText[reviewId];
    if (!reply?.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      await respondToReview({ id: reviewId, reply }).unwrap();
      toast.success("Reply sent successfully");
      setReplyText(prev => ({ ...prev, [reviewId]: "" }));
      refetch();
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  if (isStatsLoading || isReviewsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 pb-10 px-2 font-arimo bg-[#f2f4f8] min-h-screen">
      <div className="pt-6">
        <h1 className="text-[24px] font-bold text-[#101828] mb-1 font-inter">Customer Reviews</h1>
        <p className="text-[16px] text-[#4a5565] font-inter">Manage and respond to customer feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-[#dbdbdb] rounded-[14px] p-6 flex flex-col justify-between h-[106px]">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[14px] text-[#4a5565] font-inter">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-[24px] font-semibold font-inter ${stat.color}`}>{stat.value}</p>
                    {stat.isRating && <Star className="w-5 h-5 text-[#fdb022] fill-[#fdb022]" />}
                  </div>
                </div>
                {!stat.isRating && <Icon className="w-8 h-8 text-[#98a2b3]" strokeWidth={1.5} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls & Search */}
      <div className="bg-white border border-[#dbdbdb] rounded-[14px] p-4 flex items-center justify-between">
        <div className="relative w-[673px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by visitor name or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[42px] pl-11 pr-4 rounded-[10px] border border-[#d1d5dc] outline-none focus:border-[#ff7176] transition-colors text-[16px] font-inter"
          />
        </div>
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 h-[42px] rounded-[10px] text-[14px] font-medium transition-colors font-inter ${
                activeTab === tab 
                  ? "bg-[#ff7176] text-white" 
                  : "bg-[#f3f4f6] text-[#364153] hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review: any) => (
            <div key={review.id} className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                    {review.reviewer?.image ? (
                      <Image 
                        src={review.reviewer.image} 
                        alt={review.reviewer.fullName} 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[#101828] font-bold">{review.reviewer?.fullName?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[16px] font-inter">
                      <span className="font-semibold text-[#101828]">{review.reviewer?.fullName}</span>
                      <CheckCircle className="w-4 h-4 text-[#0BA5EC] fill-[#0BA5EC]/10" />
                      <span className="text-[#6a7282] text-[14px] font-normal">• @{review.reviewer?.userName}</span>
                    </div>
                    {/* Assuming room info might be added later, for now just show rating and date */}
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "text-[#fdb022] fill-[#fdb022]" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6a7282] text-[12px] font-inter">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(review.createdAt), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full ${review.reply ? "bg-[#dcfce7]" : "bg-[#ffedd4]"}`}>
                  <span className={`text-[12px] font-medium font-inter ${review.reply ? "text-[#008236]" : "text-[#ca3500]"}`}>
                    {review.reply ? "Replied" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="bg-[#f9fafb] p-4 rounded-[10px]">
                <p className="text-[16px] text-[#364153] leading-relaxed font-inter">
                  {review.comment}
                </p>
              </div>

              {review.reply ? (
                <div className="bg-[#faf5ff] border-l-4 border-[#ff7176] rounded-[10px] p-4 space-y-2">
                  <div className="flex gap-2 items-center">
                    <MessageSquare size={16} className="text-[#ff7176]" />
                    <span className="text-[14px] font-medium text-[#59168b] font-inter">Admin Response</span>
                    <span className="text-[12px] text-[#ff7176] font-inter ml-1">
                      {review.repliedAt ? format(new Date(review.repliedAt), "MMM dd, yyyy") : ""}
                    </span>
                  </div>
                  <p className="text-[16px] text-[#364153] leading-relaxed font-inter">
                    {review.reply}
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-[#f9fafb] p-4 rounded-[10px]">
                    <textarea 
                      placeholder="Type your reply here..."
                      value={replyText[review.id] || ""}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                      className="w-full bg-transparent outline-none resize-none text-[16px] font-inter text-[#364153] placeholder:text-[#7b7b7b]"
                      rows={2}
                    />
                  </div>

                  <div>
                    <button 
                      onClick={() => handleSendReply(review.id)}
                      disabled={isResponding}
                      className="flex items-center gap-2 px-4 py-2 bg-[#ff7176] hover:bg-[#ff7176]/90 transition-colors text-white rounded-[10px] font-inter text-[16px] disabled:opacity-50"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {isResponding ? "Sending..." : "Send"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#dbdbdb] rounded-[14px] p-10 text-center text-[#667085]">
            No reviews found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
