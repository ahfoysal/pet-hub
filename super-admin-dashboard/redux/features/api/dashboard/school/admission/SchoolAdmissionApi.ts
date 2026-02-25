// redux/features/api/dashboard/school/admission/SchoolAdmissionApi.ts

import { baseApi } from "@/redux/features/api/baseApi";
import {
  GetAdmissionByIdResponse,
  GetAllAdminAdmissionResponse,
  ManageAdmissionRequest,
  ManageAdmissionResponse,
} from "@/types/dashboard/school/SchoolAdmissionTypes";

export const schoolAdmissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all admission requests
    getAllAdmissionRequest: builder.query<GetAllAdminAdmissionResponse, void>({
      query: () => ({
        url: "/course/admission/requests",
        method: "GET",
      }),
      providesTags: ["AdmissionRequest"],
    }),

    // Respond to an admission request (Approve / Reject)
    respondToAdmissionRequest: builder.mutation<
      ManageAdmissionResponse,
      { admissionId: string; status: ManageAdmissionRequest }
    >({
      query: ({ admissionId, status }) => ({
        url: `/course/admission/${admissionId}/respond`,
        method: "PATCH",
        body: status,
      }),
      invalidatesTags: ["AdmissionRequest"],
    }),

    getAdmissionById: builder.query<GetAdmissionByIdResponse, string>({
      query: (id) => ({
        url: `/course/admission/requests/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdmissionRequest", id }],
    }),
  }),
});

// Export hooks
export const {
  useGetAllAdmissionRequestQuery,
  useRespondToAdmissionRequestMutation,
  useGetAdmissionByIdQuery,
} = schoolAdmissionApi;
