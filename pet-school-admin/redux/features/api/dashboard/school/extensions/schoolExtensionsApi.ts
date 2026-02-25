import { baseApi } from "@/redux/features/api/baseApi";

export const schoolExtensionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourses: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/course/all",
        params,
      }),
      providesTags: ["School"],
    }),
    getCourseDetails: builder.query<any, string>({
      query: (courseId) => `/course/details/${courseId}`,
      providesTags: ["School"],
    }),
    getEnrolledCourses: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/course/enrolled",
        params,
      }),
      providesTags: ["School", "User"], // Tracks student interactions
    }),
    enrollInCourse: builder.mutation<any, any>({
      query: (data) => ({
        url: "/course/admission/enroll",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdmissionRequest", "User"],
    }),
    respondToAdmission: builder.mutation<any, { id: string; response: any }>({
      query: ({ id, response }) => ({
        url: `/course/admission/${id}/respond`,
        method: "PATCH",
        body: response,
      }),
      invalidatesTags: ["AdmissionRequest"],
    }),
    createTrainerProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: "/trainer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["School", "User"],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetEnrolledCoursesQuery,
  useEnrollInCourseMutation,
  useRespondToAdmissionMutation,
  useCreateTrainerProfileMutation,
} = schoolExtensionsApi;
