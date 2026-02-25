import { baseApi } from "@/redux/features/api/baseApi";

export const superAdminAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewHotels: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/admin-dashboard-overview/hotels",
        params,
      }),
      providesTags: ["Hotel", "ManageUsers"],
    }),
    getOverviewPetOwners: builder.query<any, { page?: number; limit?: number }>(
      {
        query: (params) => ({
          url: "/admin-dashboard-overview/pet-owners",
          params,
        }),
        providesTags: ["User", "ManageUsers"],
      },
    ),
    getOverviewPetSitters: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/admin-dashboard-overview/pet-sitter",
        params,
      }),
      providesTags: ["Sitter", "ManageUsers"],
    }),
    getOverviewSchools: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/admin-dashboard-overview/schools",
        params,
      }),
      providesTags: ["School", "ManageUsers"],
    }),
    getOverviewVendors: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/admin-dashboard-overview/vendors",
        params,
      }),
      providesTags: ["Vendor", "ManageUsers"],
    }),
  }),
});

export const {
  useGetOverviewHotelsQuery,
  useGetOverviewPetOwnersQuery,
  useGetOverviewPetSittersQuery,
  useGetOverviewSchoolsQuery,
  useGetOverviewVendorsQuery,
} = superAdminAnalyticsApi;
