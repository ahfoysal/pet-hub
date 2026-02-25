import { baseApi } from "@/redux/features/api/baseApi";

export const superAdminReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Global fetch for Super Admin
    getAllReports: builder.query<
      any,
      { page?: number; limit?: number; status?: string }
    >({
      query: (params) => ({
        url: "/reports",
        params,
      }),
      providesTags: ["ManageUsers"],
    }),
    getReportById: builder.query<any, string>({
      query: (id) => `/reports/${id}`,
      providesTags: ["ManageUsers"],
    }),
    updateReportStatus: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/reports/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ManageUsers"],
    }),
    deleteReport: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ManageUsers"],
    }),
    takeActionOnReport: builder.mutation<any, { id: string; action: any }>({
      query: ({ id, action }) => ({
        url: `/reports/${id}/take-action`,
        method: "PATCH",
        body: action,
      }),
      invalidatesTags: ["ManageUsers"],
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useGetReportByIdQuery,
  useUpdateReportStatusMutation,
  useDeleteReportMutation,
  useTakeActionOnReportMutation,
} = superAdminReportsApi;
