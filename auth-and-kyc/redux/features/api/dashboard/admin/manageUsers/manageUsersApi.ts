import {
  BanUserRequest,
  SuspendUserRequest,
  ActionResponse,
  GetAllUsersResponse,
  GetBannedUsersResponse,
  GetSuspendedUsersResponse,
} from "@/types/dashboard/admin/manageUsers/manageUsersType";
import { baseApi } from "../../../baseApi";

export const manageUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersResponse, void>({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["ManageUsers"],
    }),

    getBannedUsers: builder.query<GetBannedUsersResponse, void>({
      query: () => ({
        url: "/admin/banned-users",
        method: "GET",
      }),
      providesTags: ["ManageUsers"],
    }),

    getSuspendedUsers: builder.query<GetSuspendedUsersResponse, void>({
      query: () => ({
        url: "/admin/suspend-users",
        method: "GET",
      }),
      providesTags: ["ManageUsers"],
    }),

    banUser: builder.mutation<ActionResponse, BanUserRequest>({
      query: (body) => ({
        url: "/admin/ban-user",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ManageUsers"],
    }),

    suspendUser: builder.mutation<ActionResponse, SuspendUserRequest>({
      query: (body) => ({
        url: "/admin/suspend-user",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ManageUsers"],
    }),

    reactivateUser: builder.mutation<ActionResponse, string>({
      query: (userId) => ({
        url: `/admin/reactivate-user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ManageUsers"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetBannedUsersQuery,
  useGetSuspendedUsersQuery,
  useBanUserMutation,
  useSuspendUserMutation,
  useReactivateUserMutation,
} = manageUsersApi;
