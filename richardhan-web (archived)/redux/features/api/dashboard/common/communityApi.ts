import { baseApi } from "../../baseApi";
import {
  ApiResponse,
  Story,
  MyStory,
  Post,
  PostDetail,
  Comment,
  StoriesResponse,
  MyStoriesResponse,
  PostsResponse,
  CommentsResponse,
  StoryActionResponse,
  PostActionResponse,
  CommentActionResponse,
  PostLikedByResponse,
  CommentDetail,
  GetPostsParams,
  GetStoriesParams,
  GetCommentsParams,
  StoryVisibilityPayload,
  EditCommentPayload,
  BookmarksResponse,
} from "@/types/dashboard/community";

// ============================================================================
// Community API - RTK Query Endpoints
// ============================================================================

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================================
    // STORY ENDPOINTS
    // ========================================================================

    // Get all stories with cursor pagination
    getStories: builder.query<ApiResponse<StoriesResponse>, GetStoriesParams>({
      query: ({ limit, cursor }) => ({
        url: "/story",
        method: "GET",
        params: { limit, cursor },
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Stories" as const,
                id,
              })),
              { type: "Stories", id: "LIST" },
            ]
          : [{ type: "Stories", id: "LIST" }],
    }),

    // Get my stories with cursor pagination
    getMyStories: builder.query<ApiResponse<MyStoriesResponse>, GetStoriesParams>({
      query: ({ limit, cursor }) => ({
        url: "/story/me",
        method: "GET",
        params: { limit, cursor },
      }),
      providesTags: [{ type: "Stories", id: "MY_STORIES" }],
    }),

    // Get saved posts (bookmarks)
    getSavedPosts: builder.query<ApiResponse<BookmarksResponse>, GetPostsParams>({
      query: ({ limit, cursor }) => ({
        url: "/bookmark",
        method: "GET",
        params: { limit, cursor, filter: "POST" },
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Posts" as const,
                id,
              })),
              { type: "Posts", id: "SAVED_LIST" },
            ]
          : [{ type: "Posts", id: "SAVED_LIST" }],
    }),

    // Create a new story
    createStory: builder.mutation<ApiResponse<MyStory>, FormData>({
      query: (formData) => ({
        url: "/story",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Stories", id: "LIST" },
        { type: "Stories", id: "MY_STORIES" },
      ],
    }),

    // Delete a story
    deleteStory: builder.mutation<ApiResponse<MyStory>, string>({
      query: (id) => ({
        url: `/story/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Stories", id: "LIST" },
        { type: "Stories", id: "MY_STORIES" },
      ],
    }),

    // Like/unlike a story
    likeStory: builder.mutation<ApiResponse<StoryActionResponse>, string>({
      query: (id) => ({
        url: `/story/like/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stories", id },
        { type: "Stories", id: "LIST" },
        { type: "Stories", id: "MY_STORIES" },
      ],
    }),

    // View a story (increment view count)
    viewStory: builder.mutation<ApiResponse<StoryActionResponse>, string>({
      query: (id) => ({
        url: `/story/view/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stories", id },
        { type: "Stories", id: "LIST" },
      ],
    }),

    // Reply to a story
    replyToStory: builder.mutation<
      ApiResponse<null>,
      { id: string; comment: string }
    >({
      query: ({ id, comment }) => ({
        url: `/story/reply/${id}`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Stories", id: "MY_STORIES" },
        { type: "Stories", id },
        { type: "Stories", id: "LIST" },
      ],
    }),

    // Change story visibility
    changeStoryVisibility: builder.mutation<
      ApiResponse<MyStory>,
      StoryVisibilityPayload
    >({
      query: ({ id, visibility }) => ({
        url: `/story/visibility/${id}`,
        method: "PATCH",
        body: { visibility },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Stories", id },
        { type: "Stories", id: "MY_STORIES" },
        { type: "Stories", id: "LIST" },
      ],
    }),

    // Toggle story published status
    toggleStoryPublished: builder.mutation<ApiResponse<MyStory>, string>({
      query: (id) => ({
        url: `/story/published/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stories", id },
        { type: "Stories", id: "MY_STORIES" },
        { type: "Stories", id: "LIST" },
      ],
    }),

    // ========================================================================
    // POST ENDPOINTS
    // ========================================================================

    // Get all posts with cursor pagination
    getPosts: builder.query<ApiResponse<PostsResponse>, GetPostsParams>({
      query: ({ limit, cursor }) => ({
        url: "/community/all",
        method: "GET",
        params: { limit, cursor },
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Posts" as const,
                id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    // Get a single post
    getPost: builder.query<ApiResponse<PostDetail>, string>({
      query: (postId) => ({
        url: `/community/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, postId) => [{ type: "Posts", id: postId }],
    }),

    // Create a new post
    createPost: builder.mutation<ApiResponse<{ media: string[] }>, FormData>({
      query: (formData) => ({
        url: "/community/create-post",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),

    // Edit a post
    editPost: builder.mutation<
      ApiResponse<Post>,
      { postId: string; formData: FormData }
    >({
      query: ({ postId, formData }) => ({
        url: `/community/edit-post/${postId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Posts", id: postId },
        { type: "Posts", id: "LIST" },
      ],
    }),

    // Delete a post
    deletePost: builder.mutation<ApiResponse<null>, string>({
      query: (postId) => ({
        url: `/community/delete-post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),

    // Toggle like on a post
    toggleLikePost: builder.mutation<ApiResponse<PostActionResponse>, string>({
      query: (postId) => ({
        url: `/community/toggle-like/${postId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Posts", id: postId },
        { type: "Posts", id: "LIST" },
      ],
    }),

    // Get users who liked a post
    getPostLikedBy: builder.query<ApiResponse<PostLikedByResponse>, string>({
      query: (postId) => ({
        url: `/community/${postId}/liked-by`,
        method: "GET",
      }),
      providesTags: (result, error, postId) => [{ type: "Posts", id: postId }],
    }),

    // Toggle bookmark on a post
    toggleBookmarkPost: builder.mutation<ApiResponse<{ bookmarked: boolean }>, string>({
      query: (postId) => ({
        url: `/bookmark/post/${postId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Posts" as const, id: postId },
        { type: "Posts" as const, id: "LIST" },
        { type: "Posts", id: "SAVED_LIST" }
      ],
    }),

    // Toggle hide content
    toggleHideContent: builder.mutation<ApiResponse<{ hidden: boolean }>, { id: string; contentType: "POST" | "REEL" }>({
      query: (body) => ({
        url: "/hide-content/toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Posts", id },
        { type: "Posts", id: "LIST" }
      ],
    }),

    // ========================================================================
    // COMMENT ENDPOINTS
    // ========================================================================

    // Get comments for a post with cursor pagination
    getComments: builder.query<ApiResponse<CommentsResponse>, GetCommentsParams>({
      query: ({ postId, limit, cursor }) => ({
        url: `/comments/post/${postId}`,
        method: "GET",
        params: { limit, cursor },
      }),
      providesTags: (result, error, { postId }) => [
        { type: "Comments" as const, id: postId },
        { type: "Comments" as const, id: "LIST" },
      ],
    }),

    // Add a comment to a post
    addComment: builder.mutation<
      ApiResponse<CommentDetail>,
      { postId: string; content: string }
    >({
      query: ({ postId, content }) => ({
        url: `/comments/post/${postId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: postId },
        { type: "Posts", id: postId },
      ],
    }),

    // Reply to a comment
    addReply: builder.mutation<
      ApiResponse<CommentDetail>,
      { commentId: string; content: string; postId?: string }
    >({
      query: ({ commentId, content }) => ({
        url: `/comments/comment/${commentId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: "LIST" },
        ...(postId ? [{ type: "Comments" as const, id: postId }, { type: "Posts" as const, id: postId }] : []),
      ],
    }),

    // Edit a comment
    editComment: builder.mutation<ApiResponse<CommentDetail>, EditCommentPayload & { postId?: string }>({
      query: ({ commentId, content }) => ({
        url: `/comments/comment/${commentId}/edit`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: "LIST" },
        ...(postId ? [{ type: "Comments" as const, id: postId }] : []),
      ],
    }),

    // Delete a comment
    deleteComment: builder.mutation<ApiResponse<null>, { commentId: string; postId?: string }>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: "LIST" },
        ...(postId ? [
          { type: "Comments" as const, id: postId },
          { type: "Posts" as const, id: postId },
        ] : []),
      ],
    }),

    // Like/unlike a comment
    likeComment: builder.mutation<
      ApiResponse<CommentActionResponse>, 
      { commentId: string; postId?: string }
    >({
      query: ({ commentId }) => ({
        url: `/comments/comment/${commentId}/like`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { commentId, postId }) => [
        { type: "Comments", id: "LIST" },
        ...(postId ? [{ type: "Comments" as const, id: postId }] : []),
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Story hooks
  useGetStoriesQuery,
  useGetMyStoriesQuery,
  useCreateStoryMutation,
  useDeleteStoryMutation,
  useLikeStoryMutation,
  useViewStoryMutation,
  useReplyToStoryMutation,
  useChangeStoryVisibilityMutation,
  useToggleStoryPublishedMutation,
  // Post hooks
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useToggleLikePostMutation,
  useGetPostLikedByQuery,
  useGetSavedPostsQuery,
  useToggleBookmarkPostMutation,
  useToggleHideContentMutation,
  // Comment hooks
  useGetCommentsQuery,
  useAddCommentMutation,
  useAddReplyMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = communityApi;
