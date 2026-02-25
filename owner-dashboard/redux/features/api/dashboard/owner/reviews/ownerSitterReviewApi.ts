import { baseApi } from "@/redux/features/api/baseApi";

export const ownerSitterReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubmittedSitterReviews: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/pet-sitter-reviews/submitted",
        params,
      }),
      providesTags: ["Sitter"],
    }),
    submitSitterReview: builder.mutation<
      any,
      { petSitterId: string; data: any }
    >({
      query: ({ petSitterId, data }) => ({
        url: `/pet-sitter-reviews/${petSitterId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sitter"],
    }),
    updateSitterReview: builder.mutation<any, { reviewId: string; data: any }>({
      query: ({ reviewId, data }) => ({
        url: `/pet-sitter-reviews/${reviewId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Sitter"],
    }),
    deleteSitterReview: builder.mutation<any, string>({
      query: (reviewId) => ({
        url: `/pet-sitter-reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sitter"],
    }),

    // Package Reviews
    getSubmittedPackageReviews: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/pet-sitter-package-review/submitted",
        params,
      }),
      providesTags: ["Sitter", "Products"],
    }),
    submitPackageReview: builder.mutation<
      any,
      { packageId: string; data: any }
    >({
      query: ({ packageId, data }) => ({
        url: `/pet-sitter-package-review/${packageId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Sitter", "Products"],
    }),
    updatePackageReview: builder.mutation<any, { reviewId: string; data: any }>(
      {
        query: ({ reviewId, data }) => ({
          url: `/pet-sitter-package-review/${reviewId}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Sitter", "Products"],
      },
    ),
    deletePackageReview: builder.mutation<any, string>({
      query: (reviewId) => ({
        url: `/pet-sitter-package-review/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sitter", "Products"],
    }),
  }),
});

export const {
  useGetSubmittedSitterReviewsQuery,
  useSubmitSitterReviewMutation,
  useUpdateSitterReviewMutation,
  useDeleteSitterReviewMutation,
  useGetSubmittedPackageReviewsQuery,
  useSubmitPackageReviewMutation,
  useUpdatePackageReviewMutation,
  useDeletePackageReviewMutation,
} = ownerSitterReviewApi;
