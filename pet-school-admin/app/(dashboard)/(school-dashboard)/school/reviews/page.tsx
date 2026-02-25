"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { Search, Star, MessageSquare, Clock, CheckCircle2, AlertCircle, Reply, Flag, Edit3 } from "lucide-react";
import React, { useState } from "react";
import ReplyReviewModal from "@/components/dashboard/school/reviews/ReplyReviewModal";

const statsData = [
  { label: "Total Reviews", value: "8", icon: MessageSquare, color: "bg-blue-50", iconColor: "text-blue-500" },
  { label: "Pending", value: "3", icon: Clock, color: "bg-orange-50", iconColor: "text-orange-500" },
  { label: "Replied", value: "4", icon: CheckCircle2, color: "bg-green-50", iconColor: "text-green-500" },
  { label: "Flagged", value: "1", icon: AlertCircle, color: "bg-red-50", iconColor: "text-red-500" },
  { label: "Avg Rating", value: "4.1", icon: Star, color: "bg-yellow-50", iconColor: "text-yellow-500" },
];

const reviewsData = [
  {
    id: 1,
    user: "Sarah Johnson",
    initials: "SJ",
    verified: true,
    pet: "Max",
    course: "Basic Obedience Training",
    rating: 5,
    date: "Feb 20, 2026",
    status: "Pending",
    content: "Absolutely amazing course! Max has improved so much in just 8 weeks. The trainers are patient and professional. Highly recommend!",
  },
  {
    id: 2,
    user: "Michael Chen",
    initials: "MC",
    verified: true,
    pet: "Bella",
    course: "Toilet Training for Puppies",
    rating: 4,
    date: "Feb 18, 2026",
    status: "Replied",
    content: "Great results! Bella is now fully house-trained. The course was very comprehensive, though I wish there were more one-on-one sessions.",
    response: {
      date: "Feb 19, 2026",
      content: "Thank you for your feedback, Michael! We're so happy to hear about Bella's progress. We'll consider adding more one-on-one sessions in future batches based on your suggestion."
    }
  }
];

export default function CourseReviewsPage() {
  const [activeFilter, setActiveFilter] = useState("All Reviews");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const filters = ["All Reviews", "Pending", "Replied", "Flagged"];

  const handleReply = (review: any) => {
    setSelectedReview(review);
    setIsReplyModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeading 
        title="Course Reviews" 
        subtitle="Manage and respond to student feedback" 
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-[1092px]">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden h-[120px]">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] text-gray-500 font-['Arial:Regular']">{stat.label}</span>
              <span className="text-[24px] font-bold text-[#101828] font-['Arial:Bold']">{stat.value}</span>
            </div>
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            {stat.label === "Avg Rating" && <Star className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-500 fill-current" style={{ opacity: 0 }} />}
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] shadow-sm w-full max-w-[1092px] p-6 flex flex-wrap gap-4 items-center">
        <div className="flex-grow relative h-[42px] bg-white border border-[#d1d5dc] rounded-[8px] flex items-center px-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by student, course, or pet name..."
            className="w-full bg-transparent outline-none ml-2 text-[14px] text-black placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex bg-gray-50 p-1 rounded-[8px] border border-gray-100">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-[6px] text-[14px] transition-all ${
                activeFilter === filter 
                ? "bg-[#ff7176] text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-6 w-full max-w-[1092px]">
        {reviewsData.map((review) => (
          <div key={review.id} className="bg-white border border-[#e5e7eb] rounded-[14px] p-6 shadow-sm flex flex-col gap-6 relative">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-[52px] h-[52px] rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-[18px]">
                  {review.initials}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-bold text-[#101828] font-['Arial:Bold']">{review.user}</h3>
                    {review.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" fill="currentColor" style={{ color: 'white', fill: '#3b82f6' }} />}
                    <span className="text-[14px] text-gray-400 font-['Arial:Regular']">• Pet: {review.pet}</span>
                  </div>
                  <span className="text-[14px] text-[#4a5565] font-['Arial:Regular']">{review.course}</span>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <span className="text-[12px] text-gray-400 font-['Arial:Regular'] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-[6px] text-[12px] font-medium ${
                review.status === "Pending" ? "bg-[#fff7ed] text-[#9a3412]" : "bg-[#f0fdf4] text-[#166534]"
              }`}>
                {review.status}
              </span>
            </div>

            {/* Review Content */}
            <div className="bg-[#f9fafb] rounded-[10px] p-4">
              <p className="text-[14px] text-[#4a5565] font-['Arial:Regular'] leading-[24px]">
                {review.content}
              </p>
            </div>

            {/* Admin Response */}
            {review.response && (
              <div className="flex flex-col gap-3 p-4 bg-purple-50 bg-opacity-30 border-l-[3px] border-[#ff7176] rounded-r-[10px]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <Edit3 className="w-3 h-3 text-[#ff7176]" />
                    </div>
                    <span className="text-[12px] font-bold text-[#ff7176] font-['Arial:Bold']">Admin Response</span>
                    <span className="text-[10px] text-gray-400">{review.response.date}</span>
                  </div>
                </div>
                <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">
                  {review.response.content}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              {review.status === "Pending" ? (
                <button 
                  onClick={() => handleReply(review)}
                  className="bg-[#ff7176] text-white px-6 h-[40px] rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#ff5c62] transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span className="text-[14px] font-['Arial:Regular']">Reply</span>
                </button>
              ) : (
                <button 
                   onClick={() => handleReply(review)}
                   className="bg-[#ff7176] text-white px-6 h-[40px] rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#ff5c62] transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-[14px] font-['Arial:Regular']">Edit Reply</span>
                </button>
              )}
              <button className="bg-[#fdf2f2] text-[#ff7176] px-6 h-[40px] rounded-[10px] flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-50">
                <Flag className="w-4 h-4" />
                <span className="text-[14px] font-['Arial:Regular']">Flag Review</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ReplyReviewModal 
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        review={selectedReview}
      />
    </div>
  );
}
