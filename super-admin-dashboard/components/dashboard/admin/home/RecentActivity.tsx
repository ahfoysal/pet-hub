"use client";

import React from "react";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "REGISTRATION",
    title: "New provider registered",
    description: "Happy Paws Sitting joined as Pet Sitter",
    timestamp: "2 hours ago",
    color: "bg-[#00c950]",
  },
  {
    id: "2",
    type: "KYC_APPROVAL",
    title: "KYC approved",
    description: "Elite Pet Training Academy verification completed",
    timestamp: "4 hours ago",
    color: "bg-[#2b7fff]",
  },
  {
    id: "3",
    type: "PAYOUT",
    title: "Payout released",
    description: "$425.00 to Luxury Pet Resort",
    timestamp: "5 hours ago",
    color: "bg-[#fe9a00]",
  },
];

export const RecentActivity = () => {
  return (
    <div className="bg-white border border-[#e5e7eb] p-[25px] rounded-[14px] h-[494px] w-full flex flex-col gap-[16px]">
      <h3 className="font-['Nunito',sans-serif] font-medium text-[16px] leading-[28px] text-[#282828]">
        Recent Platform Activity
      </h3>
      <div className="flex flex-col gap-[16px] overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-[#f8fafc] p-[16px] rounded-[10px] flex items-start gap-[16px]">
            <div className={`shrink-0 size-[8px] rounded-full mt-[6px] ${activity.color}`} />
            <div className="flex flex-col gap-[2px]">
              <p className="font-['Nunito',sans-serif] font-normal text-[14px] leading-[20px] text-[#0f172b]">
                {activity.title}
              </p>
              <p className="font-['Arial',sans-serif] text-[12px] leading-[16px] text-[#45556c]">
                {activity.description}
              </p>
              <p className="font-['Arial',sans-serif] text-[12px] leading-[16px] text-[#62748e]">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
