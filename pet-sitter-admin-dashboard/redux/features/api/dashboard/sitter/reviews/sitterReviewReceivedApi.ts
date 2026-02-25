import { baseApi } from "@/redux/features/api/baseApi";

export const sitterReviewReceivedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReceivedSitterReviews: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/pet-sitter-reviews/received",
        params,
      }),
      providesTags: ["Sitter"], // Tag depends on standard invalidation schemas
    }),
    getReceivedPackageReviews: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/pet-sitter-package-review/received",
        params,
      }),
      providesTags: ["Sitter", "VendorPackages"],
    }),
    getReceivedServiceReviews: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/service-review/received",
        params,
      }),
      providesTags: ["Sitter", "Services"],
    }),

    // Public getters useful for the sitter previewing their own public pages
    getSitterReviewsById: builder.query<any, string>({
      query: (sitterId) => `/pet-sitter-reviews/pet-sitter/${sitterId}`,
      providesTags: ["Sitter"],
    }),
    getPackageReviewsById: builder.query<any, string>({
      query: (packageId) => `/pet-sitter-package-review/package/${packageId}`,
      providesTags: ["Sitter", "VendorPackages"],
    }),
    getServiceReviewsById: builder.query<any, string>({
      query: (serviceId) => `/service-review/service/${serviceId}`,
      providesTags: ["Sitter", "Services"],
    }),
  }),
});

export const {
  useGetReceivedSitterReviewsQuery,
  useGetReceivedPackageReviewsQuery,
  useGetReceivedServiceReviewsQuery,
  useGetSitterReviewsByIdQuery,
  useGetPackageReviewsByIdQuery,
  useGetServiceReviewsByIdQuery,
} = sitterReviewReceivedApi;
