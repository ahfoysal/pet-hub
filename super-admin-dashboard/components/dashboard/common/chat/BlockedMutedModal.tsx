"use client";

import React from "react";
import { X, RefreshCw, Loader2 } from "lucide-react";
import {
  useGetBlockedUsersQuery,
  useGetMutedUsersQuery,
  useUnblockUserMutation,
  useUnmuteUserMutation,
} from "@/redux/features/api/dashboard/common/userBlockMuteApi";

// ============================================================================
// Types
// ============================================================================
interface BlockedMutedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// BlockedMutedModal Component
// ============================================================================
export function BlockedMutedModal({ isOpen, onClose }: BlockedMutedModalProps) {
  const [activeTab, setActiveTab] = React.useState<"blocked" | "muted">("blocked");

  // API
  const { data: blockedData, isLoading: isLoadingBlocked, refetch: refetchBlocked } =
    useGetBlockedUsersQuery({});
  const { data: mutedData, isLoading: isLoadingMuted, refetch: refetchMuted } =
    useGetMutedUsersQuery({});
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();
  const [unmuteUser, { isLoading: isUnmuting }] = useUnmuteUserMutation();

  const blockedUsers = blockedData?.data?.result || [];
  const mutedUsers = mutedData?.data?.data || [];

  // Handle unblock
  const handleUnblock = async (userId: string) => {
    try {
      await unblockUser(userId).unwrap();
      refetchBlocked();
    } catch (error) {
      console.error("Failed to unblock user:", error);
    }
  };

  // Handle unmute
  const handleUnmute = async (userId: string) => {
    try {
      await unmuteUser(userId).unwrap();
      refetchMuted();
    } catch (error) {
      console.error("Failed to unmute user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Manage Users</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("blocked")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "blocked"
                ? "text-[#FF6B6B] border-b-2 border-[#FF6B6B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Blocked ({blockedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("muted")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "muted"
                ? "text-[#FF6B6B] border-b-2 border-[#FF6B6B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Muted ({mutedUsers.length})
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === "blocked" && (
            <>
              {isLoadingBlocked ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-[#FF6B6B]" />
                </div>
              ) : blockedUsers.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-500">No blocked users</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {blockedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{user.fullName}</h4>
                        {user.email && (
                          <p className="text-xs text-gray-500">{user.email}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleUnblock(user.id)}
                        disabled={isUnblocking}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "muted" && (
            <>
              {isLoadingMuted ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-[#FF6B6B]" />
                </div>
              ) : mutedUsers.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-500">No muted users</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {mutedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{user.fullName}</h4>
                      </div>
                      <button
                        onClick={() => handleUnmute(user.id)}
                        disabled={isUnmuting}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Unmute
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlockedMutedModal;
