// SchoolStudentApi.ts
import { baseApi } from "@/redux/features/api/baseApi";
import { PetProfileResponse } from "@/types/dashboard/PetProfileTypes";
import { GetALlStudentResponse } from "@/types/dashboard/school/SchoolStudentsTypes";

export const schoolStudentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStudents: builder.query<GetALlStudentResponse | null, void>({
      query: () => ({
        url: "/pet-school/students",
        method: "GET",
      }),
    }),

    // NEW: Lazy query for pet profile
    getPetProfile: builder.query<PetProfileResponse, string>({
      query: (petId) => ({
        url: `/pet-profile/${petId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllStudentsQuery, useLazyGetPetProfileQuery } =
  schoolStudentApi;
