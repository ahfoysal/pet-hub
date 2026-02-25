import {
  GetPlatformSettingsResponse,
  UpdatePlatformSettingsRequest,
  UpdatePlatformSettingsResponse,
  GetPlatformSettingsHistoryParams,
  GetPlatformSettingsHistoryResponse,
} from "@/types/dashboard/admin/platformSettings/platformSettingsType";
import { baseApi } from "../../../baseApi";

export const platformSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformSettings: builder.query<GetPlatformSettingsResponse, void>({
      query: () => ({
        url: "/platform-settings",
        method: "GET",
      }),
      providesTags: ["PlatformSettings"],
    }),

    updatePlatformSettings: builder.mutation<
      UpdatePlatformSettingsResponse,
      UpdatePlatformSettingsRequest
    >({
      query: (body) => ({
        url: "/platform-settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PlatformSettings"],
    }),

    getPlatformSettingsHistory: builder.query<
      GetPlatformSettingsHistoryResponse,
      GetPlatformSettingsHistoryParams
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.cursor) searchParams.set("cursor", params.cursor);
        if (params.limit) searchParams.set("limit", String(params.limit));
        if (params.search) searchParams.set("search", params.search);
        const queryStr = searchParams.toString();
        return {
          url: `/platform-settings/history${queryStr ? `?${queryStr}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["PlatformSettings"],
    }),
  }),
});

export const {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
  useGetPlatformSettingsHistoryQuery,
} = platformSettingsApi;
