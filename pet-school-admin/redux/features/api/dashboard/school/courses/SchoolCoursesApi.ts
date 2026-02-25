import {
  CreateSchoolCourseResponse,
  GetSchoolCoursesResponse,
  UpdateSchoolCourseResponse,
} from "@/types/dashboard/school/SchoolCoursesTypes";
import { baseApi } from "../../../baseApi";

export const schoolCoursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET: My school courses
    getSchoolCourses: builder.query<GetSchoolCoursesResponse, void>({
      query: () => ({
        url: "/course/my-courses",
        method: "GET",
      }),
      providesTags: ["School"],
    }),

    // POST: Create course
    createCourse: builder.mutation<CreateSchoolCourseResponse, FormData>({
      query: (formData) => ({
        url: "/course/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["School"],
    }),

    // PUT: Update course
    updateCourse: builder.mutation<
      UpdateSchoolCourseResponse,
      { courseId: string; data: FormData }
    >({
      query: ({ courseId, data }) => ({
        url: `/course/${courseId}`,
        method: "PATCH",
        body: data,
        params: { courseId },
      }),
      invalidatesTags: ["School"],
    }),

    // DELETE: Delete course
    deleteCourse: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["School"],
    }),
  }),
});

export const {
  useGetSchoolCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = schoolCoursesApi;
