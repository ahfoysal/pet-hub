// ============================================================================
// Friendship Types
// ============================================================================

import { ChatUser } from '../chat';

// ============================================================================
// Friend Types
// ============================================================================

export interface Friend {
  userId: string;
  fullName: string;
  email: string;
  image: string | null;
  isOnline?: boolean;
}

export interface FriendProfile {
  userId: string;
  fullName: string;
  email: string;
  image: string | null;
  role?: string;
  mutualFriends: MutualFriend[];
}

export interface MutualFriend {
  userId: string;
  fullName: string;
  image: string | null;
  status?: string;
}

export interface FriendSuggestion {
  userId: string;
  fullName: string;
  userName?: string;
  email?: string;
  image: string | null;
  mutualFriendsCount?: number;
}

// ============================================================================
// Friend Request Types
// ============================================================================

export interface PendingFriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderImage: string | null;
  createdAt: string;
}

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// ============================================================================
// API Response Types
// ============================================================================

export interface FriendshipApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface FriendsListResponse {
  limit: number;
  hasNext: boolean;
  friendCount: number;
  cursor: string | null;
  friends: Friend[];
}

export interface FriendSuggestionsResponse {
  limit: number;
  hasNext: boolean;
  cursor: string | null;
  users: FriendSuggestion[];
}

export interface PendingRequestsResponse {
  limit: number;
  hasNext: boolean;
  totalPendingRequests: number;
  requests: PendingFriendRequest[];
  cursor: string | null;
}

// ============================================================================
// Query Parameter Types
// ============================================================================

export interface GetFriendsParams {
  limit?: number;
  cursor?: string;
  search?: string;
}

export interface GetSuggestionsParams {
  limit?: number;
  cursor?: string;
  search?: string;
}

export interface GetPendingRequestsParams {
  limit?: number;
  cursor?: string;
  search?: string;
}

// ============================================================================
// Blocked/Muted User Types
// ============================================================================

export interface BlockedUser {
  id: string;
  fullName: string;
  email?: string;
  image: string | null;
}

export interface MutedUser {
  id: string;
  fullName: string;
  image: string | null;
}

export interface BlockedUsersResponse {
  result: BlockedUser[];
  nextCursor: string | null;
}

export interface MutedUsersResponse {
  data: MutedUser[];
  nextCursor: string | null;
}

export interface GetBlockedMutedParams {
  cursor?: string;
  limit?: number;
}
