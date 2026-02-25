import { baseApi } from "@/redux/features/api/baseApi";
import {
  FoodApiResponse,
  FoodsApiResponse,
  FoodDeleteResponse,
} from "@/types/dashboard/hotel/hotelFoodTypes";

export const hotelFoodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all foods for the hotel
    getMyFoods: builder.query<FoodsApiResponse, void>({
      query: () => ({
        url: "/food/my-foods",
        method: "GET",
      }),
      providesTags: ["HotelFood"],
    }),

    // Get single food by id
    getFoodById: builder.query<FoodApiResponse, string>({
      query: (id) => ({
        url: `/food/${id}`,
        method: "GET",
      }),
      providesTags: ["HotelFood"],
    }),

    // Create food
    createFood: builder.mutation<FoodApiResponse, FormData>({
      query: (data) => ({
        url: "/food",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HotelFood"],
    }),

    // Update food
    updateFood: builder.mutation<FoodApiResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/food/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["HotelFood"],
    }),

    // Delete food
    deleteFood: builder.mutation<FoodDeleteResponse, string>({
      query: (id) => ({
        url: `/food/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HotelFood"],
    }),
  }),
});

export const {
  useGetMyFoodsQuery,
  useGetFoodByIdQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
} = hotelFoodApi;
