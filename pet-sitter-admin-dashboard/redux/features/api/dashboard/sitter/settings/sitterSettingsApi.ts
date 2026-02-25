import { baseApi } from "@/redux/features/api/baseApi";

export const sitterSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSitterProfile: builder.query<any, void>({
      query: () => "/pet-sitter/settings/profile",
      providesTags: ["SitterProfile"],
    }),
    updateSitterProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/pet-sitter/settings/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SitterProfile"],
    }),

    getSitterDetails: builder.query<any, void>({
      query: () => "/pet-sitter/settings/sitter-details",
      providesTags: ["SitterDetails"],
    }),
    updateSitterDetails: builder.mutation<any, any>({
      query: (body) => ({
        url: "/pet-sitter/settings/sitter-details",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SitterDetails"],
    }),

    getSitterNotificationSettings: builder.query<any, void>({
      query: () => "/pet-sitter/settings/notifications",
      providesTags: ["SitterNotifications"],
    }),
    updateSitterNotificationSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: "/pet-sitter/settings/notifications",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SitterNotifications"],
    }),

    getSitterBankingInfo: builder.query<any, void>({
      query: () => "/pet-sitter/settings/banking",
      providesTags: ["SitterBanking"],
    }),
    updateSitterBankingInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: "/pet-sitter/settings/banking",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SitterBanking"],
    }),

    getSitterDocuments: builder.query<any, void>({
      query: () => "/pet-sitter/settings/documents",
      providesTags: ["SitterDocuments"],
    }),
    uploadSitterDocuments: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/pet-sitter/settings/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SitterDocuments"],
    }),
  }),
});

export const {
  useGetSitterProfileQuery,
  useUpdateSitterProfileMutation,
  useGetSitterDetailsQuery,
  useUpdateSitterDetailsMutation,
  useGetSitterNotificationSettingsQuery,
  useUpdateSitterNotificationSettingsMutation,
  useGetSitterBankingInfoQuery,
  useUpdateSitterBankingInfoMutation,
  useGetSitterDocumentsQuery,
  useUploadSitterDocumentsMutation,
} = sitterSettingsApi;
