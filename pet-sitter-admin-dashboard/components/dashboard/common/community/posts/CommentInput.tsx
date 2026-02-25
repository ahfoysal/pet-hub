"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => void | Promise<void>;
  placeholder?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export function CommentInput({
  onSubmit,
  placeholder = "Add a comment...",
  isLoading = false,
  autoFocus = false,
}: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    await onSubmit(content.trim());
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={isLoading}
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:bg-white transition-all placeholder:text-gray-400"
      />
      <button
        type="submit"
        disabled={!content.trim() || isLoading}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          content.trim() && !isLoading
            ? "bg-[#FF6B6B] text-white hover:bg-[#ff5252]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <Send size={16} className="ml-0.5" />
        )}
      </button>
    </form>
  );
}

export default CommentInput;
