"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGetMyConversationsQuery } from "@/redux/features/api/dashboard/common/chatApi";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "@/lib/utils/dateUtils";
import { MessageCircle } from "lucide-react";
import { ChatUser } from "@/types/dashboard/chat";

// ============================================================================
// Types
// ============================================================================
interface ConversationsListProps {
  searchQuery: string;
  selectedId: string | null;
  onSelect: (userId: string, user: ChatUser) => void;
}

// ============================================================================
// ConversationsList Component - Premium Design
// ============================================================================
export function ConversationsList({
  searchQuery,
  selectedId,
  onSelect,
}: ConversationsListProps) {
  const { status } = useSession();
  const { data: conversations, isLoading } = useGetMyConversationsQuery(undefined, { skip: status === "loading" });

  // Filter conversations by search query
  const filteredConversations = React.useMemo(() => {
    if (!conversations) return [];
    if (!searchQuery) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) =>
      conv.otherUser.fullName.toLowerCase().includes(query) ||
      conv.otherUser.email?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse p-3 rounded-xl bg-gray-50">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!filteredConversations || filteredConversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shadow-inner">
          <MessageCircle size={32} className="text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          {searchQuery ? "No conversations found" : "No messages yet"}
        </h3>
        <p className="text-xs text-gray-500">
          {searchQuery
            ? "Try a different search term"
            : "Start chatting with your friends"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {filteredConversations.map((conversation, index) => {
        const userId = (conversation.otherUser as any)._id || conversation.otherUser.id;
        const isSelected = selectedId === conversation.otherUser.id || selectedId === (conversation.otherUser as any)._id;
        
        return (
          <motion.button
            key={conversation.conversationId || userId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              onSelect(userId, conversation.otherUser);
            }}
            className={`
              w-full p-3 flex items-center gap-3 text-left transition-all duration-200 rounded-xl
              ${isSelected
                ? "bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8E53]/10 shadow-sm ring-1 ring-[#FF6B6B]/20" 
                : "hover:bg-gray-50 active:bg-gray-100"}
            `}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {conversation.otherUser.image ? (
                <img
                  src={conversation.otherUser.image}
                  alt={conversation.otherUser.fullName}
                  className={`w-12 h-12 rounded-full object-cover shadow-sm transition-all ${
                    isSelected ? "ring-2 ring-[#FF6B6B]" : ""
                  }`}
                />
              ) : (
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-semibold text-lg shadow-sm transition-all ${
                  isSelected ? "ring-2 ring-[#FF6B6B]" : ""
                }`}>
                  {conversation.otherUser.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Online indicator */}
              {conversation.otherUser.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h4 className={`font-semibold truncate ${isSelected ? "text-[#FF6B6B]" : "text-gray-900"}`}>
                  {conversation.otherUser.fullName}
                </h4>
                {conversation.lastMessage && (
                  <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2 font-medium">
                    {formatDistanceToNow(new Date(conversation.lastMessage.sentAt))}
                  </span>
                )}
              </div>
              {conversation.lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage.media
                    ? "📎 Attachment"
                    : (conversation.lastMessage.content || (conversation.lastMessage as any).message || "")}
                </p>
              )}
            </div>

            {/* Unread badge */}
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <div className="flex-shrink-0">
                <div className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                  {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                </div>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export default ConversationsList;
