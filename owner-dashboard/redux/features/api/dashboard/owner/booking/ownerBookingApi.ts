import { baseApi } from "@/redux/features/api/baseApi";

export const ownerBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookingById: builder.query<any, string>({
      query: (id) => `/booking/${id}`,
      providesTags: ["Hotel"], // Will depend on the booking type
    }),
    cancelBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/booking/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Hotel", "VendorOrders"],
    }),
    createBooking: builder.mutation<any, any>({
      query: (data) => ({
        url: "/booking/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Hotel"],
    }),
    getHotelBookings: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/booking/hotel-bookings",
        params,
      }),
      providesTags: ["Hotel"],
    }),
    getMyBookings: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/booking/my-bookings",
        params,
      }),
      providesTags: ["Hotel", "VendorOrders"],
    }),
  }),
});

export const {
  useGetBookingByIdQuery,
  useCancelBookingMutation,
  useCreateBookingMutation,
  useGetHotelBookingsQuery,
  useGetMyBookingsQuery,
} = ownerBookingApi;
