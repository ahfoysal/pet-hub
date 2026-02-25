import { baseApi } from "../../../baseApi";

interface ProductResponse {
  success: boolean;
  message: string;
  data: any;
}

interface ProductsListResponse {
  success: boolean;
  message: string;
  data: {
    data: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export const vendorProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get my products
    getMyProducts: builder.query<
      ProductsListResponse,
      { limit: number; page: number }
    >({
      query: ({ limit, page }) => ({
        url: "/product/my-products",
        method: "GET",
        params: { limit, page },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({
                type: "Products" as const,
                id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // Get single product
    getProduct: builder.query<
      ProductResponse,
      { productId: string; limit?: number; page?: number }
    >({
      query: ({ productId, limit, page }) => ({
        url: "/product",
        method: "GET",
        params: { productId, limit, page },
      }),
      providesTags: (result, error, { productId }) => [
        { type: "Products", id: productId },
      ],
    }),

    // Create product
    createProduct: builder.mutation<ProductResponse, FormData>({
      query: (formData) => ({
        url: "/product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    // Update product
    updateProduct: builder.mutation<
      ProductResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<ProductResponse, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    // Create variant
    createVariant: builder.mutation<ProductResponse, FormData>({
      query: (formData) => ({
        url: "/variant",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, body) => {
        const productId = body.get("productId") as string;
        return [
          { type: "Products", id: productId },
          { type: "Products", id: "LIST" },
        ];
      },
    }),

    // Get product with variant
    getProductWithVariant: builder.query<
      ProductResponse,
      { productId: string; variantId: string }
    >({
      query: ({ productId, variantId }) => ({
        url: `/variant/${productId}/${variantId}`,
        method: "GET",
      }),
      providesTags: (result, error, { productId, variantId }) => [
        { type: "Products", id: productId },
        { type: "Products", id: variantId },
      ],
    }),

    // Update variant
    updateVariant: builder.mutation<
      ProductResponse,
      { variantId: string; formData: FormData }
    >({
      query: ({ variantId, formData }) => ({
        url: `/variant/${variantId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { variantId }) => [
        { type: "Products", id: "LIST" }, // We don't know the productId easily here, so invalidate list
      ],
    }),
  }),
});

export const {
  useGetMyProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateVariantMutation,
  useGetProductWithVariantQuery,
  useUpdateVariantMutation,
} = vendorProductsApi;
