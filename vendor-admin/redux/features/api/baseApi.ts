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
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      headers.set("ngrok-skip-browser-warning", "true");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  // If we get an unauthorized error, only redirect when a token was actually
  // present but rejected.  During page reload the session is still hydrating
  // and accessToken is null – that 401 is expected and should NOT trigger a
  // redirect. Only a genuinely expired/invalid token warrants a logout.
  if (result.error && result.error.status === 401) {
    const token = (api.getState() as RootState).auth.accessToken;
    if (token) {
      console.log("Unauthorized (token expired) - redirecting to login");
      const authUrl = (process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000").replace(/\/$/, "");
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
    "PlatformSettings",
    "ManageUsers",
    "VendorNotifications",
    "VendorBanking",
    "VendorDocuments",
    "VendorFinance",
    "Reviews",
    "ReviewStats",
    "Notifications",
  ],
  endpoints: () => ({}),
});
