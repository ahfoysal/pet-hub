"use client";

import { useState } from "react";
import { CommunityManagement } from "@/components/dashboard/common/community/CommunityManagement";
import { ChatLayout } from "@/components/dashboard/common/chat";
import { MessageCircle, Users } from "lucide-react";

type Tab = "feed" | "chat";

export default function SitterCommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [chatUserId, setChatUserId] = useState<string | null>(null);

  const handleMessage = () => {
    setChatUserId(null);
    setActiveTab("chat");
  };

  const handleUserClick = (userId: string) => {
    console.log("User clicked:", userId);
  };
  
  const handleStartChat = (userId: string) => {
    setChatUserId(userId);
    setActiveTab("chat");
  };

  return (
    <div className="h-full">
      {/* Tab Navigation */}
      <div className="flex mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${
            activeTab === "feed"
              ? "text-[#FF6B6B] bg-[#FF6B6B]/5"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Users size={20} />
          <span className="sm:hidden">Feed</span>
          <span className="hidden sm:inline">Community Feed</span>
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${
            activeTab === "chat"
              ? "text-[#FF6B6B] bg-[#FF6B6B]/5"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <MessageCircle size={20} />
          <span>Messages</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "feed" && (
        <CommunityManagement
          onMessage={handleMessage}
          onUserClick={handleUserClick}
          onStartChat={handleStartChat}
        />
      )}
      {activeTab === "chat" && <ChatLayout initialUserId={chatUserId} />}
    </div>
  );
}