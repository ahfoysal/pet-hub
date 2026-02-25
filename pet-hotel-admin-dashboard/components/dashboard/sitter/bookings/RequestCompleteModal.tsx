"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Send,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useRequestToCompleteMutation } from "@/redux/features/api/dashboard/sitter/bookings/sitterBookingApi";

interface RequestCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
}

export default function RequestCompleteModal({
  isOpen,
  onClose,
  bookingId,
}: RequestCompleteModalProps) {
  const { showToast } = useToast();
  const [requestToComplete, { isLoading }] = useRequestToCompleteMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [completionNote, setCompletionNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter((f) =>
      f.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      showToast("Please upload image files only", "error");
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async () => {
    if (!bookingId) return;

    if (files.length === 0) {
      showToast("Please upload at least one proof image", "error");
      return;
    }

    const formData = new FormData();
    if (completionNote.trim()) {
      formData.append("completionNote", completionNote.trim());
    }
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const result = await requestToComplete({
        id: bookingId,
        data: formData,
      }).unwrap();
      showToast(
        result.message || "Completion request sent successfully",
        "success"
      );
      // Reset form
      setCompletionNote("");
      setFiles([]);
      setPreviews([]);
      onClose();
    } catch (err: any) {
      showToast(
        err?.data?.message || "Failed to request completion",
        "error"
      );
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCompletionNote("");
      setFiles([]);
      setPreviews([]);
      onClose();
    }
  };

  if (!isOpen || !bookingId) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900">
              Request Completion
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-6 space-y-5 flex-1 overflow-y-auto">
            {/* Description */}
            <p className="text-sm text-gray-500">
              Upload proof images and add an optional note to request booking
              completion. The pet owner will review and approve.
            </p>

            {/* File Upload Area */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Proof Images <span className="text-red-500">*</span>
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Click or drag images here
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload photos as proof of service completion
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      className="h-24 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="absolute bottom-1.5 left-1.5">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-black/50 rounded-md">
                        <ImageIcon size={10} className="text-white" />
                        <span className="text-[10px] text-white font-medium">
                          {files[index]?.name?.length > 10
                            ? files[index].name.slice(0, 10) + "..."
                            : files[index]?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completion Note */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Completion Note{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                placeholder="e.g. Took extra care during the walk, all pets are happy!"
                rows={3}
                className="w-full px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none"
                style={{ border: "none" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pt-4 pb-6 bg-gray-50 flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-100 disabled:opacity-50 order-2 sm:order-1 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || files.length === 0}
              className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2 transition-colors inline-flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
