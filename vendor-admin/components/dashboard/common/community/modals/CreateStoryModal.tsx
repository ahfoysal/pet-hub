"use client";

import React, { useState, useRef } from "react";
import { X, Image, MapPin, Globe, Users, Lock, Loader2 } from "lucide-react";
import { useCreateStoryMutation } from "@/redux/features/api/dashboard/common/communityApi";
import { Visibility } from "@/types/dashboard/community";
import { useToast } from "@/contexts/ToastContext";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateStoryModal({ isOpen, onClose, onSuccess }: CreateStoryModalProps) {
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createStory, { isLoading }] = useCreateStoryMutation();
  const { showToast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      showToast("Please select an image or video", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (location) formData.append("location", location);
    formData.append("visibility", visibility);

    try {
      await createStory(formData).unwrap();
      // Reset form
      setLocation("");
      setVisibility("PUBLIC");
      setSelectedFile(null);
      setPreview(null);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create story:", error);
      showToast("Failed to create story. Please try again.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create Story</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Media Upload */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              className="hidden"
            />
            
            {preview ? (
              <div className="relative aspect-[9/16] max-h-80 mx-auto rounded-xl overflow-hidden bg-black">
                <img
                  src={preview}
                  alt="Story preview"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[9/16] max-h-80 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors"
              >
                <Image size={48} />
                <span className="mt-3 font-medium">Add Photo/Video</span>
                <span className="text-xs mt-1">Stories last for 24 hours</span>
              </button>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (optional)"
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 focus:border-[#FF6B6B]"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Who can see your story?
            </label>
            <div className="flex gap-2">
              {[
                { value: "PUBLIC", icon: Globe, label: "Public" },
                { value: "FRIENDS", icon: Users, label: "Friends" },
                { value: "PRIVATE", icon: Lock, label: "Only Me" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setVisibility(value as Visibility)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                    visibility === value
                      ? "bg-[#FF6B6B] text-white border-[#FF6B6B]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedFile}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              isLoading || !selectedFile
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#FF6B6B] text-white hover:bg-[#ff5252]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Sharing...
              </span>
            ) : (
              "Share to Story"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateStoryModal;
