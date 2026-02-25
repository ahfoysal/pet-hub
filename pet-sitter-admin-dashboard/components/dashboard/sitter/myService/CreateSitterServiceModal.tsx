"use client";

import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
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
    whatsIncluded: [""] as string[],
  });

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

  const handleWhatsIncludedChange = (index: number, value: string) => {
    const updated = [...formData.whatsIncluded];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, whatsIncluded: updated }));
  };

  const addWhatsIncluded = () => {
    setFormData((prev) => ({
      ...prev,
      whatsIncluded: [...prev.whatsIncluded, ""],
    }));
  };

  const removeWhatsIncluded = (index: number) => {
    if (formData.whatsIncluded.length > 1) {
      setFormData((prev) => ({
        ...prev,
        whatsIncluded: prev.whatsIncluded.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredIncluded = formData.whatsIncluded.filter(item => item.trim() !== "");

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
    if (filteredIncluded.length === 0) {
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
      serviceData.append("whatsIncluded", filteredIncluded.join(","));

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
      whatsIncluded: [""],
    });
    setThumbnailPreview(null);
    setThumbnailFile(null);
    onClose();
  };

  if (!isOpen) return null;

  const labelStyles = "text-[16px] font-normal text-[#101828]";
  const inputStyles = "w-full h-[48px] px-4 bg-white border border-[#eaecf0] rounded-[8px] text-[16px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:border-[#ff7176] transition-all";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center font-arimo p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#c4c4c4]/80 backdrop-blur-[2px]" 
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-[660px] rounded-[34px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)] flex flex-col gap-6 border border-[#f4f4f4] z-10 max-h-[95vh] overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Close Icon */}
        <button 
          onClick={handleClose}
          className="absolute top-8 right-8 p-1 text-[#667085] hover:text-[#ff7176] transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Header Image / Thumbnail Section */}
        <div className="px-8 pt-8 shrink-0">
          <div className="h-[326.6px] w-full rounded-[24px] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f3e8ff] to-[#e9d4ff]" />
            {thumbnailPreview ? (
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail"
                className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Upload size={48} className="text-[#ff7176]/40" />
                <span className="text-[#667085] mt-2">Upload Service Image</span>
              </div>
            )}
            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all">
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
            </label>
          </div>
        </div>

        {/* Content Section */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
             {/* Service Name */}
             <div className="flex flex-col gap-1.5">
                <label className={labelStyles}>Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter service name"
                  className={inputStyles}
                  required
                />
             </div>

             {/* Duration and Price */}
             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelStyles}>Duration (min)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 60"
                    className={inputStyles}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelStyles}>Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 50"
                    className={inputStyles}
                    required
                  />
                </div>
             </div>

             {/* Description */}
             <div className="flex flex-col gap-1.5">
                <label className={labelStyles}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter service description"
                  className={`${inputStyles} h-[100px] py-3 resize-none`}
                />
             </div>

             {/* What's Included (Key Points Input) */}
             <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className={labelStyles}>What's Included</label>
                  <button 
                    type="button"
                    onClick={addWhatsIncluded}
                    className="flex items-center gap-1 text-[#ff7176] text-sm hover:underline"
                  >
                    <Plus size={16} />
                    Add Option
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {formData.whatsIncluded.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleWhatsIncludedChange(index, e.target.value)}
                          placeholder="e.g. Premium pet food"
                          className={inputStyles}
                        />
                      </div>
                      {formData.whatsIncluded.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeWhatsIncluded(index)}
                          className="text-[#667085] hover:text-[#ff7176] p-1"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] bg-[#ff7176] text-white rounded-[10px] text-[18px] font-bold hover:bg-[#ff7176]/90 transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
