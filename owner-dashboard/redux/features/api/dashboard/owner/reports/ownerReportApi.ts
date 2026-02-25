import { baseApi } from "@/redux/features/api/baseApi";

export const ownerReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitReport: builder.mutation<any, any>({
      query: (data) => ({
        url: "/reports",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"], // Triggers cache refresh if reports tie heavily to user actions
    }),
    getMySubmittedReports: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/reports/my-submitted-reports",
        params,
      }),
      providesTags: ["User"],
    }),
    getReportsAgainstMe: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/reports/reports-against-me",
        params,
      }),
      providesTags: ["User"],
    }),
    getMyReportById: builder.query<any, string>({
      query: (reportId) => `/reports/my-reports/${reportId}`,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useSubmitReportMutation,
  useGetMySubmittedReportsQuery,
  useGetReportsAgainstMeQuery,
  useGetMyReportByIdQuery,
} = ownerReportApi;
