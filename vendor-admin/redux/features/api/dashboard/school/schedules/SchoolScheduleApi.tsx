import { NextSchedulesResponse } from "@/types/dashboard/school/SchoolScheduleTypes";
import { baseApi } from "../../../baseApi";

export const SchoolScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolSchedules: builder.query<NextSchedulesResponse, void>({
      query: () => ({
        url: "/course/next-schedules",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSchoolSchedulesQuery } = SchoolScheduleApi;
