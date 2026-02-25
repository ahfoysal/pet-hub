"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendType?: "up" | "down";
  valueColor?: string;
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  trend,
  trendType = "up",
  valueColor = "text-[#4a5565]",
}: StatsCardProps) => {
  return (
    <div className="bg-white border border-[rgba(197,197,197,0.2)] border-solid p-[20px] rounded-[7.749px] flex flex-col justify-between h-[119.328px] w-full min-w-px min-h-px shadow-sm">
      <div className="flex flex-col gap-[6px]">
        <h3 className="font-['Nunito',sans-serif] font-medium text-[20px] leading-[24px] text-[#282828]">
          {title}
        </h3>
        <p className={`font-['Nunito',sans-serif] font-bold text-[24px] leading-[27.895px] ${valueColor}`}>
          {value}
        </p>
      </div>
      
      {trend && (
        <div className="flex items-center gap-[22px] font-normal text-[12px] leading-[20px]">
          <p className={
            trendType === "up" ? "text-[#00a63e]" : "text-[#e7000b]"
          }>
            {trendType === "up" ? "↑" : "↓"} {trend}
          </p>
          <p className="text-[#62748e]">
            vs last month
          </p>
        </div>
      )}
    </div>
  );
};
