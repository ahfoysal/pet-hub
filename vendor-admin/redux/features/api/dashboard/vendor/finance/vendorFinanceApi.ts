import { baseApi } from "../../../baseApi";

export const vendorFinanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceOverview: builder.query<any, void>({
      query: () => ({
        url: "/vendor/finance/overview",
        method: "GET",
      }),
      providesTags: ["VendorFinance"],
    }),
    getFinanceHistory: builder.query<any, { page: number; limit: number; status?: string }>({
      query: ({ page, limit, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append("status", status);
        return {
          url: `/vendor/finance/history?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["VendorFinance"],
    }),
    getFinanceTimeline: builder.query<any, void>({
      query: () => ({
        url: "/vendor/finance/timeline",
        method: "GET",
      }),
      providesTags: ["VendorFinance"],
    }),
  }),
});

export const {
  useGetFinanceOverviewQuery,
  useGetFinanceHistoryQuery,
  useGetFinanceTimelineQuery,
} = vendorFinanceApi;
