import { KycStatusResponse, KycSubmitResponse } from "@/types/profile/kycType";
import { baseApi } from "../baseApi";

export const kycSubmitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    kycSubmit: builder.mutation<KycSubmitResponse, FormData>({
      query: (formData) => ({
        url: "/kyc/submit",
        method: "POST",
        body: formData,
      }),
    }),
    getKycStatus: builder.query<KycStatusResponse, void>({
      query: () => ({
        url: "/kyc/my-kyc",
        method: "GET",
      }),
    }),
  }),
});

export const { useKycSubmitMutation, useGetKycStatusQuery } = kycSubmitApi;
