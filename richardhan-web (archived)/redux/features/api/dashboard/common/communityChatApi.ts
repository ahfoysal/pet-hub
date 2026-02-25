import { baseApi } from "../../baseApi";
import {
  ChatApiResponse,
  Community,
  CommunityDetail,
  CommunityMessagesResponse,
  CommunityParticipant,
  CreateCommunityPayload,
  UpdateCommunityDetailsPayload,
  AddRemovePeoplePayload,
} from "@/types/dashboard/chat";

// ============================================================================
// Community/Group Chat API - RTK Query Endpoints
// ============================================================================

export const communityChatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================================
    // COMMUNITY MANAGEMENT
    // ========================================================================

    // Fetch communities joined by the current user
    getMyCommunities: builder.query<ChatApiResponse<Community[]>, void>({
      query: () => ({
        url: "/chat/community/me",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "CommunityChat" as const,
                id,
              })),
              { type: "CommunityChat", id: "LIST" },
            ]
          : [{ type: "CommunityChat", id: "LIST" }],
    }),

    // Create a new community chat
    createCommunity: builder.mutation<Community, FormData>({
      query: (formData) => ({
        url: "/chat/community",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "CommunityChat", id: "LIST" }],
    }),

    // Get community details
    getCommunityDetails: builder.query<
      ChatApiResponse<CommunityDetail>,
      string
    >({
      query: (communityId) => ({
        url: `/chat/community/${communityId}`,
        method: "GET",
      }),
      providesTags: (result, error, communityId) => [
        { type: "CommunityChat", id: communityId },
      ],
    }),

    // ========================================================================
    // COMMUNITY MESSAGES
    // ========================================================================

    // Get community messages
    getCommunityMessages: builder.query<
      ChatApiResponse<CommunityMessagesResponse>,
      { communityId: string; cursor?: string; limit?: number }
    >({
      query: ({ communityId, cursor, limit = 50 }) => ({
        url: `/chat/community/${communityId}/message`,
        method: "GET",
        params: { cursor, limit },
      }),
      providesTags: (result, error, { communityId }) => [
        { type: "CommunityChat", id: `messages-${communityId}` },
      ],
    }),

    // ========================================================================
    // PARTICIPANTS MANAGEMENT
    // ========================================================================

    // Get participants from community
    getCommunityParticipants: builder.query<
      ChatApiResponse<CommunityParticipant[]>,
      string
    >({
      query: (communityId) => ({
        url: `/chat/community/${communityId}/participants`,
        method: "GET",
      }),
      providesTags: (result, error, communityId) => [
        { type: "CommunityParticipants", id: communityId },
      ],
    }),

    // Add people to group
    addPeopleToCommunity: builder.mutation<
      ChatApiResponse<{ communityId: string; participants: CommunityParticipant[] }>,
      AddRemovePeoplePayload
    >({
      query: ({ communityId, participantIds }) => ({
        url: `/chat/community/${communityId}/add-people`,
        method: "PATCH",
        body: { participantIds },
      }),
      invalidatesTags: (result, error, { communityId }) => [
        { type: "CommunityParticipants", id: communityId },
        { type: "CommunityChat", id: communityId },
      ],
    }),

    // Remove person from group
    removePeopleFromCommunity: builder.mutation<
      ChatApiResponse<{ communityId: string; removedUserId: string }>,
      AddRemovePeoplePayload
    >({
      query: ({ communityId, participantId }) => ({
        url: `/chat/community/${communityId}/remove-people`,
        method: "PATCH",
        body: { participantId },
      }),
      invalidatesTags: (result, error, { communityId }) => [
        { type: "CommunityParticipants", id: communityId },
        { type: "CommunityChat", id: communityId },
      ],
    }),

    // ========================================================================
    // COMMUNITY SETTINGS
    // ========================================================================

    // Update group details
    updateCommunityDetails: builder.mutation<
      ChatApiResponse<Community>,
      UpdateCommunityDetailsPayload
    >({
      query: ({ communityId, name, description }) => ({
        url: `/chat/community/${communityId}/details`,
        method: "PATCH",
        body: { name, description },
      }),
      invalidatesTags: (result, error, { communityId }) => [
        { type: "CommunityChat", id: communityId },
        { type: "CommunityChat", id: "LIST" },
      ],
    }),

    // Update group image
    updateCommunityImage: builder.mutation<
      ChatApiResponse<{ id: string; image: string }>,
      { communityId: string; formData: FormData }
    >({
      query: ({ communityId, formData }) => ({
        url: `/chat/community/${communityId}/image`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { communityId }) => [
        { type: "CommunityChat", id: communityId },
        { type: "CommunityChat", id: "LIST" },
      ],
    }),

    // Leave group
    leaveCommunity: builder.mutation<
      ChatApiResponse<{ communityId: string; newOwnerId?: string }>,
      string
    >({
      query: (communityId) => ({
        url: `/chat/community/${communityId}/leave`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, communityId) => [
        { type: "CommunityChat", id: communityId },
        { type: "CommunityChat", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMyCommunitiesQuery,
  useCreateCommunityMutation,
  useGetCommunityDetailsQuery,
  useGetCommunityMessagesQuery,
  useLazyGetCommunityMessagesQuery,
  useGetCommunityParticipantsQuery,
  useAddPeopleToCommunityMutation,
  useRemovePeopleFromCommunityMutation,
  useUpdateCommunityDetailsMutation,
  useUpdateCommunityImageMutation,
  useLeaveCommunityMutation,
} = communityChatApi;
