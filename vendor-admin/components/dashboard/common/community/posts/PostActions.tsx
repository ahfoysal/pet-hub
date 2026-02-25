"use client";

import React from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

interface PostActionsProps {
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  isLiking?: boolean;
}

export function PostActions({
  likeCount = 0,
  commentCount = 0,
  shareCount,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onShare,
  onSave,
  isLiking = false,
}: PostActionsProps) {
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="flex items-center justify-between py-2">
      {/* Left Actions */}
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <button
          onClick={onLike}
          disabled={isLiking}
          className={`flex items-center gap-1.5 transition-colors ${
            isLiked
              ? "text-red-500"
              : "text-gray-600 hover:text-red-500"
          } ${isLiking ? "opacity-50" : ""}`}
        >
          <Heart
            size={20}
            fill={isLiked ? "currentColor" : "none"}
            className={`transition-transform ${isLiked ? "scale-110" : ""}`}
          />
          <span className="text-sm font-medium">{formatCount(likeCount)}</span>
        </button>

        {/* Comment Button */}
        {onComment && (
          <button
            onClick={onComment}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{formatCount(commentCount)}</span>
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center">
        {/* Save/Bookmark Button */}
        <button
          onClick={onSave}
          className={`transition-colors ${
            isSaved
              ? "text-yellow-500"
              : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <Bookmark
            size={20}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>
    </div>
  );
}

export default PostActions;
