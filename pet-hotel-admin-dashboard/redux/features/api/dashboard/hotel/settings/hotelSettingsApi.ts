import { baseApi } from "@/redux/features/api/baseApi";

export const hotelSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotelSettingsProfile: builder.query<any, void>({
      query: () => "/pet-hotel/settings/profile",
      providesTags: ["HotelProfile"],
    }),
    updateHotelSettingsProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/pet-hotel/settings/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["HotelProfile"],
    }),

    getHotelDetails: builder.query<any, void>({
      query: () => "/pet-hotel/settings/hotel-details",
      providesTags: ["HotelDetails"],
    }),
    updateHotelDetails: builder.mutation<any, any>({
      query: (body) => ({
        url: "/pet-hotel/settings/hotel-details",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["HotelDetails"],
    }),

    getHotelNotificationSettings: builder.query<any, void>({
      query: () => "/pet-hotel/settings/notifications",
      providesTags: ["HotelNotifications"],
    }),
    updateHotelNotificationSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: "/pet-hotel/settings/notifications",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["HotelNotifications"],
    }),

    getHotelBankingInfo: builder.query<any, void>({
      query: () => "/pet-hotel/settings/banking",
      providesTags: ["HotelBanking"],
    }),
    updateHotelBankingInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: "/pet-hotel/settings/banking",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["HotelBanking"],
    }),

    getHotelDocuments: builder.query<any, void>({
      query: () => "/pet-hotel/settings/documents",
      providesTags: ["HotelDocuments"],
    }),
    uploadHotelDocuments: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/pet-hotel/settings/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HotelDocuments"],
    }),
  }),
});

export const {
  useGetHotelSettingsProfileQuery,
  useUpdateHotelSettingsProfileMutation,
  useGetHotelDetailsQuery,
  useUpdateHotelDetailsMutation,
  useGetHotelNotificationSettingsQuery,
  useUpdateHotelNotificationSettingsMutation,
  useGetHotelBankingInfoQuery,
  useUpdateHotelBankingInfoMutation,
  useGetHotelDocumentsQuery,
  useUploadHotelDocumentsMutation,
} = hotelSettingsApi;
