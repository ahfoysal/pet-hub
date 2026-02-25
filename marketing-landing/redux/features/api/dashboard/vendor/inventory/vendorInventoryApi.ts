import { baseApi } from "../../../baseApi";
import type { VendorInventoryResponse } from "@/types/dashboard/vendor/vendorInventoryType";

export const vendorInventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorInventory: builder.query<VendorInventoryResponse, void>({
      query: () => ({
        url: "/vendor/dashboard/inventory",
        method: "GET",
      }),
      providesTags: ["VendorInventory"],
    }),
  }),
});

export const { useGetVendorInventoryQuery } = vendorInventoryApi;
