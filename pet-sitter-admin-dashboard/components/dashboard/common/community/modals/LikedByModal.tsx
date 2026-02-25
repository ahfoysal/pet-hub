"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";
import { UserAvatar } from "../common/UserAvatar";
import { useGetPostLikedByQuery } from "@/redux/features/api/dashboard/common/communityApi";

interface LikedByModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export function LikedByModal({ isOpen, onClose, postId }: LikedByModalProps) {
  const { data, isLoading } = useGetPostLikedByQuery(postId, {
    skip: !isOpen || !postId,
  });

  if (!isOpen) return null;

  const likedUsers = data?.data?.users || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 max-h-[70vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Likes</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
              <Loader2 className="animate-spin" size={24} />
              <p className="text-sm">Loading likes...</p>
            </div>
          ) : likedUsers.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="text-sm">No likes yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {likedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar src={user.image} alt={user.fullName} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {user.fullName}
                      </p>
                      {user.userName && (
                        <p className="text-xs text-gray-500">@{user.userName}</p>
                      )}
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-blue-500 hover:text-blue-600 px-3 py-1.5 bg-blue-50 rounded-lg">
                    Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LikedByModal;
