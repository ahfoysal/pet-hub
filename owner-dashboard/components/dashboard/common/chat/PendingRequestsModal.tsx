"use client";

import React from "react";
import { X, Check, XCircle, Loader2 } from "lucide-react";
import {
  useGetPendingRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from "@/redux/features/api/dashboard/common/friendshipApi";
import { formatDistanceToNow } from "@/lib/utils/dateUtils";

// ============================================================================
// Types
// ============================================================================
interface PendingRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// PendingRequestsModal Component
// ============================================================================
export function PendingRequestsModal({
  isOpen,
  onClose,
}: PendingRequestsModalProps) {
  // API
  const { data: requestsData, isLoading, refetch } = useGetPendingRequestsQuery({
    limit: 50,
  });
  const [acceptRequest, { isLoading: isAccepting }] = useAcceptFriendRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectFriendRequestMutation();

  const requests = requestsData?.data?.requests || [];
  const totalRequests = requestsData?.data?.totalPendingRequests || 0;

  // Handle accept
  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  // Handle reject
  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest(requestId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to reject request:", error);
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
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Friend Requests</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalRequests} pending request{totalRequests !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[#FF6B6B]" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Check size={32} className="text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">All caught up!</h3>
              <p className="text-xs text-gray-500">No pending friend requests</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  {request.senderImage ? (
                    <img
                      src={request.senderImage}
                      alt={request.senderName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {request.senderName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {request.senderName}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{request.senderEmail}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDistanceToNow(new Date(request.createdAt))}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAccept(request.id)}
                      disabled={isAccepting || isRejecting}
                      className="p-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ff5252] transition-colors disabled:opacity-50"
                      title="Accept"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={isAccepting || isRejecting}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingRequestsModal;
