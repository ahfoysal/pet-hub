"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, X, Upload } from "lucide-react";
import { 
  FormSection, 
  FormInput, 
  FormTextarea, 
  RoomTypeCard, 
  AmenityCheckbox, 
  ImageArea 
} from "./RoomFormComponents";

const AMENITIES = [
  "Air Conditioning",
  "Comfortable Bedding",
  "CCTV Monitoring",
  "Play Area Access",
  "Feeding Bowls",
  "Climate Control",
  "24/7 Supervision"
];

interface RoomFormData {
  roomName: string;
  roomNumber: string;
  description: string;
  roomType: string;
  status: string;
  petCapacity: string;
  humanCapacity: string;
  price: string;
  roomAmenities: string[];
  images: (File | string)[];
}

interface RoomFormProps {
  initialData?: Partial<RoomFormData>;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  onCancel: () => void;
  title: string;
}

export default function RoomForm({ initialData, onSubmit, isLoading, onCancel, title }: RoomFormProps) {
  const [formData, setFormData] = useState<RoomFormData>({
    roomName: initialData?.roomName || "",
    roomNumber: initialData?.roomNumber || "",
    description: initialData?.description || "",
    roomType: initialData?.roomType || "PET_ONLY",
    status: initialData?.status || "AVAILABLE",
    petCapacity: initialData?.petCapacity || "1",
    humanCapacity: initialData?.humanCapacity || "0",
    price: initialData?.price || "50",
    roomAmenities: initialData?.roomAmenities || [],
    images: initialData?.images || [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    // Handle initial images (strings/URLs)
    if (initialData?.images) {
      const previews = initialData.images.filter(img => typeof img === "string") as string[];
      setImagePreviews(previews);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      roomAmenities: prev.roomAmenities.includes(amenity)
        ? prev.roomAmenities.filter(a => a !== amenity)
        : [...prev.roomAmenities, amenity]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("roomName", formData.roomName);
    fd.append("roomNumber", formData.roomNumber);
    fd.append("description", formData.description);
    fd.append("roomType", formData.roomType);
    fd.append("status", formData.status);
    fd.append("petCapacity", formData.petCapacity);
    fd.append("humanCapacity", formData.humanCapacity);
    fd.append("price", formData.price);
    formData.roomAmenities.forEach(a => fd.append("roomAmenities", a));
    
    formData.images.forEach(img => {
      if (img instanceof File) {
        fd.append("images", img);
      } else {
        fd.append("prevImages", img);
      }
    });

    onSubmit(fd);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#f2f4f8] overflow-y-auto font-arimo">
      <div className="max-w-[800px] mx-auto min-h-screen bg-white shadow-lg overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-8 py-6 flex items-center gap-4 bg-white border-b border-[#e5e7eb]">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#0a0a0a]">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-[20px] font-normal text-[#0a0a0a]">{title}</h2>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-2 flex-1">
          <FormSection title="Basic Room Information">
            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="Room Number" 
                name="roomNumber" 
                value={formData.roomNumber} 
                onChange={handleInputChange} 
                placeholder="e.g., 101" 
                required 
              />
              <FormInput 
                label="Room Name" 
                name="roomName" 
                value={formData.roomName} 
                onChange={handleInputChange} 
                placeholder="e.g., Deluxe Pet Suite" 
                required 
              />
            </div>
            <FormTextarea 
              label="Room Description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="Describe space, comfort, ventilation, special features..." 
              required 
            />
          </FormSection>

          <FormSection 
            title="Room Images" 
            description="High-quality images increase booking trust. Include bedroom, play area, and feeding area."
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative w-[120px] h-[120px] rounded-[8px] overflow-hidden group">
                    <Image src={preview} alt="Room" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="relative">
                <ImageArea onAdd={() => document.getElementById("room-image-input")?.click()} />
                <input 
                  id="room-image-input"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
              </div>
              <p className="text-[10px] text-[#4a5565]/60 italic">
                Supported formats: JPG, PNG | Recommended: High-resolution images
              </p>
            </div>
          </FormSection>

          <FormSection title="Room Type">
            <div className="flex gap-4">
              <RoomTypeCard 
                label="Pet Only" 
                description="Pets stay without the owner" 
                selected={formData.roomType === "PET_ONLY"} 
                onClick={() => setFormData(prev => ({ ...prev, roomType: "PET_ONLY" }))} 
              />
              <RoomTypeCard 
                label="Pet with Accommodation" 
                description="Pets stay with owner" 
                selected={formData.roomType === "PET_WITH_ACCO"} 
                onClick={() => setFormData(prev => ({ ...prev, roomType: "PET_WITH_ACCO" }))} 
              />
            </div>
          </FormSection>

          <FormSection title="Capacity Settings">
            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="Pet Capacity" 
                name="petCapacity" 
                type="number" 
                value={formData.petCapacity} 
                onChange={handleInputChange} 
                placeholder="1" 
                required 
              />
              {formData.roomType === "PET_WITH_ACCO" && (
                <FormInput 
                  label="Pet with Accommodation (Adults)" 
                  name="humanCapacity" 
                  type="number" 
                  value={formData.humanCapacity} 
                  onChange={handleInputChange} 
                  placeholder="1" 
                  required 
                />
              )}
            </div>
          </FormSection>

          <FormSection title="Room Amenities">
            <div className="flex flex-wrap gap-4">
              {AMENITIES.map(amenity => (
                <AmenityCheckbox 
                  key={amenity} 
                  label={amenity} 
                  checked={formData.roomAmenities.includes(amenity)} 
                  onChange={() => handleAmenityToggle(amenity)} 
                />
              ))}
            </div>
          </FormSection>

          <FormSection title="Pricing">
            <div className="space-y-2">
              <FormInput 
                label="Price per Night ($)" 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleInputChange} 
                placeholder="50" 
                required 
              />
              <p className="text-[10px] text-[#4a5565]/60 italic">
                Base price (additional services charged separately). Final payout is processed after booking completion and admin approval.
              </p>
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border border-[#d1d5dc] text-[#0a0a0a] rounded-[10px] font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-[#ff7176] text-white rounded-[10px] font-medium hover:bg-[#ff7176]/90 transition-colors shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] disabled:opacity-50"
            >
              {isLoading ? "Saving..." : title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
