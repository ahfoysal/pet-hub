import { baseApi } from "@/redux/features/api/baseApi";

export const sitterDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSitterStats: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/overview",
      providesTags: ["SitterStats"],
    }),
    getSitterBookingRatio: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/bookings/stats",
      providesTags: ["SitterStats"],
    }),
    getSitterBookingTrends: builder.query<any, number | void>({
      query: (year) => {
        const url = new URLSearchParams();
        if (year) url.append("year", year.toString());
        return `/pet-sitter-dashboard/bookings/trends${
          url.toString() ? `?${url.toString()}` : ""
        }`;
      },
      providesTags: ["SitterStats"],
    }),

    // Performance
    getSitterTopPackages: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/performance/top/packages",
    }),
    getSitterTopServices: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/performance/top/services",
    }),
    getSitterLowPackages: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/performance/low/packages",
    }),
    getSitterLowServices: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/performance/low/services",
    }),

    // Bookings
    getSitterRecentBookings: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/bookings/recent",
      providesTags: ["SitterBookings"],
    }),
    getSitterUpcomingBookings: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/bookings/upcoming",
      providesTags: ["SitterBookings"],
    }),

    // Clients
    getSitterClients: builder.query<any, { search?: string; cursor?: string; limit?: number }>({
      query: ({ search, cursor, limit }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (cursor) params.append("cursor", cursor);
        if (limit) params.append("limit", limit.toString());
        return `/pet-sitter-dashboard/clients?${params.toString()}`;
      },
    }),
    getSitterClientHistory: builder.query<any, { id: string; search?: string; cursor?: string; limit?: number }>({
      query: ({ id, search, cursor, limit }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (cursor) params.append("cursor", cursor);
        if (limit) params.append("limit", limit.toString());
        return `/pet-sitter-dashboard/client/history/${id}?${params.toString()}`;
      },
    }),
    getSitterTopCustomers: builder.query<any, void>({
      query: () => "/pet-sitter-dashboard/customers/top",
    }),
  }),
});

export const {
  useGetSitterStatsQuery,
  useGetSitterBookingRatioQuery,
  useGetSitterBookingTrendsQuery,
  useGetSitterTopPackagesQuery,
  useGetSitterTopServicesQuery,
  useGetSitterLowPackagesQuery,
  useGetSitterLowServicesQuery,
  useGetSitterRecentBookingsQuery,
  useGetSitterUpcomingBookingsQuery,
  useGetSitterClientsQuery,
  useGetSitterClientHistoryQuery,
  useGetSitterTopCustomersQuery,
} = sitterDashboardApi;
