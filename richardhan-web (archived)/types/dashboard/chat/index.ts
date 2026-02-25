// ============================================================================
// Chat & Community Types
// ============================================================================

// Base user type for chat contexts
export interface ChatUser {
  id: string;
  fullName: string;
  email?: string;
  image: string | null;
  role?: string;
  isOnline?: boolean;
}

// ============================================================================
// One-to-One Chat Types
// ============================================================================

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  message: string;
  content?: string;
  media?: string | null;
  mediaType?: 'image' | 'video' | 'file' | null;
  createdAt: string;
  timestamp?: string;
  sender?: ChatUser;
}

export interface Conversation {
  conversationId: string;
  conversationUserId?: string; // Some endpoints might use this
  otherUser: ChatUser;
  lastMessage: {
    content: string;
    media?: string | null;
    mediaType?: string | null;
    sentAt: string;
    sender: ChatUser;
  } | null;
  unreadCount?: number;
}

export interface ConversationMessagesResponse {
  data: Message[];
  nextCursor: string | null;
}

// ============================================================================
// Community/Group Chat Types
// ============================================================================

export interface Community {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  creatorId: string;
  lastMessageId: string | null;
  lastMessageAt: string | null;
  isDeleted: boolean;
  createdAt: string;
  lastMessage?: CommunityMessage | null;
}

export interface CommunityDetail extends Community {
  creator: ChatUser;
  participants: ChatUser[];
}

export interface CommunityMessage {
  id: string;
  senderId: string;
  communityTopicId?: string;
  communityId?: string;
  message: string;
  content?: string;
  media?: string | null;
  mediaType?: 'image' | 'video' | 'file' | null;
  createdAt: string;
  sender: ChatUser;
}

export interface CommunityParticipant {
  id: string;
  fullName: string;
  image: string | null;
}

export interface CommunityMessagesResponse {
  data: CommunityMessage[];
  nextCursor: string | null;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ChatApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface FileUploadResponse {
  url: string;
  format: string;
}

export interface CreateCommunityPayload {
  name: string;
  description?: string;
  participantIds: string[];
  file?: File;
}

export interface UpdateCommunityDetailsPayload {
  communityId: string;
  name?: string;
  description?: string;
}

export interface AddRemovePeoplePayload {
  communityId: string;
  participantIds?: string[];
  participantId?: string;
}

// ============================================================================
// WebSocket Event Types
// ============================================================================

export interface SocketConnectedPayload {
  message: string;
  userId: string;
  communities: string[];
}

export interface SendMessagePayload {
  receiverId: string;
  message: string;
  media?: string;
  mediaType?: string;
}

export interface SendGroupMessagePayload {
  communityId: string;
  message: string;
  media?: string;
  mediaType?: string;
}

export interface LoadMessagesPayload {
  conversationUserId: string;
  cursor?: string;
  limit?: number;
}

export interface LoadGroupMessagesPayload {
  communityId: string;
  cursor?: string;
  limit?: number;
}

export interface ContactUpdate {
  conversationUserId: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}

export interface UserJoinedLeftPayload {
  communityId: string;
  user: ChatUser;
  message: string;
  messageId: string;
}

// Socket event names
export type SocketEvent =
  | 'connected'
  | 'send-message'
  | 'new-message'
  | 'receive-message'
  | 'contacts-updated'
  | 'load-contacts'
  | 'load-messages'
  | 'messages-loaded'
  | 'group-created'
  | 'user-joined'
  | 'user-left'
  | 'user-removed'
  | 'new-group'
  | 'send-group-message'
  | 'new-group-message'
  | 'load-group-messages'
  | 'group-messages-loaded'
  | 'load-group-participants'
  | 'group-participants-updated';
