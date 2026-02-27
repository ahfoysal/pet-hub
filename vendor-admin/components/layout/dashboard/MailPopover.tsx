"use client";

import { Mail, ExternalLink, User as UserIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useGetMyConversationsQuery } from "@/redux/features/api/dashboard/common/chatApi";

interface MailPopoverProps {
  onClose: () => void;
}

export default function MailPopover({ onClose }: MailPopoverProps) {
  const { data: conversations, isLoading } = useGetMyConversationsQuery();

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="absolute -right-10 sm:right-0 mt-3 w-90 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 z-120 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
        <h3 className="font-bold text-[#101828] text-lg font-inter">Messages</h3>
        <Link 
          href="/vendor/community?tab=chat" 
          className="text-primary text-xs font-semibold hover:underline font-inter"
          onClick={onClose}
        >
          Open Chat
        </Link>
      </div>

      <div className="max-h-100 overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        ) : conversations && conversations.length > 0 ? (
          conversations.map((conv) => (
            <Link
              href={`/vendor/community?tab=chat`}
              key={conv.conversationId || conv.otherUser?.id}
              onClick={onClose}
              className="p-4 border-b border-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative block"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {conv.otherUser?.image ? (
                    <Image src={conv.otherUser.image} alt={conv.otherUser.fullName} fill className="object-cover" />
                  ) : (
                    <UserIcon size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="space-y-1 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#101828] truncate font-inter">
                      {conv.otherUser?.fullName || "User"}
                    </p>
                    <span className="text-[10px] text-[#6a7282] font-medium font-inter shrink-0">
                      {formatTime(conv.lastMessage?.sentAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a5565] truncate font-inter">
                    {conv.lastMessage?.content || "Started a conversation"}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-10 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm font-inter">No new messages</p>
          </div>
        )}
      </div>

      <Link
        href="/vendor/community?tab=chat"
        className="block p-3 text-center border-t border-gray-50 hover:bg-gray-50 transition-colors"
        onClick={onClose}
      >
        <span className="text-sm font-bold text-primary flex items-center justify-center gap-2 font-inter">
          See all messages
          <ExternalLink size={14} />
        </span>
      </Link>
    </div>
  );
}
