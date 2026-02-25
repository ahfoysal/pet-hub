"use client";

import React from "react";
import { Users } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useGetMyCommunitiesQuery } from "@/redux/features/api/dashboard/common/communityChatApi";
import { formatDistanceToNow } from "@/lib/utils/dateUtils";
import { useSession } from "next-auth/react";

// ============================================================================
// Types
// ============================================================================
interface CommunityListProps {
  searchQuery: string;
  selectedId: string | null;
  onSelect: (communityId: string) => void;
}

// ============================================================================
// CommunityList Component
// ============================================================================
export function CommunityList({
  searchQuery,
  selectedId,
  onSelect,
}: CommunityListProps) {
  const { status } = useSession();
  const { data: communitiesResponse, isLoading } = useGetMyCommunitiesQuery(undefined, { skip: status === "loading" });
  const communities = communitiesResponse?.data || [];
  const unreadCounts = useSelector((state: RootState) => state.socket.unreadCounts);

  // Filter and sort communities (unread first, then by most recent message)
  const filteredCommunities = React.useMemo(() => {
    if (!communities) return [];
    
    let result = [...communities];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (community) =>
          community.name.toLowerCase().includes(query) ||
          community.description?.toLowerCase().includes(query)
      );
    }
    
    // Sort: unread first, then by lastMessageAt
    result.sort((a, b) => {
      const aUnread = unreadCounts[`community-${a.id}`] || 0;
      const bUnread = unreadCounts[`community-${b.id}`] || 0;
      
      // Unread groups first
      if (aUnread > 0 && bUnread === 0) return -1;
      if (bUnread > 0 && aUnread === 0) return 1;
      
      // Then by most recent message
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });
    
    return result;
  }, [communities, searchQuery, unreadCounts]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!filteredCommunities || filteredCommunities.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          {searchQuery ? "No groups found" : "No groups yet"}
        </h3>
        <p className="text-xs text-gray-500">
          {searchQuery
            ? "Try a different search term"
            : "Create a group to start chatting"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredCommunities.map((community) => {
        const unreadCount = unreadCounts[`community-${community.id}`] || 0;
        const hasUnread = unreadCount > 0;
        
        return (
          <button
            key={community.id}
            onClick={() => onSelect(community.id)}
            className={`
              w-full p-4 flex items-start gap-3 text-left transition-all hover:bg-gray-50
              ${selectedId === community.id ? "bg-[#FF6B6B]/5 border-l-2 border-[#FF6B6B]" : ""}
              ${hasUnread && selectedId !== community.id ? "bg-[#FF6B6B]/10 animate-pulse" : ""}
            `}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {community.image ? (
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Users size={24} />
                </div>
              )}
              {/* Unread badge */}
              {hasUnread && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#FF6B6B] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-semibold truncate ${hasUnread ? "text-[#FF6B6B]" : "text-gray-900"}`}>
                  {community.name}
                </h4>
                {community.lastMessageAt && (
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(community.lastMessageAt))}
                  </span>
                )}
              </div>
              {community.description && (
                <p className="text-sm text-gray-500 truncate">
                  {community.description}
                </p>
              )}
              {community.lastMessage && (
                <p className={`text-xs truncate mt-1 ${hasUnread ? "text-gray-600 font-medium" : "text-gray-400"}`}>
                  {community.lastMessage.sender?.fullName}: {community.lastMessage.message}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default CommunityList;

