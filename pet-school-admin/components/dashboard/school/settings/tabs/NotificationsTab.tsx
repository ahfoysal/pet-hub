/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface NotificationsTabProps {
  formData: any;
  onChange: (e: any) => void;
  onToggle: (name: string, checked: boolean) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export default function NotificationsTab({ formData, onChange, onToggle, onSave, isUpdating }: NotificationsTabProps) {
  const notificationItems = [
    { id: "newBookings", label: "New Bookings", desc: "Get notified when you receive a new enrollment" },
    { id: "checkInReminders", label: "Class Reminders", desc: "Receive alerts for upcoming classes" },
    { id: "paymentUpdates", label: "Payment Updates", desc: "Get notified when payments are released" },
    { id: "adminMessages", label: "Admin Messages", desc: "Receive important messages from administrators" },
    { id: "bookingCancellations", label: "Cancellations", desc: "Get notified when enrollments are cancelled" },
  ];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[14px] p-[25px] shadow-sm animate-in fade-in duration-300">
      <h2 className="text-[20px] font-normal text-[#0a0a0a] mb-8 font-arimo">Notification Preferences</h2>
      
      <div className="space-y-4">
        {notificationItems.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between px-4 py-[16px] min-h-[82px] border border-[#e5e7eb] rounded-[10px] bg-white transition-all shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <h4 className="font-normal text-[#0a0a0a] text-[16px] leading-[24px]">{item.label}</h4>
              <p className="text-[14px] text-[#4a5565] leading-[20px]">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input 
                type="checkbox" 
                name={item.id} 
                checked={formData[item.id] ?? true} 
                onChange={(e) => onToggle(item.id, e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-[44px] h-[24px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[20px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-[#ff7176]"></div>
            </label>
          </div>
        ))}
      </div>

      <button 
        onClick={onSave}
        disabled={isUpdating}
        className="mt-8 w-[167px] h-[40px] bg-[#ff7176] text-white rounded-[10px] text-[16px] font-normal hover:bg-[#ff7176]/90 transition-all shadow-sm flex items-center justify-center gap-2"
      >
        {isUpdating && <Loader2 size={18} className="animate-spin" />}
        Save Preferences
      </button>
    </div>
  );
}
