import {
  CreateSchoolTrainerResponse,
  GetSchoolTrainersResponse,
} from "@/types/dashboard/school/SchoolTrainersTypes";
import { baseApi } from "../../../baseApi";

export const schoolTrainersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: My school trainers
    getSchoolTrainers: builder.query<GetSchoolTrainersResponse, void>({
      query: () => ({
        url: "/trainer/my-trainers",
        method: "GET",
      }),
      providesTags: ["School"],
    }),

    // POST: Create trainer
    createTrainer: builder.mutation<CreateSchoolTrainerResponse, FormData>({
      query: (formData) => ({
        url: "/trainer",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["School"],
    }),

    // PUT: Update trainer
    updateTrainer: builder.mutation<
      CreateSchoolTrainerResponse,
      { trainerId: string; data: FormData }
    >({
      query: ({ trainerId, data }) => ({
        url: `/trainer/${trainerId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["School"],
    }),

    // DELETE: Delete trainer
    deleteTrainer: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (trainerId) => ({
        url: `/trainer/${trainerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["School"],
    }),
  }),
});

export const {
  useGetSchoolTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
} = schoolTrainersApi;
