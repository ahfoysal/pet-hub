"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Users,
  UserPlus,
  Circle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { ChatUser } from "@/types/dashboard/chat";
import { useSocket } from "@/providers/SocketProvider";
import { useGetPendingRequestsQuery } from "@/redux/features/api/dashboard/common/friendshipApi";
import { useSession } from "next-auth/react";
import { ConversationsList } from "./ConversationsList";
import { CommunityList } from "./CommunityList";
import { ChatWindow } from "./ChatWindow";
import { CommunityChat } from "./CommunityChat";
import { FriendsSidebar } from "./FriendsSidebar";
import { CreateCommunityModal } from "./CreateCommunityModal";
import { PendingRequestsModal } from "./PendingRequestsModal";

// ============================================================================
// Types
// ============================================================================
type ChatTab = "messages" | "communities" | "friends";
type ChatView = "list" | "conversation" | "community";

export interface ChatLayoutProps {
  onBack?: () => void;
  initialUserId?: string | null;
}

// ============================================================================
// ChatLayout Component - Premium Design
// ============================================================================
export function ChatLayout({ onBack, initialUserId }: ChatLayoutProps) {
  // State
  const [activeTab, setActiveTab] = useState<ChatTab>("messages");
  const [currentView, setCurrentView] = useState<ChatView>("list");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isPendingRequestsOpen, setIsPendingRequestsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

  // Socket & Redux
  const { status } = useSession();
  const { onlineFriends, getOnlineFriends, isConnected } = useSocket();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const unreadCounts = useSelector((state: RootState) => state.socket.unreadCounts);

  // Fetch pending friend requests for badge
  const { data: pendingRequestsData } = useGetPendingRequestsQuery({ limit: 50 }, { skip: status === "loading" });

  // Fetch online friends on mount
  useEffect(() => {
    if (isConnected) {
      getOnlineFriends();
    }
  }, [isConnected, getOnlineFriends]);

  // Auto-open conversation when initialUserId is provided
  useEffect(() => {
    if (initialUserId) {
      setSelectedConversationId(initialUserId);
      setCurrentView("conversation");
      setActiveTab("messages");
      setIsMobileSidebarOpen(false);
    }
  }, [initialUserId]);

  // Handle conversation selection
  const handleSelectConversation = (userId: string, user: ChatUser) => {
    if (!userId) return;
    setSelectedConversationId(userId);
    setSelectedUser(user);
    setCurrentView("conversation");
    setIsMobileSidebarOpen(false);
  };

  // Handle community selection
  const handleSelectCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setCurrentView("community");
    setIsMobileSidebarOpen(false);
  };

  // Handle back to list
  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedConversationId(null);
    setSelectedUser(null);
    setSelectedCommunityId(null);
    setIsMobileSidebarOpen(true);
  };

  // Calculate unread counts
  const messageUnreadCount = Object.entries(unreadCounts)
    .filter(([k, v]) => !k.startsWith("community-") && v > 0)
    .reduce((acc, [_, v]) => acc + v, 0);
  
  const communityUnreadCount = Object.entries(unreadCounts)
    .filter(([k, v]) => k.startsWith("community-") && v > 0)
    .reduce((acc, [_, v]) => acc + v, 0);

  const pendingRequestsCount = pendingRequestsData?.data?.requests?.length || 0;

  // Tab configuration
  const tabs = [
    { id: "messages" as ChatTab, icon: MessageCircle, label: "Messages", count: messageUnreadCount },
    { id: "communities" as ChatTab, icon: Users, label: "Groups", count: communityUnreadCount },
    { id: "friends" as ChatTab, icon: UserPlus, label: "Friends", count: pendingRequestsCount },
  ];

  return (
    <div className="flex h-[calc(100vh-100px)] md:h-[calc(100vh-80px)] overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl">
      {/* Sidebar */}
      <div
        className={`
          ${isMobileSidebarOpen ? "flex" : "hidden md:flex"}
          w-full md:w-80 lg:w-96 flex-col
          bg-white/95 backdrop-blur-sm
          absolute md:relative inset-0 z-50 md:z-auto
        `}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle size={24} />
              Chat
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPendingRequestsOpen(true)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                title="Friend Requests"
              >
                <UserPlus size={20} />
              </button>
              <button
                onClick={() => setIsCreateCommunityOpen(true)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                title="Create Group"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Online Friends Strip */}
        {onlineFriends.length > 0 && (
          <div className="px-4 py-3 bg-gradient-to-r from-green-50/80 to-emerald-50/80">
            <div className="flex items-center gap-2 mb-2">
              <Circle size={8} className="text-green-500 fill-green-500" />
              <span className="text-xs font-medium text-gray-600">
                {onlineFriends.length} friend{onlineFriends.length > 1 ? "s" : ""} online
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {onlineFriends.slice(0, 8).map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleSelectConversation(friend.id, {
                    id: friend.id,
                    fullName: friend.fullName,
                    image: friend.image,
                    isOnline: true,
                  })}
                  className="flex-shrink-0 flex flex-col items-center gap-1 group"
                >
                  <div className="relative">
                    {friend.image ? (
                      <img
                        src={friend.image}
                        alt={friend.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-green-400 group-hover:ring-[#FF6B6B] transition-all"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-semibold text-sm ring-2 ring-green-400 group-hover:ring-[#FF6B6B] transition-all">
                        {friend.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <span className="text-[10px] text-gray-500 max-w-[50px] truncate">
                    {friend.fullName.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all relative
                ${
                  activeTab === tab.id
                    ? "text-[#FF6B6B] bg-white border-b-2 border-[#FF6B6B] shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }
              `}
            >
              <div className="relative">
                <tab.icon size={18} />
                {tab.count > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] px-1 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    {tab.count > 99 ? "99+" : tab.count}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "messages" && (
            <ConversationsList
              searchQuery={searchQuery}
              selectedId={selectedConversationId}
              onSelect={handleSelectConversation}
            />
          )}
          {activeTab === "communities" && (
            <CommunityList
              searchQuery={searchQuery}
              selectedId={selectedCommunityId}
              onSelect={handleSelectCommunity}
            />
          )}
          {activeTab === "friends" && (
            <FriendsSidebar
              searchQuery={searchQuery}
              onStartChat={handleSelectConversation}
            />
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`
          flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100/50
          ${isMobileSidebarOpen && currentView === "list" ? "hidden md:flex" : "flex"}
        `}
      >
        {currentView === "list" && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF8E53]/20 flex items-center justify-center shadow-inner">
                <MessageCircle size={48} className="text-[#FF6B6B]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Choose a conversation from the list or start a new chat with a friend
              </p>
            </div>
          </div>
        )}

        {currentView === "conversation" && selectedConversationId && (
          <ChatWindow
            otherUserId={selectedConversationId}
            onBack={handleBackToList}
            initialOtherUser={selectedUser}
          />
        )}

        {currentView === "community" && selectedCommunityId && (
          <CommunityChat
            communityId={selectedCommunityId}
            onBack={handleBackToList}
          />
        )}
      </div>

      {/* Modals */}
      <CreateCommunityModal
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
        onSuccess={(communityId) => {
          setIsCreateCommunityOpen(false);
          handleSelectCommunity(communityId);
        }}
      />

      <PendingRequestsModal
        isOpen={isPendingRequestsOpen}
        onClose={() => setIsPendingRequestsOpen(false)}
      />
    </div>
  );
}

export default ChatLayout;
