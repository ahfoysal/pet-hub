import { baseApi } from "../../../baseApi";

export const adminRoomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRooms: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/room/all",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetAllRoomsQuery } = adminRoomApi;
