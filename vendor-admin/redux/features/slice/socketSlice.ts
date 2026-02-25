import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, CommunityMessage, ContactUpdate, ChatUser } from "@/types/dashboard/chat";

// ============================================================================
// Socket State Interface
// ============================================================================
interface SocketState {
  isConnected: boolean;
  userId: string | null;
  joinedCommunities: string[];
  onlineUsers: Record<string, boolean>;
  // Chat state
  activeConversationId: string | null;
  activeCommunityId: string | null;
  // Messages cache for optimistic updates
  directMessages: Record<string, Message[]>;
  communityMessages: Record<string, CommunityMessage[]>;
  // Contact updates
  contacts: ContactUpdate[];
  // Typing indicators
  typingUsers: Record<string, string[]>; // conversationId -> userIds
  // Unread counts
  unreadCounts: Record<string, number>;
}

const initialState: SocketState = {
  isConnected: false,
  userId: null,
  joinedCommunities: [],
  onlineUsers: {},
  activeConversationId: null,
  activeCommunityId: null,
  directMessages: {},
  communityMessages: {},
  contacts: [],
  typingUsers: {},
  unreadCounts: {},
};

// ============================================================================
// Socket Slice
// ============================================================================
const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    // Connection state
    setConnected: (
      state,
      action: PayloadAction<{ userId: string; communities: string[] }>
    ) => {
      state.isConnected = true;
      state.userId = action.payload.userId;
      state.joinedCommunities = action.payload.communities;
    },

    setDisconnected: (state) => {
      state.isConnected = false;
    },

    // Online status
    setUserOnline: (state, action: PayloadAction<string>) => {
      state.onlineUsers[action.payload] = true;
    },

    setUserOffline: (state, action: PayloadAction<string>) => {
      state.onlineUsers[action.payload] = false;
    },

    setOnlineUsers: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.onlineUsers = action.payload;
    },

    // Active conversation/community
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      if (action.payload && state.unreadCounts[action.payload]) {
        state.unreadCounts[action.payload] = 0;
      }
    },

    setActiveCommunity: (state, action: PayloadAction<string | null>) => {
      state.activeCommunityId = action.payload;
      if (action.payload && state.unreadCounts[`community-${action.payload}`]) {
        state.unreadCounts[`community-${action.payload}`] = 0;
      }
    },

    // Direct messages
    addDirectMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const { conversationId, message } = action.payload;
      if (!state.directMessages[conversationId]) {
        state.directMessages[conversationId] = [];
      }
      
      // Check for exact ID duplicate
      const existsByExactId = state.directMessages[conversationId].some(
        (m) => m.id === message.id
      );
      if (existsByExactId) {
        return; // Already exists, skip
      }
      
      // Check if this real message replaces an optimistic temp message
      // Match by content + sender within 5 seconds
      if (!message.id.startsWith("temp-")) {
        const tempIndex = state.directMessages[conversationId].findIndex((m) => {
          if (!m.id.startsWith("temp-")) return false;
          const sameContent = (m.content || m.message) === (message.content || message.message);
          const sameSender = m.senderId === message.senderId;
          const timeDiff = Math.abs(
            new Date(m.createdAt || 0).getTime() - new Date(message.createdAt || 0).getTime()
          );
          return sameContent && sameSender && timeDiff < 5000;
        });
        
        if (tempIndex !== -1) {
          // Replace temp message with real one
          state.directMessages[conversationId][tempIndex] = message;
          return;
        }
      }
      
      state.directMessages[conversationId].push(message);
      
      // Update unread if not active conversation AND not self
      if (state.activeConversationId !== conversationId && message.senderId !== state.userId) {
        state.unreadCounts[conversationId] =
          (state.unreadCounts[conversationId] || 0) + 1;
      }
    },

    setDirectMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>
    ) => {
      const { conversationId, messages } = action.payload;
      state.directMessages[conversationId] = messages;
    },

    prependDirectMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>
    ) => {
      const { conversationId, messages } = action.payload;
      if (!state.directMessages[conversationId]) {
        state.directMessages[conversationId] = [];
      }
      state.directMessages[conversationId] = [
        ...messages,
        ...state.directMessages[conversationId],
      ];
    },

    // Community messages
    addCommunityMessage: (
      state,
      action: PayloadAction<{ communityId: string; message: CommunityMessage }>
    ) => {
      const { communityId, message } = action.payload;
      if (!state.communityMessages[communityId]) {
        state.communityMessages[communityId] = [];
      }
      // Avoid duplicates
      const exists = state.communityMessages[communityId].some(
        (m) => m.id === message.id
      );
      if (!exists) {
        state.communityMessages[communityId].push(message);
      }
      // Update unread if not active community AND not self
      if (state.activeCommunityId !== communityId && message.senderId !== state.userId) {
        const key = `community-${communityId}`;
        state.unreadCounts[key] = (state.unreadCounts[key] || 0) + 1;
      }
    },

    setCommunityMessages: (
      state,
      action: PayloadAction<{ communityId: string; messages: CommunityMessage[] }>
    ) => {
      const { communityId, messages } = action.payload;
      state.communityMessages[communityId] = messages;
    },

    prependCommunityMessages: (
      state,
      action: PayloadAction<{ communityId: string; messages: CommunityMessage[] }>
    ) => {
      const { communityId, messages } = action.payload;
      if (!state.communityMessages[communityId]) {
        state.communityMessages[communityId] = [];
      }
      state.communityMessages[communityId] = [
        ...messages,
        ...state.communityMessages[communityId],
      ];
    },

    // Contacts
    updateContacts: (state, action: PayloadAction<ContactUpdate[]>) => {
      state.contacts = action.payload;
    },

    // Join/Leave community
    joinCommunity: (state, action: PayloadAction<string>) => {
      if (!state.joinedCommunities.includes(action.payload)) {
        state.joinedCommunities.push(action.payload);
      }
    },

    leaveCommunity: (state, action: PayloadAction<string>) => {
      state.joinedCommunities = state.joinedCommunities.filter(
        (id) => id !== action.payload
      );
      delete state.communityMessages[action.payload];
    },

    // Reset state
    resetSocketState: () => initialState,
  },
});

export const {
  setConnected,
  setDisconnected,
  setUserOnline,
  setUserOffline,
  setOnlineUsers,
  setActiveConversation,
  setActiveCommunity,
  addDirectMessage,
  setDirectMessages,
  prependDirectMessages,
  addCommunityMessage,
  setCommunityMessages,
  prependCommunityMessages,
  updateContacts,
  joinCommunity,
  leaveCommunity,
  resetSocketState,
} = socketSlice.actions;

// Selectors
export const selectTotalUnreadCount = (state: { socket: SocketState }) => {
  return Object.values(state.socket.unreadCounts).reduce((acc, count) => acc + count, 0);
};

export default socketSlice.reducer;
