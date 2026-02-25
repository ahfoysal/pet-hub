import { baseApi } from "@/redux/features/api/baseApi";

export const ownerServiceReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubmittedServiceReviews: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/service-review/submitted",
        params,
      }),
      providesTags: ["Vendor"],
    }),
    submitServiceReview: builder.mutation<
      any,
      { serviceId: string; data: any }
    >({
      query: ({ serviceId, data }) => ({
        url: `/service-review/${serviceId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vendor"],
    }),
    deleteServiceReview: builder.mutation<any, string>({
      query: (reviewId) => ({
        url: `/service-review/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vendor"],
    }),

    // Product Review (Single Endpoint)
    submitProductReview: builder.mutation<
      any,
      { productId: string; data: any }
    >({
      query: ({ productId, data }) => ({
        url: `/product-review/${productId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetSubmittedServiceReviewsQuery,
  useSubmitServiceReviewMutation,
  useDeleteServiceReviewMutation,
  useSubmitProductReviewMutation,
} = ownerServiceReviewApi;
