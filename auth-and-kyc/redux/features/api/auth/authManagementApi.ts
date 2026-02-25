import { baseApi } from "../baseApi";

export const authManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.mutation<any, { code: string }>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),
    changeRole: builder.mutation<any, { role: string }>({
      query: (body) => ({
        url: "/auth/change-role",
        method: "PATCH",
        body,
      }),
    }),
    setRole: builder.mutation<any, { role: string }>({
      query: (body) => ({
        url: "/auth/set-role",
        method: "POST",
        body,
      }),
    }),
    petOwnerSignup: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/pet-owner-signup",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useChangeRoleMutation,
  useSetRoleMutation,
  usePetOwnerSignupMutation,
} = authManagementApi;
