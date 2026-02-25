"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MessageCircle,
  UserPlus,
  UserCheck,
  Clock,
  UserMinus,
  Ban,
  VolumeX,
  Loader2,
} from "lucide-react";
import {
  useGetFriendProfileQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useUnfriendMutation,
} from "@/redux/features/api/dashboard/common/friendshipApi";
import {
  useBlockUserMutation,
  useMuteUserMutation,
} from "@/redux/features/api/dashboard/common/userBlockMuteApi";
import { FriendshipStatus } from "@/types/dashboard/community";

// ============================================================================
// Types
// ============================================================================
interface InitialUserInfo {
  fullName?: string;
  userName?: string;
  image?: string | null;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialFriendshipStatus?: FriendshipStatus;
  initialUserInfo?: InitialUserInfo;
  onStartChat?: (userId: string) => void;
}

// ============================================================================
// UserProfileModal Component
// ============================================================================
export function UserProfileModal({
  isOpen,
  onClose,
  userId,
  initialFriendshipStatus = "NONE",
  initialUserInfo,
  onStartChat,
}: UserProfileModalProps) {
  // Local state for optimistic updates
  const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus | string>(
    initialFriendshipStatus
  );
  const [showActions, setShowActions] = useState(false);

  // Reset friendshipStatus when initialFriendshipStatus changes
  useEffect(() => {
    setFriendshipStatus(initialFriendshipStatus);
  }, [initialFriendshipStatus]);

  // API queries - try to fetch, but use initial data as fallback
  const { data: profileData, isLoading: isLoadingProfile, isError } = useGetFriendProfileQuery(userId, {
    skip: !isOpen || !userId,
  });

  // Mutations
  const [sendFriendRequest, { isLoading: isSending }] = useSendFriendRequestMutation();
  const [acceptRequest, { isLoading: isAccepting }] = useAcceptFriendRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectFriendRequestMutation();
  const [unfriend, { isLoading: isUnfriending }] = useUnfriendMutation();
  const [blockUser] = useBlockUserMutation();
  const [muteUser] = useMuteUserMutation();

  // Use API data if available, otherwise use initial data
  const profile = profileData?.data;
  const displayName = profile?.fullName || initialUserInfo?.fullName || "User";
  const displayImage = profile?.image || initialUserInfo?.image;
  const displayEmail = profile?.email;

  // Handle add friend
  const handleAddFriend = async () => {
    try {
      await sendFriendRequest(userId).unwrap();
      setFriendshipStatus("PENDING");
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  // Handle accept request (when someone sent us a request)
  const handleAcceptRequest = async () => {
    try {
      // Note: This requires the request ID, which we may need to fetch
      // For now, we'll handle this case in the pending requests modal
      await acceptRequest(userId).unwrap();
      setFriendshipStatus("ACCEPTED");
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  // Handle cancel/reject request
  const handleCancelRequest = async () => {
    try {
      await rejectRequest(userId).unwrap();
      setFriendshipStatus("NONE");
    } catch (error) {
      console.error("Failed to cancel request:", error);
    }
  };

  // Handle unfriend
  const handleUnfriend = async () => {
    try {
      await unfriend(userId).unwrap();
      setFriendshipStatus("NONE");
      setShowActions(false);
    } catch (error) {
      console.error("Failed to unfriend:", error);
    }
  };

  // Handle block
  const handleBlock = async () => {
    try {
      await blockUser(userId).unwrap();
      setFriendshipStatus("BLOCKED");
      setShowActions(false);
    } catch (error) {
      console.error("Failed to block:", error);
    }
  };

  // Handle mute
  const handleMute = async () => {
    try {
      await muteUser(userId).unwrap();
      setShowActions(false);
    } catch (error) {
      console.error("Failed to mute:", error);
    }
  };

  // Handle message
  const handleMessage = () => {
    onStartChat?.(userId);
    onClose();
  };

  // Determine button to show based on friendship status
  const renderFriendshipButton = () => {
    const isLoading = isSending || isAccepting || isRejecting || isUnfriending;
    const status = friendshipStatus?.toUpperCase() || "NONE";

    switch (status) {
      case "ACCEPTED":
      case "FRIEND":
      case "FRIENDS":
        return (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              <UserCheck size={18} />
              Friends
            </button>
            {showActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
                <button
                  onClick={handleUnfriend}
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserMinus size={16} />
                  Unfriend
                </button>
                <button
                  onClick={handleMute}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <VolumeX size={16} />
                  Mute
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={handleBlock}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Ban size={16} />
                  Block
                </button>
              </div>
            )}
          </div>
        );

      case "PENDING":
      case "REQUEST_SENT":
        return (
          <button
            onClick={handleCancelRequest}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Clock size={18} />
            )}
            Pending
          </button>
        );

      case "REQUEST_RECEIVED":
        return (
          <div className="flex gap-2">
            <button
              onClick={handleAcceptRequest}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#ff5252] transition-all disabled:opacity-50"
            >
              {isAccepting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <UserCheck size={18} />
              )}
              Accept
            </button>
            <button
              onClick={handleCancelRequest}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Decline
            </button>
          </div>
        );

      case "BLOCKED":
        return (
          <button
            disabled
            className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-600 rounded-xl font-medium cursor-not-allowed"
          >
            <Ban size={18} />
            Blocked
          </button>
        );

      case "NONE":
      default:
        return (
          <button
            onClick={handleAddFriend}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#ff5252] transition-all shadow-lg shadow-[#FF6B6B]/25 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <UserPlus size={18} />
            )}
            Add Friend
          </button>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Cover / Header gradient */}
        <div className="h-28 bg-gradient-to-br from-[#FF6B6B] via-[#FF8E53] to-[#FFA726]" />

        {/* Content */}
        <div className="px-6 pb-6">
          {isLoadingProfile && !initialUserInfo ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 size={32} className="animate-spin text-[#FF6B6B]" />
            </div>
          ) : (
            <>
              {/* Avatar */}
              <div className="relative -mt-14 mb-4 flex justify-center">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-28 h-28 rounded-full object-cover shadow-xl ring-4 ring-white"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold">
                    {displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Name & Username */}
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  {displayName}
                </h2>
                {initialUserInfo?.userName && (
                  <p className="text-sm text-gray-500 mt-0.5">@{initialUserInfo.userName}</p>
                )}
                {displayEmail && (
                  <p className="text-sm text-gray-500 mt-0.5">{displayEmail}</p>
                )}
              </div>

              {/* Stats (if available) */}
              {profile?.mutualFriends && profile.mutualFriends.length > 0 && (
                <div className="flex justify-center gap-6 mb-5 py-3 border-y border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {profile.mutualFriends.length}
                    </p>
                    <p className="text-xs text-gray-500">Mutual Friends</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center gap-3">
                {renderFriendshipButton()}
                
                {/* Message button - show only if friends or NONE */}
                {friendshipStatus !== "BLOCKED" && (
                  <button
                    onClick={handleMessage}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    <MessageCircle size={18} />
                    Message
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfileModal;
