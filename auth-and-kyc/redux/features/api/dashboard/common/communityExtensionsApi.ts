import { baseApi } from "@/redux/features/api/baseApi";

export const communityExtensionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Moments
    getMyMoments: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({ url: "/moments/my-moments", params }),
      providesTags: ["Stories"],
    }),
    getMomentsByUser: builder.query<any, string>({
      query: (userId) => `/moments/user/${userId}`,
      providesTags: ["Stories"],
    }),
    hideMoment: builder.mutation<any, string>({
      query: (momentId) => ({
        url: `/moments/hide/${momentId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Stories"],
    }),
    deleteMoment: builder.mutation<any, string>({
      query: (momentId) => ({ url: `/moments/${momentId}`, method: "DELETE" }),
      invalidatesTags: ["Stories"],
    }),

    // Reels
    createReel: builder.mutation<any, any>({
      query: (data) => ({ url: "/reel", method: "POST", body: data }),
      invalidatesTags: ["Posts"], // Assuming Reels share a stream-like cache with posts
    }),
    getAllReels: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({ url: "/reel", params }),
      providesTags: ["Posts"],
    }),
    updateReel: builder.mutation<any, { reelId: string; data: any }>({
      query: ({ reelId, data }) => ({
        url: `/reel/${reelId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),
    deleteReel: builder.mutation<any, string>({
      query: (reelId) => ({ url: `/reel/${reelId}`, method: "DELETE" }),
      invalidatesTags: ["Posts"],
    }),
    likeReel: builder.mutation<any, string>({
      query: (reelId) => ({ url: `/reel/${reelId}/like`, method: "PATCH" }),
      invalidatesTags: ["Posts"],
    }),
    commentOnReel: builder.mutation<any, { reelId: string; data: any }>({
      query: ({ reelId, data }) => ({
        url: `/reel/${reelId}/comment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),
    getReelComments: builder.query<any, string>({
      query: (reelId) => `/reel/${reelId}/comments`,
      providesTags: ["Comments"],
    }),

    // Comments & Bookmarks
    editComment: builder.mutation<any, { commentId: string; data: any }>({
      query: ({ commentId, data }) => ({
        url: `/comments/comment/${commentId}/edit`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Comments"],
    }),
    likeComment: builder.mutation<any, string>({
      query: (commentId) => ({
        url: `/comments/comment/${commentId}/like`,
        method: "PATCH",
      }),
      invalidatesTags: ["Comments"],
    }),
    bookmarkReel: builder.mutation<any, string>({
      query: (reelId) => ({ url: `/bookmark/reel/${reelId}`, method: "PATCH" }),
    }),

    // Chat Management
    changeChatOwner: builder.mutation<
      any,
      { communityId: string; newOwnerId: string }
    >({
      query: ({ communityId, newOwnerId }) => ({
        url: `/chat/change-owner/${communityId}`,
        method: "PATCH",
        body: { newOwnerId },
      }),
    }),
    addChatPeople: builder.mutation<
      any,
      { communityId: string; userIds: string[] }
    >({
      query: ({ communityId, userIds }) => ({
        url: `/chat/community/${communityId}/add-people`,
        method: "PATCH",
        body: { userIds },
      }),
    }),
    removeChatPeople: builder.mutation<
      any,
      { communityId: string; userIds: string[] }
    >({
      query: ({ communityId, userIds }) => ({
        url: `/chat/community/${communityId}/remove-people`,
        method: "PATCH",
        body: { userIds },
      }),
    }),
    leaveChat: builder.mutation<any, string>({
      query: (communityId) => ({
        url: `/chat/community/${communityId}/leave`,
        method: "PATCH",
      }),
    }),
    updateChatDetails: builder.mutation<
      any,
      { communityId: string; data: any }
    >({
      query: ({ communityId, data }) => ({
        url: `/chat/community/${communityId}/details`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateChatImage: builder.mutation<any, { communityId: string; image: any }>(
      {
        query: ({ communityId, image }) => ({
          url: `/chat/community/${communityId}/image`,
          method: "PATCH",
          body: image,
        }),
      },
    ),
    getChatMessages: builder.query<
      any,
      { communityId: string; page?: number; limit?: number }
    >({
      query: ({ communityId, ...params }) => ({
        url: `/chat/community/${communityId}/message`,
        params,
      }),
    }),
    getChatParticipants: builder.query<any, string>({
      query: (communityId) => `/chat/community/${communityId}/participants`,
    }),
  }),
});

export const {
  useGetMyMomentsQuery,
  useGetMomentsByUserQuery,
  useHideMomentMutation,
  useDeleteMomentMutation,
  useCreateReelMutation,
  useGetAllReelsQuery,
  useUpdateReelMutation,
  useDeleteReelMutation,
  useLikeReelMutation,
  useCommentOnReelMutation,
  useGetReelCommentsQuery,
  useEditCommentMutation,
  useLikeCommentMutation,
  useBookmarkReelMutation,
  useChangeChatOwnerMutation,
  useAddChatPeopleMutation,
  useRemoveChatPeopleMutation,
  useLeaveChatMutation,
  useUpdateChatDetailsMutation,
  useUpdateChatImageMutation,
  useGetChatMessagesQuery,
  useGetChatParticipantsQuery,
} = communityExtensionsApi;
