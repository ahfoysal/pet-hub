"use client";

import React from "react";
import { UserAvatar } from "../common/UserAvatar";
import { MapPin } from "lucide-react";

interface StoryAvatarProps {
  user: {
    fullName: string;
    image: string | null;
  };
  isViewed?: boolean;
  location?: string;
  onClick?: () => void;
  remainingHours?: number;
}

export function StoryAvatar({
  user,
  isViewed = false,
  location,
  onClick,
  remainingHours,
}: StoryAvatarProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 focus:outline-none transition-transform hover:scale-105"
    >
      <div className="relative">
        <UserAvatar
          src={user.image}
          alt={user.fullName}
          size="lg"
          showStoryRing={true}
          isViewed={isViewed}
        />
        {remainingHours !== undefined && remainingHours > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-[#FF6B6B] text-white text-[8px] font-bold px-1 rounded-full border border-white">
            {Math.floor(remainingHours)}h
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center max-w-[72px]">
        <span className="text-[10px] font-semibold text-gray-800 truncate w-full text-center">
          {user.fullName.split(" ")[0]}
        </span>
        {location && (
          <div className="flex items-center gap-0.5 text-gray-400">
            <MapPin size={8} />
            <span className="text-[8px] truncate max-w-[50px]">{location}</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default StoryAvatar;
