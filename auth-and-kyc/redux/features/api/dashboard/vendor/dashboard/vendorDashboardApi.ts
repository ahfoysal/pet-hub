import { baseApi } from "@/redux/features/api/baseApi";

export const vendorDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorDashboard: builder.query({
      query: () => ({
        url: "/vendor/dashboard",
        method: "GET",
      }),
      providesTags: ["Vendor"],
    }),
  }),
});

export const { useGetVendorDashboardQuery } = vendorDashboardApi;
