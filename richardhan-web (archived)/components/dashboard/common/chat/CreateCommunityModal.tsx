"use client";

import React, { useState } from "react";
import { X, Camera, Users, Loader2 } from "lucide-react";
import { useCreateCommunityMutation } from "@/redux/features/api/dashboard/common/communityChatApi";
import { useGetFriendsQuery } from "@/redux/features/api/dashboard/common/friendshipApi";
import { useSocket } from "@/providers/SocketProvider";

// ============================================================================
// Types
// ============================================================================
interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (communityId: string) => void;
}

// ============================================================================
// CreateCommunityModal Component
// ============================================================================
export function CreateCommunityModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCommunityModalProps) {
  const { notifyGroupCreated } = useSocket();

  // State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  // API
  const { data: friendsData } = useGetFriendsQuery({ limit: 50 });
  const [createCommunity, { isLoading }] = useCreateCommunityMutation();

  const friends = friendsData?.data?.friends || [];

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Toggle participant selection
  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    if (selectedParticipants.length === 0) {
      setError("Please select at least one participant");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (description.trim()) {
        formData.append("description", description.trim());
      }
      selectedParticipants.forEach((id) => {
        formData.append("participantIds", id);
      });
      if (imageFile) {
        formData.append("file", imageFile);
      }

      const result = await createCommunity(formData).unwrap();
      
      // Notify via socket
      notifyGroupCreated(result.id);

      // Reset form
      setName("");
      setDescription("");
      setSelectedParticipants([]);
      setImageFile(null);
      setImagePreview(null);

      onSuccess(result.id);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create group");
    }
  };

  // Reset form on close
  const handleClose = () => {
    setName("");
    setDescription("");
    setSelectedParticipants([]);
    setImageFile(null);
    setImagePreview(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Group</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image upload */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Group"
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Users size={40} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </label>
          </div>

          {/* Group name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 focus:border-[#FF6B6B] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group about?"
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 focus:border-[#FF6B6B] transition-all resize-none"
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Add Participants <span className="text-red-500">*</span>
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              {friends.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No friends to add
                </div>
              ) : (
                friends.map((friend) => (
                  <label
                    key={friend.userId}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(friend.userId)}
                      onChange={() => toggleParticipant(friend.userId)}
                      className="w-4 h-4 text-[#FF6B6B] border-gray-300 rounded focus:ring-[#FF6B6B]"
                    />
                    {friend.image ? (
                      <img
                        src={friend.image}
                        alt={friend.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white text-sm font-semibold">
                        {friend.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-gray-900">{friend.fullName}</span>
                  </label>
                ))
              )}
            </div>
            {selectedParticipants.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedParticipants.length} participant(s) selected
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-[#FF6B6B] text-white rounded-lg font-medium hover:bg-[#ff5252] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunityModal;
