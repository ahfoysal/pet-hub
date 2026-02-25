"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { StoryAvatar } from "./StoryAvatar";
import { UserAvatar } from "../common/UserAvatar";
import { useGetStoriesQuery } from "@/redux/features/api/dashboard/common/communityApi";
import { Story, User } from "@/types/dashboard/community";
import { useSession } from "next-auth/react";

interface StoriesCarouselProps {
  onStoryClick?: (story: Story) => void;
  onAddStory?: () => void;
  showAddButton?: boolean;
  currentUser?: User | null;
}

export function StoriesCarousel({
  onStoryClick,
  onAddStory,
  showAddButton = true,
  currentUser,
}: StoriesCarouselProps) {
  const { status } = useSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const { data, isLoading, error, refetch } = useGetStoriesQuery(
    { limit: 50 }, 
    { refetchOnMountOrArgChange: true , skip: status === "loading" }
  );
  const rawStories = data?.data?.items || [];
  const now = Date.now();

  const stories = rawStories.filter((story: any) => {
    if (!story.expiresAt) return true;
    return new Date(story.expiresAt).getTime() > now;
  });

  // Unique key for the scrollable container to force refresh
  const scrollKey = `scroll-${stories.length}-${stories[0]?.id || 'empty'}`;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl p-4 text-center text-gray-500">
        Failed to load stories
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">
          Stories & Moments
        </h3>
        <span className="text-[10px] text-gray-400 font-medium">Last 24 hours</span>
      </div>

      {/* Stories Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all -ml-2"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
        )}

        {/* Scrollable Stories */}
        <div
          key={scrollKey}
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-0.5 py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Add Story Button */}
          {showAddButton && (
            <button
              onClick={onAddStory}
              className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0"
            >
              <div className="relative p-[3px] rounded-full border-2 border-dashed border-gray-200 group-hover:border-[#FF6B6B] transition-colors">
                <UserAvatar
                  src={currentUser?.image || null}
                  alt="Your story"
                  size="lg"
                  className="opacity-80"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#FF6B6B] rounded-full flex items-center justify-center border-2 border-white">
                  <Plus size={12} className="text-white" />
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-semibold">Your Story</p>
            </button>
          )}

          {/* Loading State */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-gray-50" />
                <div className="w-10 h-2.5 bg-gray-100 rounded" />
              </div>
            ))}

          {/* Stories */}
          {!isLoading &&
            stories.map((story) => (
              <div key={story.id} className="flex-shrink-0">
                <StoryAvatar
                  user={story.user}
                  isViewed={story.isViewed}
                  location={story.location}
                  remainingHours={story.remainingHours}
                  onClick={() => onStoryClick?.(story)}
                />
              </div>
            ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && stories.length > 4 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all -mr-2"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}

export default StoriesCarousel;
