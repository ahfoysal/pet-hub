"use client";

import React from "react";
import { UserAvatar } from "../common/UserAvatar";
import { TimeAgo } from "../common/TimeAgo";
import { User, Visibility } from "@/types/dashboard/community";
import { Globe, Users, Lock } from "lucide-react";

interface PostHeaderProps {
  user: User;
  createdAt: string;
  onUserClick?: () => void;
  visibility?: Visibility;
}

export function PostHeader({
  user,
  createdAt,
  onUserClick,
  visibility = "PUBLIC",
}: PostHeaderProps) {
  // Ensure visibility is handled correctly and defaults to PUBLIC if missing
  const vis = (visibility || "PUBLIC").toString().toUpperCase().trim();
  
  // Robust mapping for visibility icons
  const isPrivate = vis === "PRIVATE" || vis === "ONLY_ME" || vis === "ONLY-ME" || vis === "ONLY ME" || vis === "PERSONAL";
  const isFriends = vis === "FRIENDS" || vis === "FOLLOWER" || vis === "FOLLOWERS";
  
  const VisibilityIcon = isFriends ? Users : isPrivate ? Lock : Globe;
  
  return (
    <div className="flex items-center justify-between">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <UserAvatar
          src={user?.image}
          alt={user?.fullName}
          size="md"
          onClick={onUserClick}
          className="cursor-pointer"
        />
        <div>
          <button
            onClick={onUserClick}
            className="font-semibold text-gray-900 hover:text-gray-700 transition-colors text-sm"
          >
            {user?.fullName}
          </button>
          <div className="flex items-center gap-2">
            {user?.userName && (
              <span className="text-gray-500 text-xs">@{user.userName}</span>
            )}
            <span className="text-gray-400 text-xs">•</span>
            <TimeAgo date={createdAt} className="text-xs" />
            <span className="text-gray-400 text-xs">•</span>
            <div title={visibility}>
              <VisibilityIcon size={12} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
