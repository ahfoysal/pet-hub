"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CommunityManagement } from "@/components/dashboard/common/community/CommunityManagement";
import { ChatLayout } from "@/components/dashboard/common/chat";
import { MessageCircle, Users } from "lucide-react";

type Tab = "feed" | "chat";

export default function VendorCommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(tabParam === "chat" ? "chat" : "feed");
  const [chatUserId, setChatUserId] = useState<string | null>(null);

  useEffect(() => {
    if ((tabParam === "chat" || tabParam === "feed") && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  const handleMessage = () => {
    setChatUserId(null);
    handleTabChange("chat");
  };

  const handleUserClick = (userId: string) => {
    console.log("User clicked:", userId);
    // Profile modal is now handled inside CommunityManagement
  };
  
  const handleStartChat = (userId: string) => {
    // When user clicks "Message" in profile modal, switch to chat with that user
    setChatUserId(userId);
    handleTabChange("chat");
  };

  return (
    <div className="h-full">
      {/* Tab Navigation */}
      <div className="flex mb-4 bg-white rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => handleTabChange("feed")}
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
          onClick={() => handleTabChange("chat")}
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
