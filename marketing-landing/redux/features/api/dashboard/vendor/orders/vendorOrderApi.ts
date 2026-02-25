import { VendorOrdersResponse } from "@/types/dashboard/vendor/vendorOrderType";
import { baseApi } from "../../../baseApi";

export const vendorOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorOrders: builder.query<VendorOrdersResponse, void>({
      query: () => ({
        url: "/order/vendor",
        method: "GET",
      }),
      providesTags: ["VendorOrders"],
    }),
  }),
});

export const { useGetVendorOrdersQuery } = vendorOrdersApi;
