import { baseApi } from "../../baseApi";
import {
  FriendshipApiResponse,
  BlockedUsersResponse,
  MutedUsersResponse,
  BlockedUser,
  MutedUser,
  GetBlockedMutedParams,
} from "@/types/dashboard/friendship";

// ============================================================================
// User Block & Mute API - RTK Query Endpoints
// ============================================================================

export const userBlockMuteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================================
    // BLOCK MANAGEMENT
    // ========================================================================

    // Block a user
    blockUser: builder.mutation<
      FriendshipApiResponse<{ result: BlockedUser }>,
      string
    >({
      query: (userId) => ({
        url: `/user-block/block/${userId}`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "BlockedUsers", id: "LIST" },
        { type: "Friends", id: "LIST" },
        { type: "Conversations", id: "LIST" },
      ],
    }),

    // Unblock a user
    unblockUser: builder.mutation<
      FriendshipApiResponse<{ result: BlockedUser }>,
      string
    >({
      query: (userId) => ({
        url: `/user-block/unblock/${userId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "BlockedUsers", id: "LIST" }],
    }),

    // Get blocked users
    getBlockedUsers: builder.query<
      FriendshipApiResponse<BlockedUsersResponse>,
      GetBlockedMutedParams
    >({
      query: ({ cursor, limit }) => ({
        url: "/user-block/my-blocked-users",
        method: "GET",
        params: { cursor, limit },
      }),
      providesTags: (result) =>
        result?.data?.result
          ? [
              ...result.data.result.map(({ id }) => ({
                type: "BlockedUsers" as const,
                id,
              })),
              { type: "BlockedUsers", id: "LIST" },
            ]
          : [{ type: "BlockedUsers", id: "LIST" }],
    }),

    // ========================================================================
    // MUTE MANAGEMENT
    // ========================================================================

    // Mute a user
    muteUser: builder.mutation<FriendshipApiResponse<null>, string>({
      query: (userId) => ({
        url: `/user-mute/mute/${userId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MutedUsers", id: "LIST" }],
    }),

    // Unmute a user
    unmuteUser: builder.mutation<FriendshipApiResponse<null>, string>({
      query: (userId) => ({
        url: `/user-mute/unmute/${userId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "MutedUsers", id: "LIST" }],
    }),

    // Get muted users
    getMutedUsers: builder.query<
      FriendshipApiResponse<MutedUsersResponse>,
      GetBlockedMutedParams
    >({
      query: ({ cursor, limit }) => ({
        url: "/user-mute",
        method: "GET",
        params: { cursor, limit },
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ id }) => ({
                type: "MutedUsers" as const,
                id,
              })),
              { type: "MutedUsers", id: "LIST" },
            ]
          : [{ type: "MutedUsers", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetBlockedUsersQuery,
  useMuteUserMutation,
  useUnmuteUserMutation,
  useGetMutedUsersQuery,
} = userBlockMuteApi;
