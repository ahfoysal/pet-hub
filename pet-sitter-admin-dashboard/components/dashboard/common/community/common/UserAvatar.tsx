"use client";

import React from "react";

interface UserAvatarProps {
  src: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showStoryRing?: boolean;
  isViewed?: boolean;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const ringClasses = {
  xs: "p-0.5",
  sm: "p-0.5",
  md: "p-[2px]",
  lg: "p-[3px]",
  xl: "p-1",
};

const onlineIndicatorClasses = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-4 h-4 border-2",
};

export function UserAvatar({
  src,
  alt,
  size = "md",
  showStoryRing = false,
  isViewed = false,
  showOnlineIndicator = false,
  isOnline = false,
  className = "",
  onClick,
}: UserAvatarProps) {
  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarContent = (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-gray-600 font-medium text-xs">
          {getInitials(alt)}
        </span>
      )}
    </div>
  );

  const containerClasses = `
    relative inline-flex items-center justify-center flex-shrink-0
    ${onClick ? "cursor-pointer" : ""}
    ${className}
  `;

  if (showStoryRing) {
    return (
      <div className={containerClasses} onClick={onClick}>
        <div
          className={`
            rounded-full ${ringClasses[size]}
            ${
              isViewed
                ? "bg-gray-300"
                : "bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500"
            }
          `}
        >
          <div className="bg-white rounded-full p-[2px]">{avatarContent}</div>
        </div>
        {showOnlineIndicator && (
          <span
            className={`
              absolute bottom-0 right-0 rounded-full border-white
              ${onlineIndicatorClasses[size]}
              ${isOnline ? "bg-green-500" : "bg-gray-400"}
            `}
          />
        )}
      </div>
    );
  }

  return (
    <div className={containerClasses} onClick={onClick}>
      {avatarContent}
      {showOnlineIndicator && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full border-white
            ${onlineIndicatorClasses[size]}
            ${isOnline ? "bg-green-500" : "bg-gray-400"}
          `}
        />
      )}
    </div>
  );
}

export default UserAvatar;
