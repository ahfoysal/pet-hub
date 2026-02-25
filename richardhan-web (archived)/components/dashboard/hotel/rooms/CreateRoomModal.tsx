"use client";

import { useState } from "react";
import { X, Upload, ChevronDown } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useCreateRoomMutation } from "@/redux/features/api/dashboard/hotel/room/hotelRoomApi";

const ROOM_TYPES = [
  { value: "PET_ONLY", label: "Pet Only" },
  { value: "PET_WITH_ACCO", label: "Pet with Accommodation" },
] as const;
const ROOM_STATUSES = [
  { value: "AVAILABLE", label: "Available" },
  { value: "BOOKED", label: "Booked" },
  { value: "MAINTENANCE", label: "Maintenance" },
] as const;

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
}: CreateRoomModalProps) {
  const { showToast } = useToast();
  const [createRoom, { isLoading }] = useCreateRoomMutation();

  const [formData, setFormData] = useState({
    roomName: "",
    roomNumber: "",
    description: "",
    roomType: "",
    status: "AVAILABLE",
    petCapacity: "",
    humanCapacity: "",
    price: "",
    roomAmenities: [] as string[],
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      setImageFiles((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    const val = amenityInput.trim();
    if (val && !formData.roomAmenities.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        roomAmenities: [...prev.roomAmenities, val],
      }));
      setAmenityInput("");
    }
  };

  const removeAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      roomAmenities: prev.roomAmenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.roomNumber.trim()) {
      showToast("Room number is required", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Description is required", "error");
      return;
    }
    if (!formData.roomType) {
      showToast("Room type is required", "error");
      return;
    }
    if (!formData.petCapacity || parseInt(formData.petCapacity) < 1) {
      showToast("Pet capacity must be at least 1", "error");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast("Price must be greater than 0", "error");
      return;
    }
    if (imageFiles.length === 0) {
      showToast("Please upload at least one image", "error");
      return;
    }

    try {
      const fd = new FormData();
      if (formData.roomName.trim()) fd.append("roomName", formData.roomName);
      fd.append("roomNumber", formData.roomNumber);
      fd.append("description", formData.description);
      fd.append("roomType", formData.roomType);
      fd.append("status", formData.status);
      fd.append("petCapacity", formData.petCapacity);
      if (formData.humanCapacity) fd.append("humanCapacity", formData.humanCapacity);
      fd.append("price", formData.price);
      formData.roomAmenities.forEach((a) => fd.append("roomAmenities", a));
      imageFiles.forEach((file) => fd.append("images", file));

      await createRoom(fd).unwrap();
      showToast("Room created successfully", "success");
      handleClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to create room", "error");
    }
  };

  const handleClose = () => {
    setFormData({
      roomName: "",
      roomNumber: "",
      description: "",
      roomType: "",
      status: "AVAILABLE",
      petCapacity: "",
      humanCapacity: "",
      price: "",
      roomAmenities: [],
    });
    setAmenityInput("");
    setImagePreviews([]);
    setImageFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  const inputStyles =
    "w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm";
  const selectStyles =
    "w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm appearance-none";
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
            <h2 className="text-xl font-bold text-gray-900">Add New Room</h2>
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
              <label className={labelStyles}>
                Room Images <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative">
                    <img
                      src={preview}
                      alt="Room"
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
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

            {/* Room Name + Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Room Name</label>
                <input
                  type="text"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleInputChange}
                  placeholder="e.g., Sunshine Suite"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 101"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Type + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>
                  Room Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className={selectStyles}
                    style={{ border: "none" }}
                  >
                    <option value="">Select type</option>
                    {ROOM_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
              <div>
                <label className={labelStyles}>Status</label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={selectStyles}
                    style={{ border: "none" }}
                  >
                    {ROOM_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelStyles}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the room..."
                rows={2}
                className={`${inputStyles} resize-none`}
                style={{ border: "none" }}
              />
            </div>

            {/* Capacity + Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelStyles}>
                  Pet Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="petCapacity"
                  value={formData.petCapacity}
                  onChange={handleInputChange}
                  placeholder="2"
                  min="1"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>Human Capacity</label>
                <input
                  type="number"
                  name="humanCapacity"
                  value={formData.humanCapacity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
              <div>
                <label className={labelStyles}>
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="99"
                  min="0"
                  step="0.01"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className={labelStyles}>Amenities</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                  placeholder="e.g., WiFi, AC, Pool..."
                  className={`flex-1 ${inputStyles}`}
                  style={{ border: "none" }}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors text-sm"
                >
                  Add
                </button>
              </div>
              {formData.roomAmenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.roomAmenities.map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {a}
                      <button
                        type="button"
                        onClick={() => removeAmenity(i)}
                        className="hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
              {isLoading ? "Creating..." : "Create Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
