import { DashboardChartsResponse } from "@/types/dashboard/school/SchoolDashboardTypes";
import { baseApi } from "../../../baseApi";

export const schoolDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolDashboardResponse: builder.query<DashboardChartsResponse, void>({
      query: () => ({
        url: "/pet-school/dashboard",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSchoolDashboardResponseQuery } = schoolDashboardApi;
