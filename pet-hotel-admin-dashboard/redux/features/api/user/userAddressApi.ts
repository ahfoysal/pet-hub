import { baseApi } from "../baseApi";

export const userAddressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserAddresses: builder.query<any, void>({
      query: () => "/address",
      providesTags: ["User"],
    }),
    getAddressById: builder.query<any, string>({
      query: (id) => `/address/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createAddress: builder.mutation<any, any>({
      query: (body) => ({
        url: "/address",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateAddress: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/address/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "User",
        { type: "User", id },
      ],
    }),
    deleteAddress: builder.mutation<any, string>({
      query: (id) => ({
        url: `/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = userAddressApi;
