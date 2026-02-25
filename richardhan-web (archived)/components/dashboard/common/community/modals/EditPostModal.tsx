"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Image, MapPin, Globe, Users, Lock, Loader2 } from "lucide-react";
import { useEditPostMutation, useGetPostQuery } from "@/redux/features/api/dashboard/common/communityApi";
import { Post, Visibility } from "@/types/dashboard/community";
import { useToast } from "@/contexts/ToastContext";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onSuccess?: () => void;
}

export function EditPostModal({ isOpen, onClose, post, onSuccess }: EditPostModalProps) {
  const { data: fullPostData } = useGetPostQuery(post.id, {
    skip: !isOpen || !post.id,
  });

  const fullPost = fullPostData?.data;

  // Fetch the latest post data to ensure settings are in sync
  const { data: latestPostData } = useGetPostQuery(post.id);
  const currentPost = latestPostData?.data || post;

  const [caption, setCaption] = useState(currentPost.caption || "");
  const [location, setLocation] = useState(currentPost.location || "");
  const [visibility, setVisibility] = useState<Visibility>(currentPost.visibility || "PUBLIC");
  const [isCommentAllowed, setIsCommentAllowed] = useState(currentPost.isCommentAllowed ?? true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [removedMediaLinks, setRemovedMediaLinks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editPost, { isLoading }] = useEditPostMutation();
  const { showToast } = useToast();

  // Update state when initial post prop changes
  useEffect(() => {
    if (post) {
      setCaption(post.caption || "");
      setLocation(post.location || "");
      setVisibility(post.visibility || "PUBLIC");
      setIsCommentAllowed(post.isCommentAllowed ?? true);
      setRemovedMediaLinks([]);
      setSelectedFiles([]);
      setPreviews([]);
    }
  }, [post]);

  // Sync state when fullPostData arrives (for high-fidelity settings)
  useEffect(() => {
    if (fullPost && isOpen) {
      console.log(`[EditPostModal] Loaded visibility: ${fullPost.visibility}`);
      if (fullPost.caption) setCaption(fullPost.caption);
      if (fullPost.location) setLocation(fullPost.location);
      if (fullPost.visibility) {
        // Normalize visibility to uppercase for UI matching
        const normalized = fullPost.visibility.toString().toUpperCase().trim() as Visibility;
        setVisibility(normalized);
      }
      if (fullPost.isCommentAllowed !== undefined) {
        setIsCommentAllowed(fullPost.isCommentAllowed);
      }
    }
  }, [fullPost, isOpen]);

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

  const removeNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (link: string) => {
    setRemovedMediaLinks((prev) => [...prev, link]);
  };

  const undoRemoveExistingMedia = (link: string) => {
    setRemovedMediaLinks((prev) => prev.filter((l) => l !== link));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("visibility", visibility);
    formData.append("isCommentAllowed", String(isCommentAllowed));
    console.log("[EditPost] Sending visibility:", visibility);
    
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    removedMediaLinks.forEach((link) => {
      formData.append("removedMediaLinks", link);
    });

    try {
      await editPost({ postId: post.id, formData }).unwrap();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to edit post:", error);
      showToast("Failed to update post. Please try again.", "error");
    }
  };

  if (!isOpen) return null;

  const currentMedia = (post.media || []).filter((link: string) => !removedMediaLinks.includes(link));

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
          <h2 className="text-lg font-semibold text-gray-900">Edit Post</h2>
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

          {/* Media Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Media</p>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Existing Media */}
              {post.media?.map((link: string, index: number) => {
                const isRemoved = removedMediaLinks.includes(link);
                return (
                  <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={link}
                      alt={`Existing ${index + 1}`}
                      className={`w-full h-full object-cover ${isRemoved ? "opacity-30 grayscale" : ""}`}
                    />
                    {isRemoved ? (
                      <button
                        onClick={() => undoRemoveExistingMedia(link)}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-medium text-xs"
                      >
                        Undo
                      </button>
                    ) : (
                      <button
                        onClick={() => removeExistingMedia(link)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* New Previews */}
              {previews.map((preview: string, index: number) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#FF6B6B]">
                  <img
                    src={preview}
                    alt={`New preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-[#FF6B6B] text-white text-[10px] px-1 rounded">New</div>
                  <button
                    onClick={() => removeNewFile(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-colors"
                disabled={isLoading}
              >
                <Plus size={20} />
                <span className="text-[10px] mt-1 text-center">Add More</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
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
              Visibility
            </label>
            <div className="flex gap-2">
              {[
                { value: "PUBLIC", icon: Globe, label: "Public" },
                { value: "FRIENDS", icon: Users, label: "Friends" },
                { value: "PRIVATE", icon: Lock, label: "Private" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setVisibility(value as Visibility)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-1 rounded-lg border transition-colors ${
                    visibility === value
                      ? "bg-[#FF6B6B] text-white border-[#FF6B6B]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 font-medium">Allow comments</span>
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
            disabled={isLoading || (!caption.trim() && currentMedia.length === 0 && selectedFiles.length === 0)}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              isLoading || (!caption.trim() && currentMedia.length === 0 && selectedFiles.length === 0)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#FF6B6B] text-white hover:bg-[#ff5252]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Minimal Plus icon for the media add button
function Plus({ size, className }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

export default EditPostModal;
