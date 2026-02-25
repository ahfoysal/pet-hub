/* eslint-disable @next/next/no-img-element */
// FileUpload.tsx
"use client";

import { Upload } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import Toast from "@/components/ui/Toast";

type FileUploadProps = {
  label: string;
  description?: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File | null) => void;
  className?: string;
  preview?: boolean;
  initialPreview?: string | null;
  imageSize?: string;
};

const FileUpload: React.FC<FileUploadProps> = ({
  imageSize = "h-40 w-40",
  label,
  description,
  acceptedTypes = "image/png, image/jpeg, application/pdf",
  maxSizeMB = 5,
  onFileSelect,
  className,
  preview = false,
  initialPreview = null, // default
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreview);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "error" as "success" | "error" | "info" | "warning",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success",
  ) => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => setToast({ ...toast, isVisible: false });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    // Revoke previous preview if it was an uploaded file (not initialPreview)
    if (previewUrl && previewUrl !== initialPreview) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      if (file.size / 1024 / 1024 > maxSizeMB) {
        showToast(`File size exceeds ${maxSizeMB}MB`, "error");
        e.target.value = "";
        onFileSelect(null);
        return;
      }

      if (preview && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else if (!preview) {
        setPreviewUrl(null);
      }

      onFileSelect(file);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== initialPreview) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, initialPreview]);

  return (
    <div className="w-full">
      <label className="block font-medium mb-2">{label}</label>

      <div
        onClick={handleClick}
        className={`cursor-pointer border border-[#e9e9e9] rounded-xl p-6 flex flex-col items-center justify-center hover:border-[#ff868a] transition bg-[#F9FAFB] focus:outline-none ${className || ""}`}
      >
        <div className="flex flex-col items-center p-3 rounded-full bg-[#FFEDD4]">
          <Upload size={24} className="text-[#FF6900]" />
        </div>
        <p className="md:text-lg text-gray-500 text-center py-1">
          <span className="text-accent">Click to upload</span> or drag and drop
        </p>
        {description && (
          <p className="text-md text-gray-400 mt-1 text-center">
            {description}
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes}
        onChange={handleFileChange}
      />

      {/* Preview */}
      {preview && previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-green-500 mb-2">Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className={` ${imageSize} rounded-lg border border-border`}
          />
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
};

export default FileUpload;
