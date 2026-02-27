import { baseApi } from "@/redux/features/api/baseApi";

export const hotelFinanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceOverview: builder.query<any, void>({
      query: () => ({
        url: "/pet-hotel/finance/overview",
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),
    getFinanceHistory: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/pet-hotel/finance/history?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),
    getFinanceTimeline: builder.query<any, void>({
      query: () => ({
        url: "/pet-hotel/finance/timeline",
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),
  }),
});

export const {
  useGetFinanceOverviewQuery,
  useGetFinanceHistoryQuery,
  useGetFinanceTimelineQuery,
} = hotelFinanceApi;
