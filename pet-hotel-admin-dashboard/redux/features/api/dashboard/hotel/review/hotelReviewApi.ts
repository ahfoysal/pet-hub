import { baseApi } from "@/redux/features/api/baseApi";

export const hotelReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewStats: builder.query<any, void>({
      query: () => ({
        url: "/pet-hotel/review/stats",
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    getHotelReviews: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/pet-hotel/review?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    respondToReview: builder.mutation<any, { id: string; reply: string }>({
      query: ({ id, reply }) => ({
        url: `/pet-hotel/review/${id}/reply`,
        method: "PATCH",
        body: { reply },
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetReviewStatsQuery,
  useGetHotelReviewsQuery,
  useRespondToReviewMutation,
} = hotelReviewApi;
