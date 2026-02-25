"use client";

import React, { useState } from "react";
import { Heart, ChevronDown, ChevronUp, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { UserAvatar } from "../common/UserAvatar";
import { TimeAgo } from "../common/TimeAgo";
import { CommentInput } from "./CommentInput";
import { Comment, User } from "@/types/dashboard/community";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useLikeCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "@/redux/features/api/dashboard/common/communityApi";
import { useToast } from "@/contexts/ToastContext";

interface PostCommentsProps {
  postId: string;
  postAuthorId?: string;
  currentUser?: User | null;
  commentCount?: number;
  showInput?: boolean;
  initialLimit?: number;
}

export function PostComments({
  postId,
  postAuthorId,
  currentUser,
  commentCount = 0,
  showInput = true,
  initialLimit = 3,
}: PostCommentsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data, isLoading, isFetching } = useGetCommentsQuery({
    postId,
    limit: isExpanded ? 20 : initialLimit,
    cursor,
  });

  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  const comments = data?.data?.comments || [];
  const nextCursor = data?.data?.nextCursor;

  const handleAddComment = async (content: string) => {
    await addComment({ postId, content });
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      setCursor(nextCursor);
    }
  };

  return (
    <div className="space-y-3">
      {/* Comment Count & Toggle */}
      {commentCount > initialLimit && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ChevronDown size={16} />
          View all {commentCount} comments
        </button>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-2 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="w-24 h-3 bg-gray-200 rounded mb-1" />
                <div className="w-3/4 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments List */}
      {!isLoading && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment: Comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              postId={postId}
              postAuthorId={postAuthorId}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {isExpanded && nextCursor && (
        <button
          onClick={handleLoadMore}
          disabled={isFetching}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {isFetching ? "Loading..." : "Load more comments"}
        </button>
      )}

      {/* Collapse Button */}
      {isExpanded && comments.length > initialLimit && (
        <button
          onClick={() => setIsExpanded(false)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <ChevronUp size={16} />
          Show less
        </button>
      )}

      {/* Comment Input */}
      {showInput && (
        <CommentInput
          onSubmit={handleAddComment}
          isLoading={isAddingComment}
          placeholder="Add a comment..."
        />
      )}
    </div>
  );
}

// Individual Comment Component
interface CommentItemProps {
  comment: Comment;
  currentUser?: User | null;
  postId: string;
  postAuthorId?: string;
  isReply?: boolean;
}

function CommentItem({ comment, currentUser, postId, postAuthorId, isReply = false }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { showToast } = useToast();

  const [editComment] = useEditCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [likeComment] = useLikeCommentMutation();

  const currentUserId = currentUser?.id || (currentUser as any)?._id;
  const commentAuthorId = comment.author?.id || (comment.author as any)?._id;
  
  const isCommentOwner = currentUserId && commentAuthorId && String(currentUserId) === String(commentAuthorId);
  const isPostOwner = currentUserId && postAuthorId && String(currentUserId) === String(postAuthorId);
  const canDelete = isCommentOwner || isPostOwner;
  const canEdit = isCommentOwner;

  const handleLike = async () => {
    try {
      await likeComment({ commentId: comment.id, postId }).unwrap();
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleEdit = async () => {
    if (!editValue.trim()) return;
    try {
      await editComment({ commentId: comment.id, content: editValue, postId }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteComment({ commentId: comment.id, postId }).unwrap();
      showToast("Comment deleted", "success");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      showToast("Failed to delete comment", "error");
    }
    setConfirmDelete(false);
    setIsMenuOpen(false);
  };

  return (
    <div className={`flex gap-2 ${isReply ? "ml-10" : ""}`}>
      <UserAvatar
        src={comment.author.image}
        alt={comment.author.fullName}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 bg-gray-50 rounded-2xl p-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-gray-900 text-sm">
                {comment.author.fullName}
              </span>
              <TimeAgo date={comment.createdAt} className="text-[10px] text-gray-400" />
            </div>
            
            {isEditing ? (
              <div className="mt-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full text-sm p-2 border border-blue-200 rounded-lg outline-none focus:border-blue-400 bg-white"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setIsEditing(false)} className="text-xs text-gray-500 font-medium px-2 py-1 rounded hover:bg-gray-100">Cancel</button>
                  <button onClick={handleEdit} className="text-xs text-blue-500 font-medium px-2 py-1 rounded bg-blue-50 hover:bg-blue-100">Save</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
            )}
          </div>

          {!isEditing && (
            <div className="flex flex-col items-center gap-1">
              {canDelete && (
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                      {canEdit && (
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 text-left"
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={handleDelete}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left ${
                          confirmDelete ? "bg-red-100 text-red-700" : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 size={12} />
                        {confirmDelete ? "Confirm delete" : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={handleLike}
                className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                  comment.isLiked ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart size={14} fill={comment.isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          )}
        </div>

        {/* Action bar below common bubble */}
        <div className="flex items-center gap-4 mt-1 ml-1 text-[10px] text-gray-500 font-medium">
          <button
            onClick={handleLike}
            className={`hover:text-gray-900 transition-colors ${comment.isLiked ? "text-red-500" : ""}`}
          >
            {comment.likeCount > 0 && <span className="mr-1">{comment.likeCount}</span>}
            {comment.isLiked ? "Liked" : "Like"}
          </button>
          
          {comment.replyCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="hover:text-gray-900 transition-colors"
            >
              {showReplies ? "Hide" : "View"} {comment.replyCount}{" "}
              {comment.replyCount === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {/* Replies */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-3">
            {comment.replies.map((reply: Comment) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                postId={postId}
                postAuthorId={postAuthorId}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostComments;
