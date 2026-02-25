"use client";

import { useState, useMemo } from "react";
import { X, Upload, EyeOff, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useCreatePackageMutation } from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";
import { useGetSitterServiceQuery } from "@/redux/features/api/dashboard/sitter/services/sitterServiceApi";

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePackageModal({
  isOpen,
  onClose,
}: CreatePackageModalProps) {
  const { showToast } = useToast();
  const [createPackage, { isLoading }] = useCreatePackageMutation();
  const { data: servicesData } = useGetSitterServiceQuery(undefined, {
    skip: !isOpen,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    offeredPrice: "",
    durationInMinutes: "",
    serviceIds: [] as string[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showTotal, setShowTotal] = useState(true);

  const services = servicesData?.data?.data ?? [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  };

  const calculateTotalValue = () => {
    return formData.serviceIds.reduce((total, id) => {
      const service = services.find((s) => s.id === id);
      return total + (service ? Number(service.price) / 100 : 0);
    }, 0);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.name.trim()) {
      showToast("Package name is required", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Description is required", "error");
      return;
    }
    if (!formData.durationInMinutes || parseInt(formData.durationInMinutes) < 1) {
      showToast("Duration must be at least 1 minute", "error");
      return;
    }
    if (formData.serviceIds.length === 0) {
      showToast("Please select at least one service", "error");
      return;
    }
    // For packages, image is often required, but let's be safe.
    if (!imageFile) {
      showToast("Please upload a package image", "error");
      return;
    }

    try {
      const packageData = new FormData();
      packageData.append("name", formData.name);
      packageData.append("description", formData.description);
      if (formData.offeredPrice) {
        const priceInCents = Math.round(parseFloat(formData.offeredPrice) * 100);
        packageData.append("offeredPrice", priceInCents.toString());
      }
      packageData.append("durationInMinutes", formData.durationInMinutes);
      formData.serviceIds.forEach((id) => {
        packageData.append("serviceIds", id);
      });
      if (imageFile) {
        packageData.append("file", imageFile);
      }

      await createPackage(packageData).unwrap();
      showToast("Package created successfully", "success");
      handleClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to create package", "error");
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      offeredPrice: "",
      durationInMinutes: "",
      serviceIds: [],
    });
    setImagePreview(null);
    setImageFile(null);
    onClose();
  };

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/ /g, "-");

  const inputStyles =
    "flex-1 h-[38px] px-[12px] bg-white border border-[#f2f2f2] rounded-[12px] text-[14px] text-[#828282] font-arimo focus:outline-none focus:border-[#ff7176] transition-all resize-none";
  const labelStyles = "w-[120px] shrink-0 text-[14px] text-black font-arimo";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#c4c4c4]/80 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[512px] p-[32px] rounded-[32px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)] flex flex-col gap-[40px] items-center z-10 max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-[#667085] hover:text-[#ff7176] transition-colors rounded-full hover:bg-gray-100 z-20"
        >
          <X size={20} />
        </button>

        {/* Thumbnail Image */}
        <div className="w-full h-[221px] shrink-0 relative rounded-[24px] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f3e8ff] to-[#e9d4ff]" />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Package"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Upload size={32} className="text-[#ff7176]/40" />
              <span className="text-[#667085] mt-2 font-arimo text-[14px]">
                Upload Image
              </span>
            </div>
          )}
          <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all opacity-0 group-hover:opacity-100">
            <span className="bg-white/80 px-4 py-2 rounded-full text-sm font-arimo font-medium text-black">
              Change Image
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[16px]">
          {/* Info Rows */}
          <div className="w-full flex flex-col gap-[12px] border border-white shrink-0 font-arimo text-[14px]">
            <div className="flex items-center justify-between w-full">
              <p className="text-black w-[146px] shrink-0">Package Category</p>
              <p className="flex-1 text-[#828282]">Custom Package</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-black w-[120px] shrink-0">Creation Date</p>
              <p className="flex-1 text-[#828282]">{today}</p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <p className={labelStyles}>Name</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={inputStyles}
              required
            />
          </div>

          <div className="flex items-center justify-between w-full">
            <p className={labelStyles}>Price ($)</p>
            <input
              type="number"
              name="offeredPrice"
              value={formData.offeredPrice}
              onChange={handleInputChange}
              className={inputStyles}
            />
          </div>

          <div className="flex items-center justify-between w-full">
            <p className={labelStyles}>Duration (min)</p>
            <input
              type="number"
              name="durationInMinutes"
              value={formData.durationInMinutes}
              onChange={handleInputChange}
              className={inputStyles}
              required
            />
          </div>

          <div className="flex items-start justify-between w-full">
            <p className={labelStyles}>Description</p>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`${inputStyles} h-[80px] py-[8px]`}
              required
            />
          </div>

          {/* What's Included */}
          <div className="flex items-start justify-between w-full">
            <p className={labelStyles}>What&apos;s Included</p>
            <div className="flex-1 flex flex-col gap-[4px] px-[16px]">
              <div className="max-h-[160px] overflow-y-auto pr-2 flex flex-col gap-[4px] custom-scrollbar">
                {services.map((service) => {
                  const isSelected = formData.serviceIds.includes(service.id);
                  const priceStr = (Number(service.price) / 100).toFixed(0);

                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className="flex items-center px-[14px] py-[8px] rounded-[8px] cursor-pointer hover:bg-gray-50 transition-colors gap-[8px]"
                    >
                      {/* Radio-style Icon */}
                      <div className="relative w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                        {isSelected ? (
                          <>
                            <div className="absolute inset-0 rounded-full border-2 border-[#ff7176]" />
                            <div className="absolute inset-[4px] rounded-full bg-[#ff7176]" />
                          </>
                        ) : (
                          <div className="absolute inset-0 rounded-full border-2 border-[#d0d5dd]" />
                        )}
                      </div>
                      <p className="font-['Inter'] font-normal text-[14px] text-[#717680] leading-[1.55] truncate">
                        {service.name} - ${priceStr}
                      </p>
                    </div>
                  );
                })}
                {services.length === 0 && (
                  <p className="text-[14px] text-[#717680] italic px-[14px] py-[8px]">
                    No services available.
                  </p>
                )}
              </div>

              {/* Total Display */}
              <div className="mt-2 w-full border border-[#c0c0c0] rounded-[4px] flex items-center justify-between px-[10px] py-[8px]">
               <div className="flex items-center gap-[4px]">
                  <span className="font-['Inter'] font-normal text-[14px] text-[#717680] leading-[1.55]">
                    Total - 
                  </span>
                  {showTotal ? (
                    <span className="font-['Inter'] font-normal text-[14px] leading-[1.55] text-[#ff7176]">
                     ${calculateTotalValue().toFixed(0)}
                    </span>
                  ) : (
                    <span className="font-['Inter'] font-normal text-[14px] leading-[1.55] text-[#ff7176] line-through">
                     ${calculateTotalValue().toFixed(0)}
                    </span>
                  )}
               </div>
               <button
                  type="button"
                  onClick={() => setShowTotal(!showTotal)}
                  className="text-[#667085] hover:text-[#ff7176] transition-colors p-1"
               >
                  {showTotal ? <Eye size={18} /> : <EyeOff size={18} />}
               </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="w-full flex justify-center mt-[8px]">
            <button
              type="submit"
              disabled={isLoading}
              className="w-[190px] h-[48px] bg-[#ff7176] text-white rounded-[10px] text-[16px] font-arimo font-normal hover:bg-[#ff7176]/90 transition-all disabled:opacity-50 shadow-sm flex items-center justify-center"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
