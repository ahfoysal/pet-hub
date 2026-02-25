"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Send,
  Pause,
  Play,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Users,
  Lock,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { UserAvatar } from "../common/UserAvatar";
import { TimeAgo } from "../common/TimeAgo";
import { Story, MyStory, User } from "@/types/dashboard/community";
import {
  useLikeStoryMutation,
  useViewStoryMutation,
  useReplyToStoryMutation,
  useToggleStoryPublishedMutation,
  useChangeStoryVisibilityMutation,
  useDeleteStoryMutation,
  useGetMyStoriesQuery,
  useDeleteCommentMutation,
} from "@/redux/features/api/dashboard/common/communityApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useToast } from "@/contexts/ToastContext";
import { useSession } from "next-auth/react";

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function StoryViewerModal({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
}: StoryViewerModalProps) {
  const { status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showRepliesList, setShowRepliesList] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [likeStory] = useLikeStoryMutation();
  const [viewStory] = useViewStoryMutation();
  const [replyToStory, { isLoading: isReplying }] = useReplyToStoryMutation();
  const [togglePublished] = useToggleStoryPublishedMutation();
  const [changeVisibility] = useChangeStoryVisibilityMutation();
  const [deleteStory] = useDeleteStoryMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const { showToast } = useToast();

  const currentUser = useSelector((state: RootState) => state.auth.user) as any;
  const currentStory = stories[currentIndex];

  const currentUserId = currentUser?.id || currentUser?._id;
  const storyUserId =
    currentStory?.user?.id ||
    currentStory?.userId ||
    (currentStory?.user as any)?._id;

  const isOwner =
    currentUserId &&
    storyUserId &&
    String(currentUserId) === String(storyUserId);

  // Fetch my stories to get replies if I am the owner
  const { data: myStoriesData } = useGetMyStoriesQuery(
    { limit: 20 },
    { skip: !isOwner || !isOpen || status === "loading" },
  );

  const myDetailedStory = isOwner
    ? myStoriesData?.data?.items?.find(
        (s: MyStory) => s.id === currentStory?.id,
      )
    : null;

  const storyReplies = myDetailedStory?.storyReplies || [];
  const storyDuration = 5000;

  useEffect(() => {
    if (isOpen && currentStory && !currentStory.isViewed) {
      viewStory(currentStory.id);
    }
  }, [isOpen, currentStory, viewStory]);

  useEffect(() => {
    if (!isOpen || isPaused || showRepliesList) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 100 / (storyDuration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [
    isOpen,
    isPaused,
    currentIndex,
    stories.length,
    onClose,
    showRepliesList,
  ]);

  useEffect(() => {
    setProgress(0);
    setShowRepliesList(false);
    setShowOptionsMenu(false);
  }, [currentIndex]);

  const goToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
    else onClose();
  };

  const handleLike = async () => {
    await likeStory(currentStory.id);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await replyToStory({ id: currentStory.id, comment: replyText.trim() });
    setReplyText("");
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteStory(currentStory.id).unwrap();
      showToast("Story deleted successfully", "success");
      if (stories.length <= 1) onClose();
      else goToNext();
    } catch (err) {
      console.error("Failed to delete story:", err);
      showToast("Failed to delete story", "error");
    }
    setConfirmDelete(false);
  };

  if (!isOpen || !currentStory) return null;

  const isVideo =
    currentStory.media.includes(".mp4") ||
    currentStory.media.includes(".webm") ||
    currentStory.media.includes(".mov");

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30"
      >
        <X size={24} />
      </button>

      <div className="relative w-full max-w-md h-full max-h-[90vh] mx-4">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width:
                    index < currentIndex
                      ? "100%"
                      : index === currentIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="absolute top-10 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar
              src={currentStory.user.image}
              alt={currentStory.user.fullName}
              size="md"
            />
            <div>
              <p className="text-white font-semibold text-sm">
                {currentStory.user.fullName}
              </p>
              <div className="flex items-center gap-2">
                <TimeAgo
                  date={currentStory.createdAt}
                  className="text-white/70 text-[10px]"
                />
                <span className="text-white/50 text-[10px] flex items-center gap-0.5">
                  •{" "}
                  {currentStory.visibility === "PUBLIC" ? (
                    <Globe size={10} />
                  ) : currentStory.visibility === "FRIENDS" ? (
                    <Users size={10} />
                  ) : (
                    <Lock size={10} />
                  )}
                  <span className="ml-0.5">
                    {currentStory.visibility === "PUBLIC"
                      ? "Public"
                      : currentStory.visibility === "FRIENDS"
                        ? "Friends"
                        : "Private"}
                  </span>
                </span>
                {currentStory.remainingHours !== undefined && (
                  <span className="text-[#FF6B6B] text-[10px] font-bold">
                    • {Math.floor(currentStory.remainingHours)}h left
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
                >
                  <MoreHorizontal size={18} />
                </button>

                {showOptionsMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden backdrop-blur-xl">
                    {/* Visibility Section */}
                    <div className="px-3 py-2 text-[10px] text-white/50 border-b border-white/5 uppercase tracking-wider font-bold">
                      Visibility
                    </div>
                    <button
                      onClick={() => {
                        if (currentStory.visibility !== "PUBLIC") {
                          changeVisibility({
                            id: currentStory.id,
                            visibility: "PUBLIC",
                          });
                        }
                        setShowOptionsMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                        currentStory.visibility === "PUBLIC"
                          ? "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <Globe size={16} />
                      <span>Public</span>
                      {currentStory.visibility === "PUBLIC" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (currentStory.visibility !== "FRIENDS") {
                          changeVisibility({
                            id: currentStory.id,
                            visibility: "FRIENDS",
                          });
                        }
                        setShowOptionsMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                        currentStory.visibility === "FRIENDS"
                          ? "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <Users size={16} />
                      <span>Friends Only</span>
                      {currentStory.visibility === "FRIENDS" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (currentStory.visibility !== "PRIVATE") {
                          changeVisibility({
                            id: currentStory.id,
                            visibility: "PRIVATE",
                          });
                        }
                        setShowOptionsMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                        currentStory.visibility === "PRIVATE"
                          ? "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      <Lock size={16} />
                      <span>Only Me</span>
                      {currentStory.visibility === "PRIVATE" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </button>

                    {/* Delete Section */}
                    <div className="border-t border-white/5">
                      <button
                        onClick={handleDelete}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left ${
                          confirmDelete
                            ? "bg-red-500/20 text-red-300"
                            : "text-red-400 hover:bg-red-400/10"
                        }`}
                      >
                        <Trash2 size={16} />
                        {confirmDelete
                          ? "Tap again to confirm"
                          : "Delete Story"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </div>

        {/* Media */}
        <div
          className="w-full h-full rounded-xl overflow-hidden bg-gray-900"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width / 3) goToPrevious();
            else if (x > (rect.width * 2) / 3) goToNext();
            else setIsPaused(!isPaused);
          }}
        >
          {isVideo ? (
            <video
              src={currentStory.media}
              className="w-full h-full object-contain"
              autoPlay
              muted={false}
              playsInline
            />
          ) : (
            <img
              src={currentStory.media}
              alt="Story"
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 ${currentStory.isLiked ? "text-red-500" : "text-white"}`}
            >
              <Heart
                size={20}
                fill={currentStory.isLiked ? "currentColor" : "none"}
              />
              <span className="text-sm">{currentStory.likeCount}</span>
            </button>
            <span className="text-white/70 text-sm">
              👁 {currentStory.viewCount} views
            </span>
          </div>

          {storyReplies.length > 0 && (
            <div className="mb-3">
              <button
                onClick={() => setShowRepliesList(!showRepliesList)}
                className="flex items-center gap-1.5 text-white/90 hover:text-white bg-black/40 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm border border-white/10"
              >
                <MessageCircle size={16} />
                {storyReplies.length}{" "}
                {storyReplies.length === 1 ? "Comment" : "Comments"}
              </button>
            </div>
          )}

          {showRepliesList && (
            <div className="absolute bottom-16 left-0 right-0 max-h-40 overflow-y-auto bg-black/60 backdrop-blur-md rounded-xl p-3 text-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold">Replies</h4>
                <button
                  onClick={() => setShowRepliesList(false)}
                  className="text-xs text-white/70 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2">
                {storyReplies.map((reply: any) => {
                  const replyUserId =
                    reply.user?.id || reply.userId || (reply.user as any)?._id;
                  const isReplyOwner =
                    currentUserId &&
                    replyUserId &&
                    String(currentUserId) === String(replyUserId);
                  const canDeleteReply = isOwner || isReplyOwner;

                  const handleDeleteReply = async () => {
                    if (window.confirm("Delete this reply?")) {
                      try {
                        await deleteComment({ commentId: reply.id }).unwrap();
                      } catch (err) {
                        console.error("Failed to delete story reply:", err);
                      }
                    }
                  };

                  return (
                    <div
                      key={reply.id}
                      className="flex gap-2 items-start text-xs group"
                    >
                      <UserAvatar
                        src={reply.user.image}
                        alt={reply.user.fullName}
                        size="xs"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold mr-1">
                          {reply.user.fullName}
                        </span>
                        <span className="text-white/80">{reply.comment}</span>
                      </div>
                      {canDeleteReply && (
                        <button
                          onClick={handleDeleteReply}
                          className="opacity-0 group-hover:opacity-100 p-1 text-white/50 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a comment..."
              onFocus={() => setIsPaused(true)}
              className="flex-1 bg-white/20 text-white placeholder-white/60 rounded-full px-4 py-2 text-sm outline-none focus:bg-white/30"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleReply();
              }}
            />
            <button
              onClick={handleReply}
              disabled={!replyText.trim() || isReplying}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${replyText.trim() ? "bg-[#FF6B6B] text-white" : "bg-white/20 text-white/50"}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryViewerModal;
