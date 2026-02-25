"use client";

import React, { useState, useRef } from "react";
import { X, Image, MapPin, Globe, Users, Lock, Loader2 } from "lucide-react";
import { useCreatePostMutation } from "@/redux/features/api/dashboard/common/communityApi";
import { Visibility } from "@/types/dashboard/community";
import { useToast } from "@/contexts/ToastContext";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [isCommentAllowed, setIsCommentAllowed] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPost, { isLoading }] = useCreatePostMutation();
  const { showToast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      
      // Create previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      showToast("Please select at least one image or video", "warning");
      return;
    }

    const formData = new FormData();
    if (caption) formData.append("caption", caption);
    if (location) formData.append("location", location);
    formData.append("visibility", visibility);
    formData.append("isCommentAllowed", String(isCommentAllowed));
    formData.append("isShareToStory", "false");
    
    
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await createPost(formData).unwrap();
      // Reset form
      setCaption("");
      setLocation("");
      setVisibility("PUBLIC");
      setIsCommentAllowed(true);
      setSelectedFiles([]);
      setPreviews([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
      showToast("Failed to create post. Please try again.", "error");
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
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Caption */}
          <div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 focus:border-[#FF6B6B]"
              rows={3}
            />
          </div>

          {/* Media Upload */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
            
            {previews.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500"
                >
                  <Image size={24} />
                  <span className="text-xs mt-1">Add More</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors"
              >
                <Image size={32} />
                <span className="mt-2 font-medium">Add Photos/Videos</span>
                <span className="text-xs mt-1">Click to upload</span>
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
              placeholder="Add location"
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 focus:border-[#FF6B6B]"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Who can see this post?
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

          {/* Comments Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Allow comments</span>
            <button
              onClick={() => setIsCommentAllowed(!isCommentAllowed)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isCommentAllowed ? "bg-[#FF6B6B]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isCommentAllowed ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={isLoading || selectedFiles.length === 0}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              isLoading || selectedFiles.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#FF6B6B] text-white hover:bg-[#ff5252]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Posting...
              </span>
            ) : (
              "Share Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;
