"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Send,
  Smile,
  X,
  Ban,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useSocket } from "@/providers/SocketProvider";
import {
  useGetConversationQuery,
  useUploadChatFileMutation,
} from "@/redux/features/api/dashboard/common/chatApi";
import {
  useGetFriendProfileQuery,
} from "@/redux/features/api/dashboard/common/friendshipApi";
import {
  useBlockUserMutation,
  useMuteUserMutation,
} from "@/redux/features/api/dashboard/common/userBlockMuteApi";
import { setActiveConversation, addDirectMessage } from "@/redux/features/slice/socketSlice";
import { formatMessageTime } from "@/lib/utils/dateUtils";
import { Message, ChatUser } from "@/types/dashboard/chat";
import { useSession } from "next-auth/react";

// ============================================================================
// Types
// ============================================================================
interface ChatWindowProps {
  otherUserId: string;
  onBack: () => void;
  initialOtherUser?: ChatUser | null;
}

// ============================================================================
// ChatWindow Component
// ============================================================================
export function ChatWindow({ otherUserId, onBack, initialOtherUser }: ChatWindowProps) {
  const dispatch = useDispatch();
  const { status } = useSession();
  const { sendMessage, sendDirectMessage, isConnected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [messageText, setMessageText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Redux state
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);
  const socketMessages = useSelector(
    (state: RootState) => (state.socket as any).directMessages[otherUserId] || []
  );

  // API queries
  const { data: conversationData, isLoading: isLoadingMessages } = useGetConversationQuery({
    otherUserId,
    limit: 50,
  }, { skip: status === "loading" });
  const { data: profileData } = useGetFriendProfileQuery(otherUserId, { skip: status === "loading" });

  // Mutations
  const [uploadFile, { isLoading: isUploading }] = useUploadChatFileMutation();
  const [blockUser] = useBlockUserMutation();
  const [muteUser] = useMuteUserMutation();

  // Combine API messages with socket messages
  const messages = React.useMemo(() => {
    const apiMessages = conversationData?.data?.data || [];
    const allMessages = [...apiMessages, ...socketMessages];
    
    // Remove duplicates and normalize fields
    const uniqueMessages = allMessages.reduce((acc, msg) => {
      if (!acc.find((m: Message) => m.id === msg.id)) {
        // Normalize the message - handle all possible field names for robust rendering
        const messageText = msg.message || msg.content || (msg as any).text || "";
        const timestamp = msg.createdAt || msg.timestamp || (msg as any).sentAt || new Date().toISOString();
        const mediaUrl = msg.media || (msg as any).imageUrl || (msg as any).image || (msg as any).fileUrl || (msg as any).file || (msg as any).attachment || null;
        const mediaType = msg.mediaType || (msg as any).type || (mediaUrl ? "image" : null);
        
        const normalizedMsg = {
          ...msg,
          createdAt: timestamp,
          timestamp: timestamp,
          message: messageText,
          content: messageText,
          media: mediaUrl,
          mediaType: mediaType,
        };
        
        acc.push(normalizedMsg);
      }
      return acc;
    }, [] as Message[]);

    return uniqueMessages.sort(
      (a: Message, b: Message) => {
        const timeA = new Date(a.createdAt || (a as any).timestamp || 0).getTime();
        const timeB = new Date(b.createdAt || (b as any).timestamp || 0).getTime();
        return timeA - timeB;
      }
    );
  }, [conversationData, socketMessages, otherUserId]);

  // Set active conversation on mount
  useEffect(() => {
    dispatch(setActiveConversation(otherUserId));
    return () => {
      dispatch(setActiveConversation(null));
    };
  }, [otherUserId, dispatch]);

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

    // Send via socket with individual arguments (Legacy Omega Pattern)
    // Some backends expect (receiverId, content, media, mediaType)
    sendDirectMessage(
      otherUserId,
      messageText.trim(),
      mediaUrl || undefined,
      mediaType || (mediaUrl ? "image" : undefined)
    );

    // Optimistic update
    const currentUserId = (currentUser as any)?._id || (currentUser as any)?.id;
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId || "",
      receiverId: otherUserId,
      message: messageText.trim(),
      content: messageText.trim(),
      media: mediaUrl || null,
      mediaType: (mediaType as any) || (mediaUrl ? "image" : null),
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId || "",
        _id: currentUserId || "",
        fullName: currentUser?.name || "Me",
        image: currentUser?.image || null,
      } as any
    };
    dispatch(addDirectMessage({ conversationId: otherUserId, message: optimisticMessage }));

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

  // Get other user info
  const otherUser = profileData?.data || initialOtherUser || {
    id: otherUserId,
    fullName: "User",
    email: "",
    image: null,
  };

  const isOnline = onlineUsers[otherUserId];

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

        {/* User info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            {otherUser.image ? (
              <img
                src={otherUser.image}
                alt={otherUser.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-semibold">
                {otherUser.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser.fullName}</h3>
            <p className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
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
                    muteUser(otherUserId);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <VolumeX size={16} />
                  Mute notifications
                </button>
                <button
                  onClick={() => {
                    blockUser(otherUserId);
                    setShowOptions(false);
                    onBack();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Ban size={16} />
                  Block user
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
              <Send size={24} className="text-gray-400" />
            </div>
            <p className="text-sm">Start a conversation</p>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {messages.map((message: Message, index: number) => {
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
                    {/* Avatar placeholder for spacing */}
                    {!isOwn && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && (
                          <img
                            src={otherUser.image || ""}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shadow-sm"
                          />
                        )}
                      </div>
                    )}

                    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                      {showName && (
                        <span className="text-[10px] font-medium text-gray-400 ml-1 mb-1">
                          {otherUser.fullName}
                        </span>
                      )}
                      
                      {/* Message bubble */}
                      <div
                        className={`group relative rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200 ${
                          isOwn
                            ? `bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white ${
                                isLastInGroup ? "rounded-br-none" : ""
                              }`
                            : `bg-white text-gray-800 shadow-sm ${
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
                        {(message.message || message.content) && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.message || message.content}
                          </p>
                        )}
                        
                        {/* Status/Time on hover or last in group */}
                        <div className={`
                          flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity
                          ${isOwn ? "justify-end text-white/70" : "justify-start text-gray-400"}
                          ${isLastInGroup && !isOwn ? "opacity-100" : ""}
                          ${isLastInGroup && isOwn ? "opacity-100" : ""}
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
    </div>
  );
}

export default ChatWindow;
