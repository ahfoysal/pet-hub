import { baseApi } from "@/redux/features/api/baseApi";
import { PetProfile } from "@/types/pet/petType";

export const ownerPetProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all pets for the currently logged-in owner
    getMyPets: builder.query<{ data: PetProfile[] }, void>({
      query: () => "/pet-profile/my-pets",
      providesTags: ["Pet"],
    }),

    // Get a specific pet by ID for the owner
    getMyPetById: builder.query<{ data: PetProfile }, string>({
      query: (petId) => `/pet-profile/my-pets/${petId}`,
      providesTags: (result, error, arg) => [{ type: "Pet", id: arg }],
    }),

    // Get all pets belonging to a specific owner ID (Public/Admin view)
    getPetsByOwnerId: builder.query<{ data: PetProfile[] }, string>({
      query: (ownerId) => `/pet-profile/pets-by-owner/${ownerId}`,
      providesTags: ["Pet"],
    }),

    createPetProfile: builder.mutation<{ data: PetProfile }, FormData>({
      query: (data) => ({
        url: "/pet-profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pet"],
    }),

    updatePetProfile: builder.mutation<
      { data: PetProfile },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/pet-profile/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Pet", id: arg.id },
        "Pet",
      ],
    }),

    deletePetProfile: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/pet-profile/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pet"],
    }),
  }),
});

export const {
  useGetMyPetsQuery,
  useGetMyPetByIdQuery,
  useGetPetsByOwnerIdQuery,
  useCreatePetProfileMutation,
  useUpdatePetProfileMutation,
  useDeletePetProfileMutation,
} = ownerPetProfileApi;
