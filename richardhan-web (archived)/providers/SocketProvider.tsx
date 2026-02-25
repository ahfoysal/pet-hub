"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, getStore } from "@/redux/store/store";
import { useToast } from "@/contexts/ToastContext";
import {
  setConnected,
  setDisconnected,
  addDirectMessage,
  addCommunityMessage,
  setDirectMessages,
  setCommunityMessages,
  updateContacts,
  joinCommunity,
  leaveCommunity,
} from "@/redux/features/slice/socketSlice";
// import { addNotification } from "@/redux/features/slice/notificationSlice";
import {
  Message,
  CommunityMessage,
  SocketConnectedPayload,
  SendMessagePayload,
  SendGroupMessagePayload,
  LoadMessagesPayload,
  LoadGroupMessagesPayload,
  ContactUpdate,
  UserJoinedLeftPayload,
} from "@/types/dashboard/chat";

// ============================================================================
// Socket Context Types
// ============================================================================
interface OnlineFriend {
  id: string;
  userName: string;
  fullName: string;
  image: string;
  isOnline: boolean;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineFriends: OnlineFriend[];
  // One-to-One Chat
  sendMessage: (payload: SendMessagePayload) => void;
  sendDirectMessage: (receiverId: string, content: string, media?: string, mediaType?: string) => void;
  loadMessages: (payload: LoadMessagesPayload) => void;
  loadContacts: () => void;
  getOnlineFriends: (cursor?: string, limit?: number) => void;
  // Group Chat
  sendGroupMessage: (payload: SendGroupMessagePayload) => void;
  loadGroupMessages: (payload: LoadGroupMessagesPayload) => void;
  loadGroupParticipants: (communityId: string) => void;
  notifyGroupCreated: (communityId: string) => void;
  notifyUserJoined: (communityId: string, participantId: string) => void;
  notifyUserLeft: (communityId: string) => void;
  notifyUserRemoved: (communityId: string, participantId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

// ============================================================================
// Socket Provider Component
// ============================================================================
interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const [onlineFriends, setOnlineFriends] = React.useState<OnlineFriend[]>([]);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isConnected = useSelector((state: RootState) => state.socket.isConnected);
  const { showToast } = useToast();

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    if (!accessToken || socketRef.current?.connected) return;

    // Use dedicated socket URL or fallback to base URL without /api
    const socketUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL || 
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "";
    
    console.log("🔌 Connecting to socket:", socketUrl);
    
    const socket = io(socketUrl, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socket;

    // ========================================================================
    // Connection Events
    // ========================================================================
    socket.on("connect", () => {
      console.log("🔌 Socket connected");
      reconnectAttempts.current = 0;
    });

    socket.on("connected", (payload: SocketConnectedPayload) => {
      console.log("✅ Socket authenticated:", payload);
      dispatch(setConnected({
        userId: payload.userId,
        communities: payload.communities,
      }));
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      dispatch(setDisconnected());
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      reconnectAttempts.current++;
    });

    // ========================================================================
    // One-to-One Chat Events
    // ========================================================================
    socket.on("new-message", (rawMessage: any) => {
      console.log("📨 RECEIVE confirmation (new-message):", rawMessage);
      
      const state = (getStore().getState() as RootState);
      const activeUserId = state.socket.activeConversationId;
      
      // Helper to find media in various possible fields
      const findMedia = (msg: any) => {
        // Try direct fields
        const direct = msg.media || msg.mediaUrl || msg.imageUrl || msg.fileUrl || msg.image_url || msg.media_url || msg.file_url || msg.image || msg.file || msg.attachment;
        if (typeof direct === 'string') return direct;
        if (Array.isArray(direct) && direct.length > 0) {
          return typeof direct[0] === 'string' ? direct[0] : direct[0].url || direct[0].media;
        }
        
        // Try nested in objects
        if (msg.attachment && typeof msg.attachment === 'object') return msg.attachment.url || msg.attachment.media;
        if (msg.file && typeof msg.file === 'object') return msg.file.url;
        
        // Try plural fields
        if (Array.isArray(msg.attachments) && msg.attachments.length > 0) return msg.attachments[0].url || msg.attachments[0].media;
        if (Array.isArray(msg.files) && msg.files.length > 0) return msg.files[0].url;
        if (Array.isArray(msg.mediaArray) && msg.mediaArray.length > 0) return msg.mediaArray[0];
        
        return null;
      };

      // Normalize incoming message for storage
      const message: Message = {
        ...rawMessage,
        id: rawMessage.id || `msg-${Date.now()}`,
        senderId: rawMessage.senderId || "",
        receiverId: rawMessage.receiverId || activeUserId || "",
        content: rawMessage.content || rawMessage.message || rawMessage.text || "",
        message: rawMessage.message || rawMessage.content || rawMessage.text || "",
        media: findMedia(rawMessage),
        mediaType: rawMessage.mediaType || rawMessage.media_type || (findMedia(rawMessage) ? "image" : null),
        createdAt: rawMessage.createdAt || rawMessage.sentAt || new Date().toISOString(),
      };

      const conversationId = message.receiverId || activeUserId || rawMessage.conversationId || "";
      console.log("📍 Confirmation mapped to conversationId:", conversationId);
      dispatch(addDirectMessage({ conversationId, message }));
    });

    socket.on("receive-message", (rawMessage: any) => {
      console.log("📩 RECEIVE message (receive-message):", rawMessage);
      
      // Helper to find media in various possible fields
      const findMedia = (msg: any) => {
        // Try direct fields
        const direct = msg.media || msg.mediaUrl || msg.imageUrl || msg.fileUrl || msg.image_url || msg.media_url || msg.file_url || msg.image || msg.file || msg.attachment;
        if (typeof direct === 'string') return direct;
        if (Array.isArray(direct) && direct.length > 0) {
          return typeof direct[0] === 'string' ? direct[0] : direct[0].url || direct[0].media;
        }
        
        // Try nested in objects
        if (msg.attachment && typeof msg.attachment === 'object') return msg.attachment.url || msg.attachment.media;
        if (msg.file && typeof msg.file === 'object') return msg.file.url;
        
        // Try plural fields
        if (Array.isArray(msg.attachments) && msg.attachments.length > 0) return msg.attachments[0].url || msg.attachments[0].media;
        if (Array.isArray(msg.files) && msg.files.length > 0) return msg.files[0].url;
        
        return null;
      };

      // Normalize incoming message
      const message: Message = {
        ...rawMessage,
        id: rawMessage.id || `msg-${Date.now()}`,
        senderId: rawMessage.senderId || "",
        content: rawMessage.content || rawMessage.message || rawMessage.text || "",
        message: rawMessage.message || rawMessage.content || rawMessage.text || "",
        media: findMedia(rawMessage),
        mediaType: rawMessage.mediaType || rawMessage.media_type || (findMedia(rawMessage) ? "image" : null),
        createdAt: rawMessage.createdAt || rawMessage.sentAt || new Date().toISOString(),
      };

      const conversationId = message.senderId || rawMessage.conversationId || "";
      console.log("📍 Reception mapped to conversationId:", conversationId);
      dispatch(addDirectMessage({ conversationId, message }));
      
      // show notification if not in active conversation and NOT self
      const state = (getStore().getState() as RootState);
      const currentUser = state.auth.user as any;
      const currentUserId = currentUser?._id || currentUser?.id;
      
      if (message.senderId !== currentUserId && state.socket.activeConversationId !== conversationId) {
        const senderName = message.sender?.fullName || "User";
        const text = message.content || "New message";
        showToast(`New message from ${senderName}: ${text.substring(0, 30)}${text.length > 30 ? "..." : ""}`, "info");
      }
    });

    socket.on("contacts-updated", (contacts: ContactUpdate[]) => {
      console.log("📋 Contacts updated:", contacts);
      dispatch(updateContacts(contacts));
    });

    socket.on("messages-loaded", (data: { data: Message[]; nextCursor: string | null }) => {
      console.log("📦 Messages loaded:", data);
      // This will be handled by the component that requested the messages
    });

    // ========================================================================
    // Group Chat Events
    // ========================================================================
    socket.on("group-created", (payload: { communityId: string }) => {
      console.log("🏠 Group created:", payload);
      dispatch(joinCommunity(payload.communityId));
    });

    socket.on("new-group", (payload: { communityId: string }) => {
      console.log("🏠 Added to new group:", payload);
      dispatch(joinCommunity(payload.communityId));
    });

    socket.on("user-joined", (payload: UserJoinedLeftPayload) => {
      console.log("👋 User joined group:", payload);
      // Handle user joined notification
      if (payload.message) {
        dispatch(addCommunityMessage({
          communityId: payload.communityId,
          message: {
            id: payload.messageId,
            senderId: payload.user.id,
            message: payload.message,
            createdAt: new Date().toISOString(),
            sender: payload.user,
          },
        }));
      }
    });

    socket.on("user-left", (payload: UserJoinedLeftPayload) => {
      console.log("🚶 User left group:", payload);
      if (payload.message) {
        dispatch(addCommunityMessage({
          communityId: payload.communityId,
          message: {
            id: payload.messageId,
            senderId: payload.user.id,
            message: payload.message,
            createdAt: new Date().toISOString(),
            sender: payload.user,
          },
        }));
      }
    });

    socket.on("user-removed", (payload: UserJoinedLeftPayload) => {
      console.log("🚫 User removed from group:", payload);
      if (payload.message) {
        dispatch(addCommunityMessage({
          communityId: payload.communityId,
          message: {
            id: payload.messageId,
            senderId: payload.user.id,
            message: payload.message,
            createdAt: new Date().toISOString(),
            sender: payload.user,
          },
        }));
      }
    });

    socket.on("new-group-message", (message: CommunityMessage) => {
      console.log("💬 New group message:", message);
      const communityId = message.communityId || message.communityTopicId || "";
      dispatch(addCommunityMessage({ communityId, message }));

      // show notification if not in active community and NOT self
      const state = (getStore().getState() as RootState);
      const currentUser = state.auth.user as any;
      const currentUserId = currentUser?._id || currentUser?.id;
      
      if (message.senderId !== currentUserId && state.socket.activeCommunityId !== communityId) {
        const text = message.message || (message as any).content || "New message";
        showToast(`Group message: ${text.substring(0, 30)}${text.length > 30 ? "..." : ""}`, "info");
      }
    });

    socket.on("group-messages-loaded", (data: { data: CommunityMessage[]; nextCursor: string | null }) => {
      console.log("📦 Group messages loaded:", data);
      // This will be handled by the component that requested the messages
    });

    socket.on("group-participants-updated", (participants: Array<{ id: string; fullName: string; image: string }>) => {
      console.log("👥 Group participants updated:", participants);
      // This will trigger a refetch via RTK Query
    });

    // ========================================================================
    // Online Friends Events
    // ========================================================================
    socket.on("get-online-friends", (data: { data: OnlineFriend[]; nextCursor: string | null }) => {
      console.log("👥 Online friends received:", data);
      if (data.data) {
        setOnlineFriends(prev => {
          // If it's the first page (no cursor was used), replace the list
          // Otherwise append to existing list
          const existingIds = new Set(prev.map(f => f.id));
          const newFriends = data.data.filter(f => !existingIds.has(f.id));
          return [...prev, ...newFriends];
        });
      }
    });

    return socket;
  }, [accessToken, dispatch]);

  // Connect when authenticated
  useEffect(() => {
    if (accessToken && !socketRef.current?.connected) {
      initializeSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken, initializeSocket]);

  // ========================================================================
  // Socket Actions
  // ========================================================================
  const sendMessage = useCallback((payload: SendMessagePayload) => {
    socketRef.current?.emit("send-message", payload);
  }, []);

  const sendDirectMessage = useCallback((receiverId: string, content: string, media?: string, mediaType?: string) => {
    // Use OBJECT payload format - most backends expect this
    // Include multiple field name variations for maximum compatibility
    const payload = {
      receiverId,
      content,          // Standard field name
      message: content, // Fallback field name for older backends
      media: media || null,
      // mediaUrl: media || null,    // Alternative field name
      // imageUrl: media || null,    // Another alternative
      mediaType: mediaType || null,
    };
    console.log("📤 Socket Emit send-message (OBJECT):", payload);
    socketRef.current?.emit("send-message", payload);
  }, []);

  const loadMessages = useCallback((payload: LoadMessagesPayload) => {
    socketRef.current?.emit("load-messages", payload);
  }, []);

  const loadContacts = useCallback(() => {
    socketRef.current?.emit("load-contacts");
  }, []);

  const getOnlineFriends = useCallback((cursor?: string, limit: number = 20) => {
    socketRef.current?.emit("get-online-friends", { cursor, limit });
  }, []);

  const sendGroupMessage = useCallback((payload: SendGroupMessagePayload) => {
    socketRef.current?.emit("send-group-message", payload);
  }, []);

  const loadGroupMessages = useCallback((payload: LoadGroupMessagesPayload) => {
    socketRef.current?.emit("load-group-messages", payload);
  }, []);

  const loadGroupParticipants = useCallback((communityId: string) => {
    socketRef.current?.emit("load-group-participants", { communityId });
  }, []);

  const notifyGroupCreated = useCallback((communityId: string) => {
    socketRef.current?.emit("group-created", { communityId });
  }, []);

  const notifyUserJoined = useCallback((communityId: string, participantId: string) => {
    socketRef.current?.emit("user-joined", { communityId, participantId });
  }, []);

  const notifyUserLeft = useCallback((communityId: string) => {
    socketRef.current?.emit("user-left", { communityId });
  }, []);

  const notifyUserRemoved = useCallback((communityId: string, participantId: string) => {
    socketRef.current?.emit("user-removed", { communityId, participantId });
  }, []);

  const value: SocketContextType = {
    socket: socketRef.current,
    isConnected,
    onlineFriends,
    sendMessage,
    sendDirectMessage,
    loadMessages,
    loadContacts,
    getOnlineFriends,
    sendGroupMessage,
    loadGroupMessages,
    loadGroupParticipants,
    notifyGroupCreated,
    notifyUserJoined,
    notifyUserLeft,
    notifyUserRemoved,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// ============================================================================
// useSocket Hook
// ============================================================================
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

export default SocketProvider;
