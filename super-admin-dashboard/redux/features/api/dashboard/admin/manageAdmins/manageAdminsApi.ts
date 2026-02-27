import { baseApi } from "../../../baseApi";
import {
  CreateAdminRequest,
  UpdateAdminRequest,
  GetAllAdminsResponse,
  GetAdminAnalyticsResponse,
} from "@/types/dashboard/admin/manageAdmins/manageAdminsType";

export const manageAdminsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<GetAdminAnalyticsResponse, void>({
      query: () => ({
        url: "/admin-dashboard-overview/admins/analytics",
        method: "GET",
      }),
      providesTags: ["ManageAdmins" as any], // Cast slightly as ManageAdmins might not be in the global tag list
    }),

    getAllAdmins: builder.query<
      GetAllAdminsResponse,
      { search?: string; cursor?: string; limit?: number }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.cursor) queryParams.append("cursor", params.cursor);
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/admin-dashboard-overview/admins?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["ManageAdmins" as any],
    }),

    createAdmin: builder.mutation<any, CreateAdminRequest>({
      query: (body) => ({
        url: "/admin/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ManageAdmins" as any, "ManageUsers"],
    }),

    updateAdmin: builder.mutation<any, UpdateAdminRequest>({
      query: ({ adminId, ...body }) => ({
        url: `/admin/update/${adminId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ManageAdmins" as any, "ManageUsers"],
    }),

    deleteAdmin: builder.mutation<any, string>({
      query: (adminId) => ({
        url: `/admin/delete/${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ManageAdmins" as any, "ManageUsers"],
    }),

    resetAdminPassword: builder.mutation<any, string>({
      query: (adminId) => ({
        url: `/admin/reset-password/${adminId}`,
        method: "POST",
      }),
      invalidatesTags: ["ManageAdmins" as any],
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useGetAllAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useResetAdminPasswordMutation,
} = manageAdminsApi;
