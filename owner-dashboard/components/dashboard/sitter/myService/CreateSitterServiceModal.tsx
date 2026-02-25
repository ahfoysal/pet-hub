"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useCreateServiceMutation } from "@/redux/features/api/dashboard/sitter/services/sitterServiceApi";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSitterServiceModal({
  isOpen,
  onClose,
}: CreateServiceModalProps) {
  const { showToast } = useToast();
  const [createService, { isLoading }] = useCreateServiceMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    tags: [] as string[],
    whatsIncluded: [] as string[],
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentWhatsIncluded, setCurrentWhatsIncluded] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "," && currentTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddWhatsIncluded = () => {
    if (
      currentWhatsIncluded.trim() &&
      !formData.whatsIncluded.includes(currentWhatsIncluded.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        whatsIncluded: [...prev.whatsIncluded, currentWhatsIncluded.trim()],
      }));
      setCurrentWhatsIncluded("");
    }
  };

  const handleWhatsIncludedKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddWhatsIncluded();
    }
  };

  const handleRemoveWhatsIncluded = (itemToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      whatsIncluded: prev.whatsIncluded.filter((item) => item !== itemToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Service name is required", "error");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast("Valid price is required", "error");
      return;
    }
    if (!formData.duration || parseInt(formData.duration) < 1) {
      showToast("Duration must be at least 1 minute", "error");
      return;
    }
    if (formData.whatsIncluded.length === 0) {
      showToast("Please add at least one item to 'What's Included'", "error");
      return;
    }

    try {
      const priceInCents = Math.round(parseFloat(formData.price) * 100);

      const serviceData = new FormData();
      serviceData.append("name", formData.name);
      serviceData.append("description", formData.description);
      serviceData.append("price", priceInCents.toString());
      serviceData.append("duration", formData.duration);
      serviceData.append("whatsIncluded", formData.whatsIncluded.join(","));
      serviceData.append("tags", formData.tags.join(","));

      if (thumbnailFile) {
        serviceData.append("file", thumbnailFile);
      }

      await createService(serviceData).unwrap();
      showToast("Service created successfully", "success");
      handleClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to create service", "error");
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      tags: [],
      whatsIncluded: [],
    });
    setCurrentTag("");
    setCurrentWhatsIncluded("");
    setThumbnailPreview(null);
    setThumbnailFile(null);
    onClose();
  };

  if (!isOpen) return null;

  const inputStyles =
    "w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center px-4 pt-20 pb-10 sm:py-8">
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Create New Service
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto"
          >
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Thumbnail
              </label>
              <div className="flex items-center gap-4">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail"
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailPreview(null);
                        setThumbnailFile(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5">
                    <Upload className="text-gray-400" size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Upload a thumbnail image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Service Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Premium Dog Walking"
                className={inputStyles}
                style={{ border: "none" }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Professional dog walking with GPS tracking..."
                rows={3}
                className={`${inputStyles} resize-none`}
                style={{ border: "none" }}
              />
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 25.00"
                  min="0.01"
                  step="0.01"
                  className={inputStyles}
                  style={{ border: "none" }}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                  min="1"
                  className={inputStyles}
                  style={{ border: "none" }}
                  required
                />
              </div>
            </div>

            {/* What's Included */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What's Included <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={currentWhatsIncluded}
                  onChange={(e) => setCurrentWhatsIncluded(e.target.value)}
                  onKeyDown={handleWhatsIncludedKeyDown}
                  placeholder="e.g., 30-minute walk, Water provided"
                  className={`${inputStyles} pr-20`}
                  style={{ border: "none" }}
                />
                {currentWhatsIncluded.trim() && (
                  <button
                    type="button"
                    onClick={handleAddWhatsIncluded}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90"
                  >
                    Add
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Press Enter to add</p>
              {formData.whatsIncluded.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.whatsIncluded.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveWhatsIncluded(item)}
                        className="text-primary/70 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="e.g., dogs, outdoor, exercise"
                  className={`${inputStyles} pr-20`}
                  style={{ border: "none" }}
                />
                {currentTag.trim() && (
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90"
                  >
                    Add
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Press Enter or comma to add
              </p>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 pt-4 pb-6 bg-white flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2"
            >
              {isLoading ? "Creating..." : "Create Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
