import { baseApi } from "../../../baseApi";

export const vendorReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorReviews: builder.query<any, void>({
      query: () => "/product-review/vendor/all",
      providesTags: ["Reviews"],
    }),
    getVendorReviewStats: builder.query<any, void>({
      query: () => "/product-review/vendor/stats",
      providesTags: ["ReviewStats"],
    }),
    replyToReview: builder.mutation<any, { reviewId: string; reply: string }>({
      query: ({ reviewId, reply }) => ({
        url: `/product-review/reply/${reviewId}`,
        method: "POST",
        body: { reply },
      }),
      invalidatesTags: ["Reviews", "ReviewStats"],
    }),
    flagReview: builder.mutation<any, { reviewId: string; reason: string }>({
      query: ({ reviewId, reason }) => ({
        url: `/product-review/flag/${reviewId}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Reviews", "ReviewStats"],
    }),
  }),
});

export const {
  useGetVendorReviewsQuery,
  useGetVendorReviewStatsQuery,
  useReplyToReviewMutation,
  useFlagReviewMutation,
} = vendorReviewApi;
