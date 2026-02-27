import { baseApi } from "../../../baseApi";

export interface INotification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  data: INotification[];
}

export const vendorNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendorNotifications: builder.query<INotificationResponse, void>({
      query: () => "/notification",
      providesTags: ["Notifications"],
    }),
    markNotificationAsRead: builder.mutation<unknown, string>({
      query: (id: string) => ({
        url: `/notification/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsAsRead: builder.mutation<unknown, void>({
      query: () => ({
        url: "/notification/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetVendorNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = vendorNotificationApi;
