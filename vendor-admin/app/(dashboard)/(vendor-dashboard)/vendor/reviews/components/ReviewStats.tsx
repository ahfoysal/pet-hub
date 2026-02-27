"use client";

import React from "react";
import { MessageCircle, Clock, CheckCircle2, Flag, Star } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  valueColor?: string;
  isRating?: boolean;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  iconColor,
  valueColor = "text-[#101828]",
  isRating = false,
}: StatCardProps) => (
  <div className="bg-white border border-[#dbdbdb] rounded-[14px] p-6 flex items-center justify-between min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
    <div className="space-y-1">
      <p className="text-[#4a5565] text-sm font-medium font-inter">{label}</p>
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold font-inter ${valueColor}`}>{value}</span>
        {isRating && <Star size={20} className="text-yellow-400 fill-yellow-400" />}
      </div>
    </div>
    <div className="flex items-center justify-center">
        <Icon size={32} className={iconColor} strokeWidth={1.5} />
    </div>
  </div>
);

interface ReviewStatsProps {
  total: number;
  pending: number;
  replied: number;
  flagged: number;
  avgRating: string | number;
}

export default function ReviewStats({ total, pending, replied, flagged, avgRating }: ReviewStatsProps) {
  const stats = [
    { label: "Total Reviews", value: total, icon: MessageCircle, iconColor: "text-blue-500" },
    { label: "Pending", value: pending, icon: Clock, iconColor: "text-[#f54900]", valueColor: "text-[#f54900]" },
    { label: "Replied", value: replied, icon: CheckCircle2, iconColor: "text-[#00a63e]", valueColor: "text-[#00a63e]" },
    { label: "Flagged", value: flagged, icon: Flag, iconColor: "text-[#e7000b]", valueColor: "text-[#e7000b]" },
    { label: "Avg Rating", value: avgRating, icon: Star, iconColor: "text-yellow-400 fill-yellow-400", isRating: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
