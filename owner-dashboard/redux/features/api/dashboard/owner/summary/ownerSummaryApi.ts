import { baseApi } from "@/redux/features/api/baseApi";

export const ownerSummaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerBookingHistory: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/pet-owner-summary/bookings/history",
        params,
      }),
      providesTags: ["SitterBookings"],
    }),
    getOwnerRecentBookings: builder.query<any, void>({
      query: () => "/pet-owner-summary/bookings/recent",
      providesTags: ["SitterBookings"],
    }),
    getOwnerBookingSummary: builder.query<any, void>({
      query: () => "/pet-owner-summary/bookings/summary",
      providesTags: ["SitterBookings"],
    }),
    getSitterHistoryForOwner: builder.query<any, string>({
      query: (sitterId) => `/pet-owner-summary/pet-sitter/history/${sitterId}`,
      providesTags: ["SitterBookings", "Sitter"],
    }),
    getTopSittersForOwner: builder.query<any, void>({
      query: () => "/pet-owner-summary/pet-sitters/top",
      providesTags: ["Sitter"],
    }),
    getTopServicesAndPackages: builder.query<any, void>({
      query: () => "/pet-owner-summary/top/services-packages",
      providesTags: ["SitterBookings", "Products"],
    }),
  }),
});

export const {
  useGetOwnerBookingHistoryQuery,
  useGetOwnerRecentBookingsQuery,
  useGetOwnerBookingSummaryQuery,
  useGetSitterHistoryForOwnerQuery,
  useGetTopSittersForOwnerQuery,
  useGetTopServicesAndPackagesQuery,
} = ownerSummaryApi;
