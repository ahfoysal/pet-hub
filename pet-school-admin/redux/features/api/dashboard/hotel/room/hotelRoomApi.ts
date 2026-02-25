import { baseApi } from "@/redux/features/api/baseApi";
import { CreateRoomRequest, UpdateRoomRequest, RoomsApiResponse, RoomApiResponse } from "@/types/dashboard/hotel/hotelRoomTypes";

export const hotelRoomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all rooms for the hotel
    getMyRooms: builder.query<RoomsApiResponse, void>({
      query: () => ({
        url: "/room/me",
        method: "GET",
      }),
      providesTags: ["Hotel"],
    }),
    
    // Create a new room
    createRoom: builder.mutation<RoomApiResponse, FormData>({
      query: (data) => ({
        url: "/room",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Hotel"],
    }),
    
    // Get single room details
    getRoomById: builder.query<RoomApiResponse, string>({
      query: (roomId) => ({
        url: `/room/details/${roomId}`,
        method: "GET",
      }),
      providesTags: ["Hotel"],
    }),

    // Update a room
    updateRoom: builder.mutation<RoomApiResponse, { roomId: string; data: UpdateRoomRequest | FormData }>({
      query: ({ roomId, data }) => ({
        url: `/room/update/${roomId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Hotel"],
    }),
    
    // Delete a room
    deleteRoom: builder.mutation<RoomApiResponse, string>({
      query: (roomId) => ({
        url: `/room/remove/${roomId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotel"],
    }),
  }),
});

export const { 
  useGetMyRoomsQuery, 
  useGetRoomByIdQuery,
  useCreateRoomMutation, 
  useUpdateRoomMutation, 
  useDeleteRoomMutation 
} = hotelRoomApi;