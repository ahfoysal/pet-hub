import { baseApi } from "@/redux/features/api/baseApi";
import {
  SitterBookingsApiResponse,
  SitterBookingDetailResponse,
  SitterBookingActionResponse,
  SitterBookingListParams,
} from "@/types/dashboard/sitter/sitterBookingTypes";

export const sitterBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get my bookings as pet sitter
    getMyBookings: builder.query<SitterBookingsApiResponse, SitterBookingListParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.set("limit", String(params.limit));
        if (params.cursor) queryParams.set("cursor", params.cursor);
        if (params.status) queryParams.set("status", params.status);
        if (params.bookingType) queryParams.set("bookingType", params.bookingType);
        const qs = queryParams.toString();
        return {
          url: `/pet-sitter-booking/pet-sitter/my-bookings${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["SitterBookings"],
    }),

    // Get booking detail by ID
    getBookingById: builder.query<SitterBookingDetailResponse, string>({
      query: (id: string) => ({
        url: `/pet-sitter-booking/${id}`,
        method: "GET",
      }),
      providesTags: ["SitterBookings"],
    }),

    // Confirm a booking
    confirmBooking: builder.mutation<SitterBookingActionResponse, string>({
      query: (id: string) => ({
        url: `/pet-sitter-booking/${id}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: ["SitterBookings"],
    }),

    // Cancel a booking
    cancelBooking: builder.mutation<SitterBookingActionResponse, string>({
      query: (id: string) => ({
        url: `/pet-sitter-booking/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["SitterBookings"],
    }),

    // Mark booking as in-progress
    markInProgress: builder.mutation<SitterBookingActionResponse, string>({
      query: (id: string) => ({
        url: `/pet-sitter-booking/${id}/in-progress`,
        method: "PATCH",
      }),
      invalidatesTags: ["SitterBookings"],
    }),

    // Request to complete booking (multipart with files + note)
    requestToComplete: builder.mutation<
      SitterBookingActionResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/pet-sitter-booking/${id}/request-to-complete`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SitterBookings"],
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useConfirmBookingMutation,
  useCancelBookingMutation,
  useMarkInProgressMutation,
  useRequestToCompleteMutation,
} = sitterBookingApi;
