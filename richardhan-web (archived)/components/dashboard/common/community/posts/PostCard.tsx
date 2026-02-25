"use client";

import React, { useState } from "react";
import { MoreHorizontal, Trash2, Edit2, Bookmark } from "lucide-react";
import { PostHeader } from "./PostHeader";
import { PostMedia } from "./PostMedia";
import { PostActions } from "./PostActions";
import { PostComments } from "./PostComments";
import { Post, User, FriendshipStatus } from "@/types/dashboard/community";
import { 
  useToggleLikePostMutation, 
  useDeletePostMutation, 
  useToggleBookmarkPostMutation,
  useToggleHideContentMutation,
  useGetPostQuery
} from "@/redux/features/api/dashboard/common/communityApi";
import { EyeOff } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useSession } from "next-auth/react";

interface UserClickInfo {
  userId: string;
  fullName?: string;
  userName?: string;
  image?: string | null;
  friendshipStatus?: FriendshipStatus;
}

interface PostCardProps {
  post: Post;
  currentUser?: User | null;
  onUserClick?: (info: UserClickInfo) => void;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showComments?: boolean;
}

export function PostCard({
  post,
  currentUser,
  onUserClick,
  onClick,
  onEdit,
  onDelete,
  showComments = true,
}: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toggleLike, { isLoading: isLiking }] = useToggleLikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [toggleBookmark] = useToggleBookmarkPostMutation();
  const [toggleHide] = useToggleHideContentMutation();
  const { showToast } = useToast();
  const { status: sessionStatus } = useSession();
  
  // Always fetch the full post data to get visibility and isCommentAllowed
  // since the feed API (/community/all) doesn't return these fields
  const { data: fullPostData, isError: postError, isLoading: isPostLoading } = useGetPostQuery(post.id, { skip: sessionStatus === "loading" });

  const enrichedPost = fullPostData?.data || post;
  
  // Robust ID comparison for ownership
  const currentUserId = (currentUser as any)?.id || (currentUser as any)?._id;
  
  // Use user or author (API returns either depending on endpoint)
  const author = enrichedPost.user || enrichedPost.author;
  const authorId = (author as any)?.id || (author as any)?._id;

  const isAuthor = currentUserId && authorId && String(currentUserId) === String(authorId);

  // Log only if it's the owner's post to reduce noise, or if there's a visibility issue
  if (isAuthor || enrichedPost.visibility !== "PUBLIC") {
    console.log(`[PostCard ${post.id}] Visibility:`, enrichedPost.visibility, "| isAuthor:", isAuthor);
  }

  const handleLike = async () => {
    await toggleLike(post.id);
  };

  const handleBookmark = async () => {
    try {
      await toggleBookmark(enrichedPost.id).unwrap();
    } catch (error) {
      console.error("Failed to bookmark post:", error);
    }
  };

  const handleHide = async () => {
    try {
      await toggleHide({ id: enrichedPost.id, contentType: "POST" }).unwrap();
      setIsMenuOpen(false);
      onDelete?.(); // Use onDelete to remove from local feed view
    } catch (error) {
      console.error("Failed to hide post:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deletePost(enrichedPost.id).unwrap();
      showToast("Post deleted successfully", "success");
      setIsMenuOpen(false);
      onDelete?.();
    } catch (error) {
      console.error("Failed to delete post:", error);
      showToast("Failed to delete post", "error");
    }
    setConfirmDelete(false);
  };

  const handleShare = () => {
    // Share functionality - could open a share modal or use Web Share API
    if (navigator.share) {
      navigator.share({
        title: post.caption || "Check out this post",
        url: window.location.href,
      });
    }
  };

  // Truncate caption if too long
  const maxCaptionLength = 150;
  const shouldTruncate =
    post.caption && post.caption.length > maxCaptionLength;
  const displayCaption =
    shouldTruncate && !isExpanded
      ? post.caption?.slice(0, maxCaptionLength) + "..."
      : post.caption;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <PostHeader
            user={author!}
            createdAt={enrichedPost.createdAt}
            visibility={enrichedPost.visibility}
            onUserClick={() => onUserClick?.({
              userId: author!.id,
              fullName: author!.fullName,
              userName: author!.userName,
              image: author!.image,
              friendshipStatus: post.friendShipStatus,
            })}
          />
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 overflow-hidden">
                    <button
                      onClick={handleHide}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                    >
                      <EyeOff size={16} />
                      Hide Post
                    </button>
                    {isAuthor && (
                  <>
                    <button
                      onClick={() => {
                        onEdit?.();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Edit2 size={16} />
                      Edit Post
                    </button>
                    <button
                      onClick={handleDelete}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left ${
                        confirmDelete ? "bg-red-100 text-red-700" : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 size={16} />
                      {confirmDelete ? "Tap again to confirm" : "Delete Post"}
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                  </>
                )}
                <button
                  onClick={() => {
                    handleBookmark();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <Bookmark size={16} fill={post.isSaved ? "currentColor" : "none"} />
                  {post.isSaved ? "Saved" : "Save Post"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <PostMedia media={post.media} alt={post.caption || "Post"} />
      )}

      {/* Content Section */}
      <div className="p-4 pt-3 space-y-3">
        {/* Actions */}
        <PostActions
          likeCount={enrichedPost.likeCount}
          commentCount={enrichedPost.commentCount}
          isLiked={enrichedPost.isLiked}
          isSaved={enrichedPost.isSaved}
          onLike={handleLike}
          onComment={enrichedPost.isCommentAllowed !== false ? () => setShowAllComments(!showAllComments) : undefined}
          onSave={handleBookmark}
          isLiking={isLiking}
        />

        {/* Caption */}
        {post.caption && (
          <div className="text-sm text-gray-800">
            <span className="font-semibold mr-1">{author?.fullName}</span>
            {displayCaption}
            {shouldTruncate && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-gray-500 ml-1 hover:text-gray-700"
              >
                more
              </button>
            )}
          </div>
        )}

        {/* Location */}
        {post.location && (
          <p className="text-xs text-gray-500">📍 {post.location}</p>
        )}

        {/* Comments Section */}
        {showComments && enrichedPost.isCommentAllowed !== false && (
          <PostComments
            postId={enrichedPost.id}
            postAuthorId={(author as any)?.id || (author as any)?._id}
            currentUser={currentUser}
            commentCount={enrichedPost.commentCount}
            showInput={showAllComments}
            initialLimit={showAllComments ? 10 : 2}
          />
        )}
        
        {enrichedPost.isCommentAllowed === false && (
          <p className="text-[10px] text-gray-400 italic">Comments are disabled for this post</p>
        )}
      </div>
    </div>
  );
}

export default PostCard;
