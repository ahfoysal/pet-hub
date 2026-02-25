import { baseApi } from "@/redux/features/api/baseApi";
import { DashboardApiResponse } from "@/types/dashboard/hotel/hotelDashboardTypes";

export const hotelDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get hotel dashboard data
    getHotelDashboard: builder.query<DashboardApiResponse, void>({
      query: () => ({
        url: "/pet-hotel/dashboard",
        method: "GET",
      }),
      providesTags: ["Hotel"],
    }),
  }),
});

export const { useGetHotelDashboardQuery } = hotelDashboardApi;
