import { baseApi } from "@/redux/features/api/baseApi";
import { HotelProfileSetupRequest, HotelProfileApiResponse } from "@/types/profile/hotel/hotelProfileTypes";

export const hotelProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get hotel profile
    getHotelProfile: builder.query<HotelProfileApiResponse, void>({
      query: () => ({
        url: "/pet-hotel/profile",
        method: "GET",
      }),
      providesTags: ["Hotel"],
    }),
    
    // Update hotel profile
    updateHotelProfile: builder.mutation<HotelProfileApiResponse, HotelProfileSetupRequest | FormData>({
      query: (data) => ({
        url: "/pet-hotel/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Hotel"],
    }),
  }),
});

export const { useGetHotelProfileQuery, useUpdateHotelProfileMutation } = hotelProfileApi;