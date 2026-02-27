import { baseApi } from "../../../baseApi";
import {
  RecentKycResponse,
  RolesCountResponse,
  PetOwnersResponse,
  PetSittersResponse,
  PetSchoolsResponse,
  PetHotelsResponse,
  PetVendorsResponse,
  FinanceStatsResponse,
  TransactionsResponse,
  GrowthAnalyticsResponse,
  CategoryAnalyticsResponse,
  OverviewStatsResponse,
  MonthlyRevenueResponse,
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
      { search?: string; cursor?: string; limit?: number; page?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/pet-owners",
        method: "GET",
        params,
      }),
    }),
    getPetSitters: builder.query<
      PetSittersResponse,
      { search?: string; cursor?: string; limit?: number; page?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/pet-sitter",
        method: "GET",
        params,
      }),
    }),
    getPetSchools: builder.query<
      PetSchoolsResponse,
      { search?: string; cursor?: string; limit?: number; page?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/schools",
        method: "GET",
        params,
      }),
    }),
    getPetHotels: builder.query<
      PetHotelsResponse,
      { search?: string; cursor?: string; limit?: number; page?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/hotels",
        method: "GET",
        params,
      }),
    }),
    getPetVendors: builder.query<
      PetVendorsResponse,
      { search?: string; cursor?: string; limit?: number; page?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/vendors",
        method: "GET",
        params,
      }),
    }),
    getFinanceStats: builder.query<FinanceStatsResponse, void>({
      query: () => ({
        url: "/admin-dashboard-overview/finance-stats",
        method: "GET",
      }),
    }),
    getRecentTransactions: builder.query<
      TransactionsResponse,
      { search?: string; cursor?: string; limit?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/transactions",
        method: "GET",
        params,
      }),
    }),
    getGrowthAnalytics: builder.query<GrowthAnalyticsResponse, { timeframe?: string }>({
      query: (params) => ({
        url: "/admin-dashboard-overview/analytics/growth",
        method: "GET",
        params,
      }),
    }),
    getCategoryAnalytics: builder.query<CategoryAnalyticsResponse, { category?: string }>({
      query: (params) => ({
        url: "/admin-dashboard-overview/analytics/categories",
        method: "GET",
        params,
      }),
    }),
    getOverviewStats: builder.query<OverviewStatsResponse, void>({
      query: () => ({
        url: "/admin-dashboard-overview/overview-stats",
        method: "GET",
      }),
    }),
    getMonthlyRevenue: builder.query<MonthlyRevenueResponse, void>({
      query: () => ({
        url: "/admin-dashboard-overview/monthly-revenue",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetRolesCountQuery,
  useGetRecentKycQuery,
  useGetPetOwnersQuery,
  useGetPetSittersQuery,
  useGetPetSchoolsQuery,
  useGetPetHotelsQuery,
  useGetPetVendorsQuery,
  useGetFinanceStatsQuery,
  useGetRecentTransactionsQuery,
  useGetGrowthAnalyticsQuery,
  useGetCategoryAnalyticsQuery,
  useGetOverviewStatsQuery,
  useGetMonthlyRevenueQuery,
} = adminDashboardApi;
