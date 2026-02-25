import { baseApi } from "@/redux/features/api/baseApi";

export const sitterDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSitterDashboard: builder.query({
      query: () => ({
        url: "/sitter/dashboard",
        method: "GET",
      }),
      providesTags: ["Sitter"],
    }),
  }),
});

export const { useGetSitterDashboardQuery } = sitterDashboardApi;
