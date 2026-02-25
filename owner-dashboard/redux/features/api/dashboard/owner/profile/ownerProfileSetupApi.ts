import { baseApi } from "@/redux/features/api/baseApi";

export const ownerProfileSetupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    completeOwnerProfile: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "/pet-owner/profile-setup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useCompleteOwnerProfileMutation } = ownerProfileSetupApi;
