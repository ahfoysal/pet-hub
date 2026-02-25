import { baseApi } from "@/redux/features/api/baseApi";

export const hotelInventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFoodMenu: builder.mutation<any, any>({
      query: (data) => ({
        url: "/food",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HotelFood"],
    }),
    createRoom: builder.mutation<any, any>({
      query: (data) => ({
        url: "/room",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Hotel"],
    }),
    getAllRooms: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/room/all",
        params,
      }),
      providesTags: ["Hotel"],
    }),
    checkRoomAvailability: builder.query<
      any,
      { roomId: string; checkIn: string; checkOut: string }
    >({
      query: ({ roomId, checkIn, checkOut }) =>
        `/room-availability/check/${roomId}/${checkIn}/${checkOut}`,
      providesTags: ["Hotel"],
    }),
    searchRoomAvailability: builder.query<any, any>({
      query: (params) => ({
        url: "/room-availability/search",
        params,
      }),
      providesTags: ["Hotel"],
    }),
    getAllPetHotels: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/pet-hotel",
        params,
      }),
      providesTags: ["Hotel"],
    }),
  }),
});

export const {
  useCreateFoodMenuMutation,
  useCreateRoomMutation,
  useGetAllRoomsQuery,
  useCheckRoomAvailabilityQuery,
  useSearchRoomAvailabilityQuery,
  useGetAllPetHotelsQuery,
} = hotelInventoryApi;
