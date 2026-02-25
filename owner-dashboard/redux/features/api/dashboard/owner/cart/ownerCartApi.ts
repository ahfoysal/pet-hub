import { baseApi } from "@/redux/features/api/baseApi";

export const ownerCartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<any, void>({
      query: () => "/cart",
      providesTags: ["Products"], // Revalidate products if needed
    }),
    clearCart: builder.mutation<any, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    addCartItem: builder.mutation<any, { productId: string; quantity: number }>(
      {
        query: (data) => ({
          url: "/cart/items",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Products"],
      },
    ),
    updateCartItem: builder.mutation<any, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Products"],
    }),
    deleteCartItem: builder.mutation<any, string>({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useClearCartMutation,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} = ownerCartApi;
