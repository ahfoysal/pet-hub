"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Flag, Edit2, CheckCircle2, Calendar, X, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReviewCardProps {
  id: string;
  user: {
    name: string;
    image: string;
    userName: string;
  };
  productName: string;
  rating: number;
  date: string;
  status: "pending" | "replied" | "flagged";
  content: string;
  adminResponse?: {
    text: string;
    date: string;
  };
  onReply?: (content: string) => void;
  onFlag?: () => void;
  onEditReply?: (content: string) => void;
}

export default function ReviewCard({
  user,
  productName,
  rating,
  date,
  status,
  content: reviewText,
  adminResponse,
  onReply,
  onFlag,
  onEditReply,
}: ReviewCardProps) {
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState(adminResponse?.text || "");
  const [showFlagDialog, setShowFlagDialog] = useState(false);

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const statusStyles = {
    pending: "bg-[#ffedd4] text-[#ca3500]",
    replied: "bg-[#dcfce7] text-[#008236]",
    flagged: "bg-red-100 text-red-600",
  };

  const handleReplySubmit = () => {
    if (status === "pending") {
      onReply?.(replyContent);
    } else {
      onEditReply?.(replyContent);
    }
    setIsReplying(false);
  };

  return (
    <div className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-[#ad46ff] to-[#2b7fff] shrink-0">
            {userInitials}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-bold text-[#101828] text-base font-inter">{user.name}</h3>
              <div className="flex items-center justify-center bg-blue-500 rounded-full p-0.5">
                <CheckCircle2 size={12} className="text-white fill-current" />
              </div>
            </div>
            <p className="text-[#4a5565] text-sm font-inter">{productName}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
              <div className="flex gap-0.5">{renderStars(rating)}</div>
              <div className="flex items-center gap-1.5 text-[#6a7282] text-xs font-inter">
                <Calendar size={14} className="text-gray-400" />
                <span>{date}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-inter ${statusStyles[status]}`}>
          {status}
        </div>
      </div>

      <div className="bg-[#f9fafb] p-4 rounded-[10px] border border-gray-50">
        <p className="text-[#364153] text-base leading-relaxed font-inter">{reviewText}</p>
      </div>

      {adminResponse && !isReplying && (
        <div className="border-l-4 border-[#ff7176] bg-[#faf5ff] p-5 rounded-[10px] space-y-3">
          <div className="flex items-center gap-2.5">
            <MessageSquare size={18} className="text-[#59168b]" />
            <span className="text-[#59168b] text-sm font-bold font-inter">Admin Response</span>
            <span className="text-[#ff7176] text-xs font-medium font-inter">{adminResponse.date}</span>
          </div>
          <p className="text-[#364153] text-sm leading-relaxed font-inter">{adminResponse.text}</p>
        </div>
      )}

      {isReplying && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-[10px] border border-gray-200">
          <label className="text-sm font-semibold text-gray-700 font-inter">Your Response</label>
          <textarea
            className="w-full p-3 text-sm border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-[#ff7176]/50 focus:outline-none min-h-[100px] font-inter"
            placeholder="Write your response here..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsReplying(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-[8px] transition-all font-inter"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              disabled={!replyContent.trim()}
              onClick={handleReplySubmit}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#ff7176] hover:bg-[#ff7176]/90 rounded-[8px] transition-all disabled:opacity-50 font-inter"
            >
              <Send size={16} />
              {status === "pending" ? "Submit Response" : "Update Response"}
            </button>
          </div>
        </div>
      )}

      {!isReplying && (
        <div className="flex flex-wrap gap-3 pt-2">
          {status === "pending" ? (
            <>
              <button
                onClick={() => setIsReplying(true)}
                className="flex items-center gap-2 bg-[#ff7176] text-white px-5 py-2 rounded-[10px] text-sm font-semibold hover:bg-[#ff7176]/90 transition-all shadow-sm active:scale-95 font-inter"
              >
                <MessageSquare size={18} />
                Reply
              </button>
              <button
                onClick={() => setShowFlagDialog(true)}
                className="bg-[#fef2f2] text-[#e7000b] px-5 py-2 rounded-[10px] text-sm font-semibold hover:bg-red-100 transition-all font-inter active:scale-95 border border-red-50"
              >
                Flag Review
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsReplying(true)}
              className="flex items-center gap-2 bg-[#ff7176] text-white px-5 py-2 rounded-[10px] text-sm font-semibold hover:bg-[#ff7176]/90 transition-all shadow-sm active:scale-95 font-inter"
            >
              <Edit2 size={18} />
              Edit Reply
            </button>
          )}
        </div>
      )}

      <AlertDialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <AlertDialogContent className="bg-white rounded-[14px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#101828] font-inter">Flag this review?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#4a5565] font-inter">
              Are you sure you want to flag this review? Our team will review it for inappropriate content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[10px] font-inter">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onFlag?.();
                setShowFlagDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-[10px] font-inter"
            >
              Flag Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
