import { baseApi } from "../baseApi";
import {
  GetProfileApiResponse,
  VendorProfileSetupRequest,
  VendorProfileSetupResponse,
} from "@/types/profile/profileSettingsTypes";
import {
  SchoolProfileSetupRequest,
  SchoolProfileSetupResponse,
} from "@/types/profile/school/schoolProfileTypes";
import {
  HotelProfileSetupRequest,
  HotelProfileSetupResponse,
} from "@/types/profile/hotel/hotelProfileTypes";
import {
  SitterProfileSetupRequest,
  SitterProfileSetupResponse,
} from "@/types/profile/sitter/sitterProfileTypes";

export const profileSetupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ===== GET CURRENT USER PROFILE ===== */
    getMyProfile: builder.query<GetProfileApiResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    /* ===== COMPLETE VENDOR PROFILE ===== */
    completeVendorProfile: builder.mutation<
      VendorProfileSetupResponse,
      VendorProfileSetupRequest | FormData
    >({
      query: (body) => ({
        url: "/vendor/profile-setup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    /* ===== COMPLETE SITTER PROFILE ===== */
    completePetSitterProfile: builder.mutation<
      SitterProfileSetupResponse,
      SitterProfileSetupRequest
    >({
      query: (body) => ({
        url: "/pet-sitter/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ===== COMPLETE SCHOOL PROFILE ===== */
    completeSitterProfile: builder.mutation<
      SchoolProfileSetupResponse,
      SchoolProfileSetupRequest | FormData
    >({
      query: (body) => ({
        url: "/pet-school/profile-setup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ===== COMPLETE HOTEL PROFILE ===== */
    completeHotelProfile: builder.mutation<
      HotelProfileSetupResponse,
      HotelProfileSetupRequest | FormData
    >({
      query: (body) => ({
        url: "/pet-hotel/profile-setup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetMyProfileQuery, useCompleteVendorProfileMutation, useCompleteSitterProfileMutation, useCompletePetSitterProfileMutation } =
  profileSetupApi;

// Export the hotel profile mutation hook
export const { useCompleteHotelProfileMutation } = profileSetupApi;
