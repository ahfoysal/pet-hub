import { baseApi } from "@/redux/features/api/baseApi";

export const ownerSitterBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerSitterBookings: builder.query<any, void>({
      query: () => "/pet-sitter-booking/pet-owner/my-bookings",
      providesTags: ["SitterBookings"],
    }),
    createSitterBooking: builder.mutation<any, any>({
      query: (data) => ({
        url: "/pet-sitter-booking/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SitterBookings"],
    }),
    cancelSitterBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/pet-sitter-booking/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["SitterBookings"],
    }),
    completeSitterBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/pet-sitter-booking/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["SitterBookings"],
    }),
    confirmSitterBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/pet-sitter-booking/${id}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: ["SitterBookings"],
    }),
    setInProgressSitterBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/pet-sitter-booking/${id}/in-progress`,
        method: "PATCH",
      }),
      invalidatesTags: ["SitterBookings"],
    }),
    requestToCompleteSitterBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/pet-sitter-booking/${id}/request-to-complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["SitterBookings"],
    }),
  }),
});

export const {
  useGetOwnerSitterBookingsQuery,
  useCreateSitterBookingMutation,
  useCancelSitterBookingMutation,
  useCompleteSitterBookingMutation,
  useConfirmSitterBookingMutation,
  useSetInProgressSitterBookingMutation,
  useRequestToCompleteSitterBookingMutation,
} = ownerSitterBookingApi;
