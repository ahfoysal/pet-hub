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
  valueColor = "text-[#0a0a0a]",
}: StatsCardProps) => {
  return (
    <div className="bg-white border border-[rgba(197,197,197,0.2)] border-solid p-[20px] rounded-[7.749px] flex flex-col justify-between h-[119.328px] flex-[1_0_0] min-w-px min-h-px">
      <div className="flex flex-col gap-[6px]">
        <h3 className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[24px] text-[#4a5565]">
          {title}
        </h3>
        <p className={`font-['Nunito',sans-serif] font-normal text-[24px] leading-[27.895px] opacity-90 ${valueColor}`}>
          {value}
        </p>
      </div>
      
      {trend && (
        <div className="flex items-center gap-[22px] font-normal text-[12px]">
          <p className={`font-['Nunito',sans-serif] leading-[20px] ${
            trendType === "up" ? "text-[#00a63e]" : "text-[#e7000b]"
          }`}>
            {trendType === "up" ? "↑" : "↓"} {trend}
          </p>
          <p className="font-['Nunito',sans-serif] leading-[16px] text-[#155dfc]">
            vs last month
          </p>
        </div>
      )}
    </div>
  );
};
