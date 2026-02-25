import { baseApi } from "../../baseApi";
import {
  FriendshipApiResponse,
  FriendsListResponse,
  FriendSuggestionsResponse,
  PendingRequestsResponse,
  GetFriendsParams,
  GetSuggestionsParams,
  GetPendingRequestsParams,
  MutualFriend,
  FriendProfile,
} from "@/types/dashboard/friendship";

// ============================================================================
// Friendship API - RTK Query Endpoints
// ============================================================================

export const friendshipApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================================
    // FRIENDS LIST
    // ========================================================================

    // Get all friends with cursor pagination and optional search
    getFriends: builder.query<
      FriendshipApiResponse<FriendsListResponse>,
      GetFriendsParams
    >({
      query: ({ limit = 20, cursor, search }) => ({
        url: "/friendship/friends",
        method: "GET",
        params: { limit, cursor, search },
      }),
      providesTags: (result) =>
        result?.data?.friends
          ? [
              ...result.data.friends.map(({ userId }) => ({
                type: "Friends" as const,
                id: userId,
              })),
              { type: "Friends", id: "LIST" },
            ]
          : [{ type: "Friends", id: "LIST" }],
    }),

    // ========================================================================
    // FRIEND SUGGESTIONS
    // ========================================================================

    // Get suggested friends with pagination
    getFriendSuggestions: builder.query<
      FriendshipApiResponse<FriendSuggestionsResponse>,
      GetSuggestionsParams
    >({
      query: ({ limit = 20, cursor, search }) => ({
        url: "/friendship/suggestions",
        method: "GET",
        params: { limit, cursor, search },
      }),
      providesTags: [{ type: "FriendSuggestions", id: "LIST" }],
    }),

    // ========================================================================
    // FRIEND REQUESTS
    // ========================================================================

    // Get pending friend requests
    getPendingRequests: builder.query<
      FriendshipApiResponse<PendingRequestsResponse>,
      GetPendingRequestsParams
    >({
      query: ({ limit = 20, cursor, search }) => ({
        url: "/friendship/requests/pending",
        method: "GET",
        params: { limit, cursor, search },
      }),
      providesTags: (result) =>
        result?.data?.requests
          ? [
              ...result.data.requests.map(({ id }) => ({
                type: "FriendRequests" as const,
                id,
              })),
              { type: "FriendRequests", id: "LIST" },
            ]
          : [{ type: "FriendRequests", id: "LIST" }],
    }),

    // Send a friend request
    sendFriendRequest: builder.mutation<
      FriendshipApiResponse<null>,
      string
    >({
      query: (userId) => ({
        url: `/friendship/request/send/${userId}`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "FriendSuggestions", id: "LIST" },
        { type: "FriendRequests", id: "LIST" },
      ],
    }),

    // Accept a friend request
    acceptFriendRequest: builder.mutation<
      FriendshipApiResponse<null>,
      string
    >({
      query: (requestId) => ({
        url: `/friendship/request/accept/${requestId}`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Friends", id: "LIST" },
        { type: "FriendRequests", id: "LIST" },
      ],
    }),

    // Reject a friend request
    rejectFriendRequest: builder.mutation<
      FriendshipApiResponse<null>,
      string
    >({
      query: (requestId) => ({
        url: `/friendship/request/reject/${requestId}`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "FriendRequests", id: "LIST" }],
    }),

    // ========================================================================
    // FRIEND MANAGEMENT
    // ========================================================================

    // Unfriend a user
    unfriend: builder.mutation<FriendshipApiResponse<null>, string>({
      query: (userId) => ({
        url: `/friendship/unfriend/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "Friends", id: userId },
        { type: "Friends", id: "LIST" },
      ],
    }),

    // Get a friend's profile
    getFriendProfile: builder.query<
      FriendshipApiResponse<FriendProfile>,
      string
    >({
      query: (userId) => ({
        url: `/friendship/profile/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "Friends", id: userId },
      ],
    }),

    // Get mutual friends with another user
    getMutualFriends: builder.query<MutualFriend[], string>({
      query: (userId) => ({
        url: `/friendship/mutual/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "Friends", id: `mutual-${userId}` },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetFriendsQuery,
  useGetFriendSuggestionsQuery,
  useGetPendingRequestsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useUnfriendMutation,
  useGetFriendProfileQuery,
  useGetMutualFriendsQuery,
} = friendshipApi;
