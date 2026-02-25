import { baseApi } from "../../../baseApi";

export const vendorSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorProfile: builder.query<any, void>({
      query: () => "/vendor/settings/profile",
      providesTags: ["User"],
    }),
    updateVendorProfile: builder.mutation<any, any>({
      query: (data: any) => ({
        url: "/vendor/settings/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getVendorDetails: builder.query<any, void>({
      query: () => "/vendor/settings/vendor-details",
      providesTags: ["Vendor"],
    }),
    updateVendorDetails: builder.mutation<any, any>({
      query: (data: any) => ({
        url: "/vendor/settings/vendor-details",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Vendor"],
    }),

    getVendorNotificationSettings: builder.query<any, void>({
      query: () => "/vendor/settings/notifications",
      providesTags: ["VendorNotifications"],
    }),
    updateVendorNotificationSettings: builder.mutation<any, any>({
      query: (data: any) => ({
        url: "/vendor/settings/notifications",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["VendorNotifications"],
    }),

    getVendorBankingInfo: builder.query<any, void>({
      query: () => "/vendor/settings/banking",
      providesTags: ["VendorBanking"],
    }),
    updateVendorBankingInfo: builder.mutation<any, any>({
      query: (data: any) => ({
        url: "/vendor/settings/banking",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["VendorBanking"],
    }),

    getVendorDocuments: builder.query<any, void>({
      query: () => "/vendor/settings/documents",
      providesTags: ["VendorDocuments"],
    }),
    uploadVendorDocuments: builder.mutation<any, FormData>({
      query: (data: FormData) => ({
        url: "/vendor/settings/documents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VendorDocuments"],
    }),
  }),
});

export const {
  useGetVendorProfileQuery,
  useUpdateVendorProfileMutation,
  useGetVendorDetailsQuery,
  useUpdateVendorDetailsMutation,
  useGetVendorNotificationSettingsQuery,
  useUpdateVendorNotificationSettingsMutation,
  useGetVendorBankingInfoQuery,
  useUpdateVendorBankingInfoMutation,
  useGetVendorDocumentsQuery,
  useUploadVendorDocumentsMutation,
} = vendorSettingsApi;
