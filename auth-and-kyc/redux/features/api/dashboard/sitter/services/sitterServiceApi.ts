import { baseApi } from "@/redux/features/api/baseApi";
import { SuccessResponse } from "@/types/common";
import {
  CreateServiceRequest,
  CreateServiceResponse,
  SitterServiceApiResponse,
  UpdateServiceRequest,
} from "@/types/profile/sitter/services/sitterServiceType";

export const sitterServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // get all services
    getSitterService: builder.query<SitterServiceApiResponse, void>({
      query: () => ({
        url: "/services/me",
        method: "GET",
      }),
      providesTags: ["Sitter"],
    }),

    // get a services by id
    getService: builder.query({
      query: (id: string) => ({
        url: `/services/${id}`,
        method: "GET",
      }),
      providesTags: ["Sitter"],
    }),

    // create a service
    createService: builder.mutation<
      CreateServiceResponse,
      FormData
    >({
      query: (body: FormData) => ({
        url: "/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sitter"],
    }),
    // update a service
    updateService: builder.mutation<
      CreateServiceResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Sitter"],
    }),

    // Delete a service
    deleteService: builder.mutation<SuccessResponse, string>({
      query: (id: string) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sitter"],
    }),

    // Toggle service availability
    toggleServiceAvailability: builder.mutation<
      { success: boolean; message: string; data: { id: string; name: string; isAvailable: boolean } },
      string
    >({
      query: (id: string) => ({
        url: `/services/${id}/toggle-availability`,
        method: "PATCH",
      }),
      invalidatesTags: ["Sitter"],
    }),
  }),
});

export const { 
  useGetSitterServiceQuery, 
  useGetServiceQuery,
  useCreateServiceMutation, 
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useToggleServiceAvailabilityMutation,
} = sitterServiceApi;
