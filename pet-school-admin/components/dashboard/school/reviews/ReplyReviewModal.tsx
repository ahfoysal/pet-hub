"use client";

import React, { useEffect, useState } from "react";
import { X, Send } from "lucide-react";

interface ReplyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: any;
}

export default function ReplyReviewModal({
  isOpen,
  onClose,
  review,
}: ReplyReviewModalProps) {
  const [replyText, setReplyText] = useState("");

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#c4c4c4] bg-opacity-80 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border border-[#f3f4f6] rounded-[14px] shadow-xl w-full max-w-[600px] flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-[18px] font-bold text-[#101828] font-['Arial:Bold']">
            Reply to Review
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Review Being Replied To (Context) */}
        <div className="p-6 bg-gray-50 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#101828] text-[14px]">{review.user}</span>
            <span className="text-[12px] text-gray-400">• {review.course}</span>
          </div>
          <p className="text-[14px] text-[#4a5565] italic line-clamp-2">
            "{review.content}"
          </p>
        </div>

        {/* Reply Input */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] text-[#364153] font-medium">Your Response</label>
            <textarea 
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Descriptions........."
              className="w-full h-[120px] p-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] resize-none focus:border-[#ff7176] transition-colors"
              style={{ lineHeight: "24px" }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 h-[42px] bg-gray-100 text-[#364153] text-[14px] font-medium rounded-[10px] hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              className="bg-[#ff7176] text-white px-8 h-[42px] rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#ff5c62] transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="text-[14px] font-bold">Send Response</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
