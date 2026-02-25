import { baseApi } from "../../baseApi";
import {
  ChatApiResponse,
  Conversation,
  ConversationMessagesResponse,
  FileUploadResponse,
} from "@/types/dashboard/chat";

// ============================================================================
// One-to-One Chat API - RTK Query Endpoints
// ============================================================================

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================================
    // CONVERSATIONS
    // ========================================================================

    // Fetch all one-to-one conversations
    getMyConversations: builder.query<Conversation[], void>({
      query: () => ({
        url: "/chat/one-to-one/my-conversations",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((conv) => ({
                type: "Conversations" as const,
                id: conv.conversationId || conv.otherUser.id,
              })),
              { type: "Conversations", id: "LIST" },
            ]
          : [{ type: "Conversations", id: "LIST" }],
    }),

    // Fetch message history with a specific user
    getConversation: builder.query<
      ChatApiResponse<ConversationMessagesResponse>,
      { otherUserId: string; cursor?: string; limit?: number }
    >({
      query: ({ otherUserId, cursor, limit = 50 }) => ({
        url: `/chat/one-to-one/conversation/${otherUserId}`,
        method: "GET",
        params: { cursor, limit },
      }),
      providesTags: (result, error, { otherUserId }) => [
        { type: "Conversations", id: otherUserId },
      ],
    }),

    // ========================================================================
    // FILE UPLOAD
    // ========================================================================

    // Upload file for chat
    uploadChatFile: builder.mutation<
      ChatApiResponse<FileUploadResponse>,
      FormData
    >({
      query: (formData) => ({
        url: "/chat/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMyConversationsQuery,
  useGetConversationQuery,
  useLazyGetConversationQuery,
  useUploadChatFileMutation,
} = chatApi;
