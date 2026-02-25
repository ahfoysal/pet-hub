"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Users,
  Settings,
  Image as ImageIcon,
  Paperclip,
  Send,
  X,
  LogOut,
  UserPlus,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useSocket } from "@/providers/SocketProvider";
import {
  useGetCommunityDetailsQuery,
  useGetCommunityMessagesQuery,
  useLeaveCommunityMutation,
} from "@/redux/features/api/dashboard/common/communityChatApi";
import { useUploadChatFileMutation } from "@/redux/features/api/dashboard/common/chatApi";
import { setActiveCommunity, addCommunityMessage } from "@/redux/features/slice/socketSlice";
import { formatMessageTime } from "@/lib/utils/dateUtils";
import { CommunityMessage } from "@/types/dashboard/chat";
import { CommunitySettingsModal } from "./CommunitySettingsModal";

// ============================================================================
// Types
// ============================================================================
interface CommunityChatProps {
  communityId: string;
  onBack: () => void;
}

// ============================================================================
// CommunityChat Component
// ============================================================================
export function CommunityChat({ communityId, onBack }: CommunityChatProps) {
  const dispatch = useDispatch();
  const { sendGroupMessage, isConnected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [messageText, setMessageText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Redux state
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);
  const socketMessages = useSelector(
    (state: RootState) => state.socket.communityMessages[communityId] || []
  );

  // API queries
  const { data: communityData, isLoading: isLoadingCommunity } =
    useGetCommunityDetailsQuery(communityId);
  const { data: messagesData, isLoading: isLoadingMessages } =
    useGetCommunityMessagesQuery({ communityId, limit: 50 });

  // Mutations
  const [uploadFile, { isLoading: isUploading }] = useUploadChatFileMutation();
  const [leaveCommunity] = useLeaveCommunityMutation();

  // Get community info
  const community = communityData?.data;
  const participants = community?.participants || [];

  // Combine API messages with socket messages
  const messages = React.useMemo(() => {
    const apiMessages = messagesData?.data?.data || [];
    const allMessages = [...apiMessages, ...socketMessages];

    // Remove duplicates and sort by timestamp
    const uniqueMessages = allMessages.reduce((acc, msg) => {
      if (!acc.find((m) => m.id === msg.id)) {
        acc.push(msg);
      }
      return acc;
    }, [] as CommunityMessage[]);

    return uniqueMessages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messagesData, socketMessages]);

  // Set active community on mount
  useEffect(() => {
    dispatch(setActiveCommunity(communityId));
    return () => {
      dispatch(setActiveCommunity(null));
    };
  }, [communityId, dispatch]);

  // Scroll to bottom on new messages (instant on initial load, smooth after)
  const hasInitialScrolled = useRef(false);
  useEffect(() => {
    if (messagesEndRef.current) {
      const behavior = hasInitialScrolled.current ? "smooth" : "instant";
      messagesEndRef.current.scrollIntoView({ behavior: behavior as ScrollBehavior });
      hasInitialScrolled.current = true;
    }
  }, [messages]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedFile) return;

    let mediaUrl = "";
    let mediaType = "";

    // Upload file if selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const result = await uploadFile(formData).unwrap();
        mediaUrl = result.data?.url || "";
        mediaType = result.data?.format.startsWith("video") ? "video" : "image";
      } catch (error) {
        console.error("Failed to upload file:", error);
        return;
      }
    }

    // Send via socket
    sendGroupMessage({
      communityId,
      message: messageText.trim(),
      media: mediaUrl || undefined,
      mediaType: mediaType || undefined,
    });

    // Optimistic update
    const currentUserId = (currentUser as any)?._id || (currentUser as any)?.id;
    const optimisticMessage: CommunityMessage = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId || "",
      communityId,
      message: messageText.trim(),
      content: messageText.trim(), // Include for compatibility
      media: mediaUrl || undefined,
      mediaType: (mediaType as "image" | "video" | "file") || undefined,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId || "",
        _id: currentUserId || "", // Include for compatibility
        fullName: currentUser?.name || "",
        image: currentUser?.image || null,
      } as any,
    };
    dispatch(addCommunityMessage({ communityId, message: optimisticMessage }));

    // Reset form
    setMessageText("");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle leave
  const handleLeave = async () => {
    try {
      await leaveCommunity(communityId).unwrap();
      onBack();
    } catch (error) {
      console.error("Failed to leave community:", error);
    }
  };

  if (isLoadingCommunity) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="animate-spin w-8 h-8 border-2 border-[#FF6B6B] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Community info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            {community?.image ? (
              <img
                src={community.image}
                alt={community.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <Users size={20} />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{community?.name}</h3>
            <p className="text-xs text-gray-500">{participants.length} members</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-500 hover:text-[#FF6B6B] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Info size={20} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-500 hover:text-[#FF6B6B] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            {showOptions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings size={16} />
                  Group settings
                </button>
                <button
                  onClick={() => {
                    handleLeave();
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Leave group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-8 h-8 border-2 border-[#FF6B6B] border-t-transparent rounded-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Users size={24} className="text-gray-400" />
            </div>
            <p className="text-sm">Start chatting in this group</p>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {messages.map((message, index) => {
              const currentUserId = (currentUser as any)?._id || (currentUser as any)?.id;
              const isOwn = message.senderId === currentUserId;
              const nextMessage = messages[index + 1];
              const prevMessage = messages[index - 1];
              
              const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
              const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId;
              
              const showAvatar = !isOwn && isLastInGroup;
              const showName = !isOwn && isFirstInGroup;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-4" : "mt-0.5"}`}
                >
                  <div
                    className={`flex items-end gap-2 max-w-[80%] ${
                      isOwn ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar for group */}
                    {!isOwn && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && (
                          <img
                            src={message.sender?.image || ""}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200"
                          />
                        )}
                      </div>
                    )}

                    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                      {showName && (
                        <span className="text-[10px] font-medium text-[#FF6B6B] ml-1 mb-1">
                          {message.sender?.fullName}
                        </span>
                      )}
                      
                      {/* Message bubble */}
                      <div
                        className={`group relative rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200 ${
                          isOwn
                            ? `bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white ${
                                isLastInGroup ? "rounded-br-none" : ""
                              }`
                            : `bg-white text-gray-800 border border-gray-100 ${
                                isLastInGroup ? "rounded-bl-none" : ""
                              }`
                        }`}
                      >
                        {message.media && (
                          <div className="mb-2 overflow-hidden rounded-lg">
                            {message.mediaType === "video" ? (
                              <video
                                src={message.media}
                                controls
                                className="max-w-full max-h-[300px] object-contain"
                              />
                            ) : (
                              <img
                                src={message.media}
                                alt=""
                                className="max-w-full max-h-[300px] object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                              />
                            )}
                          </div>
                        )}
                        {(message.message || (message as any).content) && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.message || (message as any).content}
                        </p>
                      )}
                        
                        {/* Time on hover */}
                        <div className={`
                          flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity
                          ${isOwn ? "justify-end text-white/70" : "justify-start text-gray-400"}
                          ${isLastInGroup ? "opacity-100" : ""}
                        `}>
                          <span className="text-[10px]">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File preview */}
      {previewUrl && (
        <div className="px-4 py-2 bg-gray-50/80 backdrop-blur-sm">
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-20 rounded-lg object-cover"
            />
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-[#FF6B6B] hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            <Paperclip size={20} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-[#FF6B6B] hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            <ImageIcon size={20} />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#FF6B6B]/10 focus:border-[#FF6B6B] transition-all resize-none shadow-inner"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && !selectedFile) || isUploading}
            className={`p-3 rounded-xl transition-all duration-200 active:scale-95 ${
              messageText.trim() || selectedFile
                ? "bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white shadow-md hover:shadow-lg hover:brightness-105"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {community && (
        <CommunitySettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          community={community}
        />
      )}
    </div>
  );
}

export default CommunityChat;
