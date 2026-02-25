"use client";

import { useState, useEffect } from "react";
import { X, Upload, Clock } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useUpdateHotelProfileMutation } from "@/redux/features/api/dashboard/hotel/profile/hotelProfileApi";
import { HotelProfileType } from "@/types/profile/hotel/hotelProfileTypes";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HotelProfileType | null;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
}: EditProfileModalProps) {
  const { showToast } = useToast();
  const [updateProfile, { isLoading }] = useUpdateHotelProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
    dayStartingTime: "",
    dayEndingTime: "",
    nightStartingTime: "",
    nightEndingTime: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (profile && isOpen) {
      const address = profile.addresses?.[0];
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        description: profile.description || "",
        streetAddress: address?.streetAddress || "",
        city: address?.city || "",
        country: address?.country || "",
        postalCode: address?.postalCode || "",
        dayStartingTime: profile.dayStartingTime || "",
        dayEndingTime: profile.dayEndingTime || "",
        nightStartingTime: profile.nightStartingTime || "",
        nightEndingTime: profile.nightEndingTime || "",
      });
      setExistingImages(profile.images ? [...profile.images] : []);
      setNewImagePreviews([]);
      setNewImageFiles([]);
    }
  }, [profile, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      setNewImageFiles((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast("Hotel name is required", "error");
      return;
    }
    if (!formData.email.trim()) {
      showToast("Email is required", "error");
      return;
    }
    if (!formData.phone.trim()) {
      showToast("Phone is required", "error");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("description", formData.description);
      fd.append("streetAddress", formData.streetAddress);
      fd.append("city", formData.city);
      fd.append("country", formData.country);
      fd.append("postalCode", formData.postalCode);
      fd.append("dayStartingTime", formData.dayStartingTime);
      fd.append("dayEndingTime", formData.dayEndingTime);
      fd.append("nightStartingTime", formData.nightStartingTime);
      fd.append("nightEndingTime", formData.nightEndingTime);

      existingImages.forEach((img) => fd.append("prevImages", img));
      newImageFiles.forEach((file) => fd.append("files", file));

      await updateProfile(fd).unwrap();
      showToast("Profile updated successfully", "success");
      handleClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update profile", "error");
    }
  };

  const handleClose = () => {
    setNewImagePreviews([]);
    setNewImageFiles([]);
    onClose();
  };

  if (!isOpen || !profile) return null;

  const inputStyles =
    "w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm";
  const labelStyles = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="px-6 pb-4 space-y-5 flex-1 overflow-y-auto">
            {/* Images */}
            <div>
              <label className={labelStyles}>Hotel Images</label>
              <div className="flex items-center gap-3 flex-wrap">
                {existingImages.map((img, i) => (
                  <div key={`ex-${i}`} className="relative">
                    <img
                      src={img}
                      alt="Hotel"
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {newImagePreviews.map((preview, i) => (
                  <div key={`new-${i}`} className="relative">
                    <img
                      src={preview}
                      alt="New"
                      className="h-20 w-20 rounded-xl object-cover ring-2 ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="h-20 w-20 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Upload className="text-gray-400" size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className={labelStyles}>
                Hotel Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={inputStyles}
                style={{ border: "none" }}
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelStyles}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`${inputStyles} resize-none`}
                style={{ border: "none" }}
              />
            </div>

            {/* Address */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Address
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className={inputStyles}
                    style={{ border: "none" }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={inputStyles}
                      style={{ border: "none" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={inputStyles}
                      style={{ border: "none" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={inputStyles}
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shift Times */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">
                  Operating Hours
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Day Start
                  </label>
                  <input
                    type="time"
                    name="dayStartingTime"
                    value={formData.dayStartingTime}
                    onChange={handleInputChange}
                    className={inputStyles}
                    style={{ border: "none" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Day End
                  </label>
                  <input
                    type="time"
                    name="dayEndingTime"
                    value={formData.dayEndingTime}
                    onChange={handleInputChange}
                    className={inputStyles}
                    style={{ border: "none" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Night Start
                  </label>
                  <input
                    type="time"
                    name="nightStartingTime"
                    value={formData.nightStartingTime}
                    onChange={handleInputChange}
                    className={inputStyles}
                    style={{ border: "none" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Night End
                  </label>
                  <input
                    type="time"
                    name="nightEndingTime"
                    value={formData.nightEndingTime}
                    onChange={handleInputChange}
                    className={inputStyles}
                    style={{ border: "none" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pt-4 pb-6 bg-white flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 order-2 sm:order-1 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2 transition-colors"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
