"use client";

import React from "react";
import { Globe, Users, Lock } from "lucide-react";
import { Visibility } from "@/types/dashboard/community";

interface VisibilityBadgeProps {
  visibility: Visibility;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

const visibilityConfig = {
  PUBLIC: {
    icon: Globe,
    label: "Public",
    color: "text-green-600 bg-green-50",
  },
  FRIENDS: {
    icon: Users,
    label: "Friends",
    color: "text-blue-600 bg-blue-50",
  },
  PRIVATE: {
    icon: Lock,
    label: "Private",
    color: "text-gray-600 bg-gray-100",
  },
};

export function VisibilityBadge({
  visibility,
  showLabel = true,
  size = "sm",
  className = "",
}: VisibilityBadgeProps) {
  const config = visibilityConfig[visibility];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full
        ${config.color}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <Icon size={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export default VisibilityBadge;
