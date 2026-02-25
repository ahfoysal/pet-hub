import { baseApi } from "@/redux/features/api/baseApi";
import { FoodsApiResponse } from "@/types/dashboard/hotel/hotelFoodTypes";

export const adminFoodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all foods for the platform (Super Admin)
    getAllFoods: builder.query<
      FoodsApiResponse,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/food",
        method: "GET",
        params,
      }),
      providesTags: ["HotelFood"],
    }),

    // Super Admin might also need to delete food if it violates terms
    adminDeleteFood: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/food/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HotelFood"],
    }),
  }),
});

export const { useGetAllFoodsQuery, useAdminDeleteFoodMutation } = adminFoodApi;
