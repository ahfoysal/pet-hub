import { KYCData } from "@/types/dashboard/admin/kyc/adminKycType";
import { baseApi } from "../../../baseApi";

interface KycStatusResponse {
  success: boolean;
  message: string;
  data?: KYCData[];
}

interface KycStatusByIdResponse {
  success: boolean;
  message: string;
  data?: KYCData;
}

interface KycActionResponse {
  success: boolean;
  message: string;
  data?: KYCData;
}

export const adminKycApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllKycSubmissions: builder.query<KycStatusResponse, void>({
      query: () => ({
        url: "/kyc",
        method: "GET",
      }),
      providesTags: ["KYC"],
    }),

    getKycById: builder.query<KycStatusByIdResponse, string>({
      query: (id) => ({
        url: `/kyc/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "KYC", id }],
    }),

    approveKyc: builder.mutation<KycActionResponse, string>({
      query: (id) => ({
        url: `/kyc/approval/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["KYC"],
    }),

    rejectKyc: builder.mutation<KycActionResponse, string>({
      query: (id) => ({
        url: `/kyc/rejection/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["KYC"],
    }),
  }),
});

export const {
  useGetAllKycSubmissionsQuery,
  useGetKycByIdQuery,
  useApproveKycMutation,
  useRejectKycMutation,
} = adminKycApi;
