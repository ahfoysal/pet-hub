"use client";

import React, { useState } from "react";
import { X, Camera, Loader2, UserPlus, UserMinus, Settings, Trash2 } from "lucide-react";
import {
  useGetCommunityParticipantsQuery,
  useUpdateCommunityDetailsMutation,
  useUpdateCommunityImageMutation,
  useAddPeopleToCommunityMutation,
  useRemovePeopleFromCommunityMutation,
} from "@/redux/features/api/dashboard/common/communityChatApi";
import { useGetFriendsQuery } from "@/redux/features/api/dashboard/common/friendshipApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CommunityDetail } from "@/types/dashboard/chat";

// ============================================================================
// Types
// ============================================================================
interface CommunitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: CommunityDetail;
}

// ============================================================================
// CommunitySettingsModal Component
// ============================================================================
export function CommunitySettingsModal({
  isOpen,
  onClose,
  community,
}: CommunitySettingsModalProps) {
  // State
  const [activeTab, setActiveTab] = useState<"info" | "members">("info");
  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Redux
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isCreator = community.creatorId === currentUser?._id;

  // API
  const { data: participantsData, refetch: refetchParticipants } =
    useGetCommunityParticipantsQuery(community.id);
  const { data: friendsData } = useGetFriendsQuery({ limit: 50 });
  const [updateDetails, { isLoading: isUpdatingDetails }] = useUpdateCommunityDetailsMutation();
  const [updateImage, { isLoading: isUpdatingImage }] = useUpdateCommunityImageMutation();
  const [addPeople, { isLoading: isAdding }] = useAddPeopleToCommunityMutation();
  const [removePeople, { isLoading: isRemoving }] = useRemovePeopleFromCommunityMutation();

  const participants = participantsData?.data || [];
  const friends = friendsData?.data?.friends || [];

  // Get friends not in community
  const availableFriends = friends.filter(
    (friend) => !participants.some((p) => p.id === friend.userId)
  );

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle save details
  const handleSaveDetails = async () => {
    try {
      if (name !== community.name || description !== community.description) {
        await updateDetails({
          communityId: community.id,
          name: name.trim(),
          description: description.trim(),
        }).unwrap();
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await updateImage({
          communityId: community.id,
          formData,
        }).unwrap();
      }

      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to update community:", error);
    }
  };

  // Handle add members
  const handleAddMembers = async () => {
    if (selectedFriends.length === 0) return;

    try {
      await addPeople({
        communityId: community.id,
        participantIds: selectedFriends,
      }).unwrap();
      setSelectedFriends([]);
      setShowAddMembers(false);
      refetchParticipants();
    } catch (error) {
      console.error("Failed to add members:", error);
    }
  };

  // Handle remove member
  const handleRemoveMember = async (userId: string) => {
    try {
      await removePeople({
        communityId: community.id,
        participantId: userId,
      }).unwrap();
      refetchParticipants();
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  // Toggle friend selection
  const toggleFriend = (userId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Group Settings</h2>
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
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "info"
                ? "text-[#FF6B6B] border-b-2 border-[#FF6B6B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings size={16} className="inline mr-2" />
            Details
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "members"
                ? "text-[#FF6B6B] border-b-2 border-[#FF6B6B]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <UserPlus size={16} className="inline mr-2" />
            Members ({participants.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "info" && (
            <div className="space-y-5">
              {/* Image */}
              <div className="flex justify-center">
                <label className={`relative group ${isCreator ? "cursor-pointer" : ""}`}>
                  {isCreator && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  )}
                  <img
                    src={imagePreview || community.image || ""}
                    alt={community.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  {isCreator && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                  )}
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Group Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isCreator}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 focus:border-[#FF6B6B] transition-all disabled:opacity-50"
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
                  disabled={!isCreator}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 focus:border-[#FF6B6B] transition-all resize-none disabled:opacity-50"
                />
              </div>

              {/* Save button */}
              {isCreator && (
                <button
                  onClick={handleSaveDetails}
                  disabled={isUpdatingDetails || isUpdatingImage}
                  className="w-full py-2.5 bg-[#FF6B6B] text-white rounded-lg font-medium hover:bg-[#ff5252] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(isUpdatingDetails || isUpdatingImage) && (
                    <Loader2 size={18} className="animate-spin" />
                  )}
                  Save Changes
                </button>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-4">
              {/* Add members button */}
              {isCreator && (
                <button
                  onClick={() => setShowAddMembers(!showAddMembers)}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg font-medium hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Add Members
                </button>
              )}

              {/* Add members panel */}
              {showAddMembers && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {availableFriends.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">
                        All your friends are already in this group
                      </p>
                    ) : (
                      availableFriends.map((friend) => (
                        <label
                          key={friend.userId}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFriends.includes(friend.userId)}
                            onChange={() => toggleFriend(friend.userId)}
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
                  {selectedFriends.length > 0 && (
                    <button
                      onClick={handleAddMembers}
                      disabled={isAdding}
                      className="w-full py-2 bg-[#FF6B6B] text-white rounded-lg text-sm font-medium hover:bg-[#ff5252] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isAdding && <Loader2 size={16} className="animate-spin" />}
                      Add {selectedFriends.length} Member(s)
                    </button>
                  )}
                </div>
              )}

              {/* Members list */}
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {participant.image ? (
                      <img
                        src={participant.image}
                        alt={participant.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-semibold">
                        {participant.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {participant.fullName}
                        {participant.id === community.creatorId && (
                          <span className="ml-2 text-xs bg-[#FF6B6B]/10 text-[#FF6B6B] px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </h4>
                    </div>
                    {isCreator && participant.id !== currentUser?._id && (
                      <button
                        onClick={() => handleRemoveMember(participant.id)}
                        disabled={isRemoving}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunitySettingsModal;
