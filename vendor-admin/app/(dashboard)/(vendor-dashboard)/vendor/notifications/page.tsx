"use client";

import React, { useState } from "react";
import { Bell, Clock, Trash2, CheckCircle2, AlertCircle, Package, Star, Filter, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  useGetVendorNotificationsQuery, 
  useMarkAllNotificationsAsReadMutation, 
  useMarkNotificationAsReadMutation 
} from "@/redux/features/api/dashboard/vendor/notifications/notificationApi";

export default function VendorNotificationsPage() {
  const { data: response, isLoading } = useGetVendorNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications = response?.data || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    if (unreadCount > 0) {
      await markAllAsRead();
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package size={20} className="text-orange-600" />;
      case "review":
        return <Star size={20} className="text-yellow-600" />;
      case "inventory":
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Bell size={20} className="text-blue-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "order": return "bg-orange-100";
      case "review": return "bg-yellow-100";
      case "inventory": return "bg-red-100";
      default: return "bg-blue-100";
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#101828] font-inter">Notifications</h1>
          <p className="text-sm text-[#475467] font-inter mt-1">
            Manage your alerts for orders, reviews, and inventory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === "all" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                filter === "unread" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="bg-primary text-white text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
          >
            <CheckCircle2 size={16} />
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm font-medium font-inter">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex flex-col sm:flex-row sm:items-start gap-4 p-5 sm:p-6 transition-colors group ${
                  !notification.isRead ? "bg-blue-50/20" : "hover:bg-gray-50"
                }`}
              >
                <div className={`p-3 rounded-full shrink-0 ${getIconBg(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
                    <h3 className={`text-base font-inter ${!notification.isRead ? "font-bold text-[#101828]" : "font-semibold text-gray-800"}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6a7282] font-medium font-inter shrink-0">
                      <Clock size={14} />
                      <span>{formatTime(notification.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-[#4a5565] text-sm leading-relaxed font-inter pr-0 sm:pr-8">
                    {notification.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-2 sm:mt-0">
                  {!notification.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 text-primary hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                      title="Mark as read"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  {/* Additional actions (e.g., delete) can be added here */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Bell size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#101828] mb-1 font-inter">No Notifications</h3>
            <p className="text-[#475467] max-w-sm font-inter">
              {filter === "unread" 
                ? "You have read all your notifications. You're all caught up!"
                : "When you get orders, reviews, or important system alerts, they'll show up here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
