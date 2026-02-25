"use client";

import React from "react";

interface InfoCardProps {
  title: string;
  description: string;
  Icon: React.ElementType;
  iconBg?: string;
  className?: string;
}

export default function InfoCard({
  title,
  description,
  Icon,
  iconBg = "bg-orange-500",
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={`bg-white py-4 px-4 rounded-xl border border-card-border ${className}`}
    >
      <div className="px-4 md:flex items-start space-x-6">
        <div
          className={`mx-auto md:mx-0 w-fit p-3 rounded-lg ${!iconBg?.includes('linear-gradient') ? iconBg : ''}`}
          style={iconBg?.includes('linear-gradient') ? { background: iconBg } : {}}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="pl-0 md:pl-4 ">
          <h3 className="font-semibold text-foreground text-lg md:text-xl space-y-2 md:space-y-0 text-center md:text-left space-x-2 ">
            {title}
          </h3>
          <p className="text-sm  text-center md:text-left relaxed md:text-base text-[#4A5565] pt-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
