"use client";

import React from "react";
import { MessageCircle, UserPlus, UserMinus } from "lucide-react";
import {
  useGetFriendsQuery,
  useGetFriendSuggestionsQuery,
  useSendFriendRequestMutation,
  useUnfriendMutation,
} from "@/redux/features/api/dashboard/common/friendshipApi";
import { useSession } from "next-auth/react";
import { ChatUser } from "@/types/dashboard/chat";

// ============================================================================
// Types
// ============================================================================
interface FriendsSidebarProps {
  searchQuery: string;
  onStartChat: (userId: string, user: ChatUser) => void;
}

// ============================================================================
// FriendsSidebar Component
// ============================================================================
export function FriendsSidebar({
  searchQuery,
  onStartChat,
}: FriendsSidebarProps) {
  const { status } = useSession();
  // API queries
  const { data: friendsData, isLoading: isLoadingFriends } = useGetFriendsQuery({
    limit: 50,
    search: searchQuery || undefined,
  }, { skip: status === "loading" });
  const { data: suggestionsData, isLoading: isLoadingSuggestions } =
    useGetFriendSuggestionsQuery({ limit: 10 }, { skip: status === "loading" });

  // Mutations
  const [sendFriendRequest, { isLoading: isSending }] = useSendFriendRequestMutation();
  const [unfriend] = useUnfriendMutation();

  const friends = friendsData?.data?.friends || [];
  const suggestions = suggestionsData?.data?.users || [];

  // Handle send friend request
  const handleSendRequest = async (userId: string) => {
    try {
      await sendFriendRequest(userId).unwrap();
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  return (
    <div className="divide-y divide-gray-100">
      {/* Friend Suggestions */}
      {!searchQuery && suggestions.length > 0 && (
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Suggested Friends
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.userId}
                className="flex-shrink-0 w-24 text-center"
              >
                <div className="relative mb-2">
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.fullName}
                      className="w-16 h-16 mx-auto rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-semibold text-lg">
                      {suggestion.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-900 truncate mb-2">
                  {suggestion.fullName}
                </p>
                <button
                  onClick={() => handleSendRequest(suggestion.userId)}
                  disabled={isSending}
                  className="w-full py-1.5 text-xs font-medium bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ff5252] transition-colors disabled:opacity-50"
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Your Friends ({friends.length})
        </h3>

        {isLoadingFriends ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              {searchQuery ? "No friends found" : "No friends yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.userId}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                {/* Avatar */}
                <div className="relative">
                  {friend.image ? (
                    <img
                      src={friend.image}
                      alt={friend.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-semibold">
                      {friend.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {friend.fullName}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">{friend.email}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onStartChat(friend.userId, {
                      id: friend.userId,
                      fullName: friend.fullName,
                      image: friend.image,
                      email: friend.email,
                      isOnline: friend.isOnline,
                    })}
                    className="p-2 text-gray-500 hover:text-[#FF6B6B] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Send message"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button
                    onClick={() => unfriend(friend.userId)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Unfriend"
                  >
                    <UserMinus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsSidebar;
