import { baseApi } from "@/redux/features/api/baseApi";

export const hotelBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotelBookings: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/booking/hotel-bookings",
        params,
      }),
      providesTags: ["Booking"],
    }),
    getHotelBookingById: builder.query<any, string>({
      query: (id) => `/booking/${id}`,
      providesTags: ["Booking"],
    }),
    cancelHotelBooking: builder.mutation<
      any,
      { bookingId: string; cancelledBy: string }
    >({
      query: ({ bookingId, cancelledBy }) => ({
        url: `/booking/${bookingId}/cancel`,
        method: "PATCH",
        body: { cancelledBy },
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const { 
  useGetHotelBookingsQuery, 
  useGetHotelBookingByIdQuery,
  useCancelHotelBookingMutation 
} = hotelBookingApi;
