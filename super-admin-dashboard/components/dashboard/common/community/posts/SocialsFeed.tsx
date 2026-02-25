"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { PostCard } from "./PostCard";
import { Post, User, FriendshipStatus } from "@/types/dashboard/community";
import { 
  useGetPostsQuery,
  useGetSavedPostsQuery,
} from "@/redux/features/api/dashboard/common/communityApi";
import { useSession } from "next-auth/react";

interface UserClickInfo {
  userId: string;
  fullName?: string;
  userName?: string;
  image?: string | null;
  friendshipStatus?: FriendshipStatus;
}

interface SocialsFeedProps {
  onUserClick?: (info: UserClickInfo) => void;
  onPostClick?: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  onPostUpdate?: () => void;
  initialLimit?: number;
  refreshTrigger?: number;
  currentUser?: User | null;
  feedType?: "all" | "saved";
}

export function SocialsFeed({
  onUserClick,
  onPostClick,
  onEditPost,
  onPostUpdate,
  initialLimit = 10,
  refreshTrigger,
  currentUser,
  feedType = "all",
}: SocialsFeedProps) {
  const { status } = useSession();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: allData, isLoading: allLoading, isFetching: allFetching, isError: allError, refetch: refetchAll } = useGetPostsQuery({
    limit: initialLimit,
    cursor,
  }, { skip: feedType !== "all" || status === "loading" });

  const {
    data: savedData,
    isLoading: savedLoading,
    isFetching: savedFetching,
    isError: savedError,
    refetch: refetchSaved,
  } = useGetSavedPostsQuery(
    {
      limit: initialLimit,
      cursor,
    },
    { skip: feedType !== "saved" || status === "loading" },
  );

  const data = feedType === "all" ? allData : savedData;
  const isLoading = feedType === "all" ? allLoading : savedLoading;
  const isFetching = feedType === "all" ? allFetching : savedFetching;
  const isError = feedType === "all" ? allError : savedError;
  const refetch = feedType === "all" ? refetchAll : refetchSaved;

  // Handle refresh
  useEffect(() => {
    if (refreshTrigger) {
      setCursor(undefined);
      // Don't clear posts here to avoid "No posts yet" flicker
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Update posts when data changes
  useEffect(() => {
    if (data?.data?.items) {
      let itemsToProcess: Post[] = [];
      
      if (feedType === "saved") {
        // savedData is ApiResponse<BookmarksResponse>, items are Bookmark[]
        // We need to extract the post object from each bookmark
        itemsToProcess = (data.data.items as any[])
          .map((item: any) => item.post)
          .filter(Boolean) as Post[];
      } else {
        // allData is ApiResponse<PostsResponse>, items are Post[]
        itemsToProcess = data.data.items as Post[];
      }

      if (cursor) {
        // Append new posts when loading more (pagination)
        setAllPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPosts = itemsToProcess.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
      } else {
        // On initial load or refetch (no cursor), replace with fresh data
        // This ensures deleted/changed posts are properly reflected
        setAllPosts(itemsToProcess);
      }
    }
  }, [data, cursor, feedType]);

  const nextCursor = data?.data?.nextCursor;
  const hasMore = !!nextCursor;

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setCursor(nextCursor!);
    }
  }, [hasMore, isFetching, nextCursor]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, isFetching]);

  // Error state
  if (isError) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <p className="text-gray-500 mb-4">Failed to load posts</p>
        <button
          onClick={() => {
            setCursor(undefined);
            refetch();
          }}
          className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ff5252] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Initial loading state
  if (isLoading && allPosts.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!isLoading && allPosts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">📸</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          No posts yet
        </h3>
        <p className="text-gray-500 text-sm">
          Be the first to share something with the community!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Posts List */}
      {allPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={currentUser}
          onUserClick={onUserClick}
          onClick={() => onPostClick?.(post.id)}
          onEdit={() => onEditPost?.(post)}
          onDelete={onPostUpdate}
          showComments={true}
        />
      ))}

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {isFetching && (
          <Loader2 className="w-6 h-6 text-[#FF6B6B] animate-spin" />
        )}
        {!hasMore && allPosts.length > 0 && (
          <p className="text-gray-400 text-sm">You&apos;ve reached the end</p>
        )}
      </div>

      {/* Manual Load More Button (fallback) */}
      {hasMore && !isFetching && (
        <button
          onClick={handleLoadMore}
          className="w-full py-3 text-[#FF6B6B] font-medium hover:bg-[#FF6B6B]/5 rounded-lg transition-colors"
        >
          Load More Posts
        </button>
      )}
    </div>
  );
}

// Loading skeleton for post cards
function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="w-24 h-4 bg-gray-200 rounded mb-1" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
          <div className="w-16 h-8 bg-gray-200 rounded-full" />
        </div>
      </div>
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex gap-4">
          <div className="w-12 h-5 bg-gray-200 rounded" />
          <div className="w-12 h-5 bg-gray-200 rounded" />
          <div className="w-12 h-5 bg-gray-200 rounded" />
        </div>
        <div className="w-3/4 h-4 bg-gray-200 rounded" />
        <div className="w-1/2 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default SocialsFeed;
