import { baseApi } from "../../../baseApi";
import {
  RecentKycResponse,
  RolesCountResponse,
  PetOwnersResponse,
  PetSittersResponse,
} from "@/types/dashboard/admin/dashboard/adminDashboardType";

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRolesCount: builder.query<RolesCountResponse, void>({
      query: () => ({
        url: "/admin-dashboard-overview/roles/count",
        method: "GET",
      }),
    }),
    getRecentKyc: builder.query<RecentKycResponse, void>({
      query: () => ({
        url: "/admin-dashboard-overview/kyc/recent",
        method: "GET",
      }),
    }),
    getPetOwners: builder.query<
      PetOwnersResponse,
      { search?: string; cursor?: string; limit?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/pet-owners",
        method: "GET",
        params,
      }),
    }),
    getPetSitters: builder.query<
      PetSittersResponse,
      { search?: string; cursor?: string; limit?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/pet-sitter",
        method: "GET",
        params,
      }),
    }),
    getFinanceStats: builder.query<any, void>({
      query: () => ({
        url: "/admin-dashboard-overview/finance-stats",
        method: "GET",
      }),
    }),
    getRecentTransactions: builder.query<
      any,
      { search?: string; cursor?: string; limit?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/transactions",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetRolesCountQuery,
  useGetRecentKycQuery,
  useGetPetOwnersQuery,
  useGetPetSittersQuery,
  useGetFinanceStatsQuery,
  useGetRecentTransactionsQuery,
} = adminDashboardApi;
