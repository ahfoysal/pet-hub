"use client";

import { Bell, Clock, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  useGetVendorNotificationsQuery, 
  useMarkAllNotificationsAsReadMutation, 
  useMarkNotificationAsReadMutation 
} from "@/redux/features/api/dashboard/vendor/notifications/notificationApi";

interface NotificationPopoverProps {
  onClose: () => void;
}

export default function NotificationPopover({ onClose }: NotificationPopoverProps) {
  const { data: response, isLoading } = useGetVendorNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const notifications = response?.data || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(id);
    }
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

  return (
    <div className="absolute right-[-80px] sm:right-0 mt-3 w-[360px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 z-[120] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
           <h3 className="font-bold text-[#101828] text-lg font-inter">Notifications</h3>
           {unreadCount > 0 && (
             <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
               {unreadCount}
             </span>
           )}
        </div>
        <button 
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="text-primary text-xs font-semibold hover:underline font-inter disabled:opacity-50 disabled:hover:no-underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id, notification.isRead)}
              className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                !notification.isRead ? "bg-blue-50/30" : ""
              }`}
            >
              {!notification.isRead && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
              )}
              <div className="flex gap-3">
                <div className={`p-2 rounded-full shrink-0 ${
                  notification.type === 'order' ? 'bg-orange-100 text-orange-600' :
                  notification.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                  notification.type === 'inventory' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Bell size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#101828] font-inter">
                    {notification.title}
                  </p>
                  <p className="text-xs text-[#4a5565] leading-relaxed font-inter">
                    {notification.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#6a7282] font-medium font-inter">
                    <Clock size={12} />
                    <span>{formatTime(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm font-inter">No new notifications</p>
          </div>
        )}
      </div>

      <Link
        href="/vendor/settings" 
        className="block p-3 text-center border-t border-gray-50 hover:bg-gray-50 transition-colors"
        onClick={onClose}
      >
        <span className="text-sm font-bold text-primary flex items-center justify-center gap-2 font-inter">
          Notification Settings
          <ExternalLink size={14} />
        </span>
      </Link>
    </div>
  );
}
