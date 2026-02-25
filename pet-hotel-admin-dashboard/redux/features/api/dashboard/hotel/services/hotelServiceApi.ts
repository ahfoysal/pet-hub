import { baseApi } from "@/redux/features/api/baseApi";

export const hotelServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotelFacilities: builder.query<any, void>({
      query: () => "/pet-hotel/facilities", // Ensure correct exact path in backend
      providesTags: ["HotelFacilities"],
    }),
    createHotelFacility: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/pet-hotel/facilities",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HotelFacilities"],
    }),
    updateHotelFacility: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/pet-hotel/facilities/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["HotelFacilities"],
    }),
    deleteHotelFacility: builder.mutation<any, string>({
      query: (id) => ({
        url: `/pet-hotel/facilities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HotelFacilities"],
    }),
  }),
});

export const {
  useGetHotelFacilitiesQuery,
  useCreateHotelFacilityMutation,
  useUpdateHotelFacilityMutation,
  useDeleteHotelFacilityMutation,
} = hotelServiceApi;
