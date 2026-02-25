import { baseApi } from "@/redux/features/api/baseApi";
import {
  SitterPackageApiResponse,
  SitterPackageDetailsResponse,
  CreatePackageResponse,
  TogglePackageResponse,
} from "@/types/dashboard/sitter/sitterPackageTypes";
import { SuccessResponse } from "@/types/common";

export const sitterPackageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get my packages as pet sitter
    getMyPackages: builder.query<SitterPackageApiResponse, void>({
      query: () => ({
        url: "/pet-sitter-package/me",
        method: "GET",
      }),
      providesTags: ["Sitter"],
    }),

    // Get package by ID
    getPackageById: builder.query<SitterPackageDetailsResponse, string>({
      query: (id: string) => ({
        url: `/pet-sitter-package/${id}`,
        method: "GET",
      }),
      providesTags: ["Sitter"],
    }),

    // Create a package
    createPackage: builder.mutation<CreatePackageResponse, FormData>({
      query: (body: FormData) => ({
        url: "/pet-sitter-package",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sitter"],
    }),

    // Update a package
    updatePackage: builder.mutation<
      CreatePackageResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/pet-sitter-package/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Sitter"],
    }),

    // Delete a package
    deletePackage: builder.mutation<SuccessResponse, string>({
      query: (id: string) => ({
        url: `/pet-sitter-package/${id}`,
        method: "DELETE",
      }),
      // DO NOT use invalidatesTags here — the backend soft-deletes packages
      // and /me still returns them, so a refetch would bring deleted items back.
      // Pessimistically remove from cache after success
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Remove from getMyPackages cache
          dispatch(
            sitterPackageApi.util.updateQueryData(
              "getMyPackages",
              undefined,
              (draft) => {
                if (draft?.data?.data) {
                  draft.data.data = draft.data.data.filter(
                    (pkg) => pkg.id !== id
                  );
                }
              }
            )
          );
        } catch {
          // Delete failed, don't touch cache
        }
      },
    }),

    // Toggle package availability
    togglePackageAvailability: builder.mutation<TogglePackageResponse, string>({
      query: (id: string) => ({
        url: `/pet-sitter-package/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Sitter"],
    }),
  }),
});

export const {
  useGetMyPackagesQuery,
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useTogglePackageAvailabilityMutation,
} = sitterPackageApi;
