import { baseApi } from "@/redux/features/api/baseApi";

export const ownerOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerOrders: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/order/owner",
        params,
      }),
      providesTags: ["VendorOrders"], // Tag matching vendor side for potential cross-client invalidation
    }),
    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/order/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["VendorOrders"],
    }),
  }),
});

export const { useGetOwnerOrdersQuery, useUpdateOrderStatusMutation } =
  ownerOrderApi;
