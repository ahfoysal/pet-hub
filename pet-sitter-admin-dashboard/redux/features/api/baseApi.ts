import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "@/redux/store/store";

// Create a base query with retry mechanism
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1. Initial wait for token if we are likely authenticated but Redux hasn't synced yet
  // This helps prevent 401s during initial page load/refresh
  let token = (api.getState() as RootState).auth.accessToken;
  
  if (!token) {
    // Wait for up to 2 seconds for the token to appear in Redux
    // This gives AuthSync component time to pull it from the session
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      token = (api.getState() as RootState).auth.accessToken;
      if (token) break;
    }
  }

  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  // If we get an unauthorized error, only redirect when a token was actually
  // present but rejected.
  if (result.error && result.error.status === 401) {
    if (token) {
      console.log("Unauthorized (token expired) - redirecting to login");
      const authUrl = (process.env.NEXT_PUBLIC_AUTH_URL || "https://auth-pethub-rnc.vercel.app").replace(/\/$/, "");
      const callbackUrl = encodeURIComponent(window.location.href);
      window.location.href = `${authUrl}/?callbackUrl=${callbackUrl}`;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: retry(baseQueryWithReauth, { maxRetries: 1 }),
  tagTypes: [
    "User",
    "Products",
    "Vendor",
    "VendorPackages",
    "Services",
    "KYC",
    "Variants",
    "MyProducts",
    "Sitter",
    "Stories",
    "Posts",
    "Comments",
    "Hotel",
    "HotelFood",
    "VendorInventory",
    "VendorOrders",
    "School",

    //school
    "AdmissionRequest",
    // Chat & Friendship
    "Friends",
    "FriendRequests",
    "FriendSuggestions",
    "Conversations",
    "CommunityChat",
    "CommunityParticipants",
    "BlockedUsers",
    "MutedUsers",
    "SitterBookings",
    "SitterStats",
    "PlatformSettings",
    "ManageUsers",
    "SitterProfile",
    "SitterDetails",
    "SitterNotifications",
    "SitterBanking",
    "SitterDocuments",
  ],
  endpoints: () => ({}),
});
