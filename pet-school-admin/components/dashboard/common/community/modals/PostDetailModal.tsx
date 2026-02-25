"use client";

import React, { useState } from "react";
import { X, Heart, MessageCircle, Send, MoreHorizontal, Trash2, Edit, Bookmark } from "lucide-react";
import { UserAvatar } from "../common/UserAvatar";
import { TimeAgo } from "../common/TimeAgo";
import { PostHeader } from "../posts/PostHeader";
import { PostMedia } from "../posts/PostMedia";
import { PostComments } from "../posts/PostComments";
import { Post, Comment, User } from "@/types/dashboard/community";
import {
  useGetPostQuery,
  useGetCommentsQuery,
  useToggleLikePostMutation,
  useAddCommentMutation,
  useLikeCommentMutation,
  useDeletePostMutation,
  useToggleBookmarkPostMutation,
} from "@/redux/features/api/dashboard/common/communityApi";
import { EditPostModal } from "./EditPostModal";
import { useSession } from "next-auth/react";

interface PostDetailModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  onDelete?: () => void;
}

export function PostDetailModal({
  postId,
  isOpen,
  onClose,
  currentUser,
  onDelete,
}: PostDetailModalProps) {
  const { status } = useSession();
  const [commentText, setCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: postData, isLoading: isLoadingPost } = useGetPostQuery(postId, {
    skip: !isOpen,
  });
  const { data: commentsData } = useGetCommentsQuery(
    { postId, limit: 20 },
    { skip: !isOpen || status === "loading" },
  );

  const [toggleLike] = useToggleLikePostMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [toggleBookmark] = useToggleBookmarkPostMutation();

  const post = postData?.data;
  const comments = commentsData?.data?.comments || [];
  const isAuthor = currentUser?.id === post?.user?.id || currentUser?.id === post?.author?.id;

  const handleLike = async () => {
    await toggleLike(postId);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addComment({ postId, content: commentText.trim() });
    setCommentText("");
  };

  const handleDeletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      onDelete?.();
      onClose();
    }
  };

  const handleBookmark = async () => {
    await toggleBookmark(postId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
        >
          <X size={18} />
        </button>

        {isLoadingPost ? (
          <div className="w-full h-96 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#FF6B6B] border-t-transparent rounded-full" />
          </div>
        ) : post ? (
          <>
            {/* Media Section */}
            {post.media && post.media.length > 0 && (
              <div className="md:w-1/2 bg-black flex items-center justify-center">
                <PostMedia media={post.media} alt={post.caption || "Post"} />
              </div>
            )}

            {/* Content Section */}
            <div className="md:w-1/2 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <PostHeader
                  user={(post.user || post.author)!}
                  createdAt={post.createdAt}
                  visibility={post.visibility}
                />
                <div className="relative">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {showOptions && (
                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 min-w-[120px] z-20">
                      {isAuthor && (
                        <>
                          <button
                            onClick={() => {
                              setIsEditModalOpen(true);
                              setShowOptions(false);
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={handleDeletePost}
                            disabled={isDeleting}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          handleBookmark();
                          setShowOptions(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                          post.isSaved ? "text-yellow-600" : "text-gray-700"
                        }`}
                      >
                        <Bookmark 
                          size={16} 
                          fill={post.isSaved ? "currentColor" : "none"} 
                        />
                        {post.isSaved ? "Saved" : "Save Post"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption & Comments */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Caption */}
                {post.caption && (
                  <div className="flex gap-3">
                    <UserAvatar
                      src={post.user?.image || post.author?.image || null}
                      alt={post.user?.fullName || post.author?.fullName || "User"}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">
                          {post.user?.fullName || post.author?.fullName}
                        </span>{" "}
                        {post.caption}
                      </p>
                      <TimeAgo date={post.createdAt} className="text-xs" />
                    </div>
                  </div>
                )}

                {/* Comments */}
                <PostComments
                  postId={postId}
                  postAuthorId={post.user?.id || post.author?.id}
                  currentUser={currentUser}
                  showInput={false}
                  initialLimit={100}
                />
              </div>

              {/* Actions */}
              <div className="border-t p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 ${
                      post.isLiked ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    <Heart
                      size={24}
                      fill={post.isLiked ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="text-gray-600">
                    <MessageCircle size={24} />
                  </button>
                </div>
                <p className="font-semibold text-sm">
                  {post.likeCount || 0} likes
                </p>

                {/* Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FF6B6B]/30"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddComment();
                    }}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || isAddingComment}
                    className={`p-2 rounded-full ${
                      commentText.trim() && !isAddingComment
                        ? "bg-[#FF6B6B] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-96 flex items-center justify-center text-gray-500">
            Post not found
          </div>
        )}
      </div>

      {post && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          post={post as Post}
          onSuccess={() => {
            // refresh happens via tag invalidation in RTK Query
          }}
        />
      )}
    </div>
  );
}

export default PostDetailModal;
