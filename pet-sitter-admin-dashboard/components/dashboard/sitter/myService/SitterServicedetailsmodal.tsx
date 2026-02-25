"use client";

import { X, Clock, Check } from "lucide-react";
import { SitterService } from "@/types/profile/sitter/services/sitterServiceType";
import { useEffect } from "react";

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: SitterService | null;
}

export default function SitterServiceDetailsModal({
  isOpen,
  onClose,
  service,
}: ServiceDetailsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const formatPrice = (price: number) => {
    return `$ ${(price / 100).toFixed(0)}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours} hours ${mins} mins`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${mins} mins`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center font-arimo">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#c4c4c4]/80 backdrop-blur-[2px]" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-[660px] rounded-[34px] p-8 shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)] flex flex-col gap-6 border border-[#f4f4f4] z-10 animate-in fade-in zoom-in duration-200">
        
        {/* Close Icon */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-1 text-[#667085] hover:text-[#ff7176] transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Thumbnail Image Container */}
        <div className="h-[326.6px] w-full rounded-[24px] overflow-hidden relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f3e8ff] to-[#e9d4ff]" />
          <img 
            src={service.thumbnailImage || "/placeholder-service.jpg"} 
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
          />
        </div>

        {/* Header Info */}
        <div className="flex flex-col gap-[10px] w-full">
          <div className="flex items-start justify-between w-full">
            <h2 className="text-[28px] font-bold text-[#101828] leading-tight">
              {service.name}
            </h2>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[16px] font-normal text-[#00a63e]">Price</span>
              <span className="text-[20px] font-bold text-[#ff7176]">
                {formatPrice(service.price)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[#364153]" />
            <span className="text-[16px] font-normal text-[#364153]">
              Duration: {formatDuration(service.durationInMinutes)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex gap-[65px] items-start w-full">
          {/* Description */}
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="text-[20px] font-normal text-[#101828]">Description</h3>
            <p className="text-[16px] font-normal text-[#4a5565] leading-[26px]">
              {service.description || "No description available."}
            </p>
          </div>

          {/* What's Included */}
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="text-[16px] font-normal text-[#101828]">What's Included</h3>
            <div className="flex flex-col gap-2">
              {service.whatsIncluded?.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="mt-1 shrink-0 bg-[#00a63e]/10 p-0.5 rounded-full">
                    <Check size={14} className="text-[#00a63e] stroke-[3]" />
                  </div>
                  <span className="text-[16px] font-normal text-[#364153]">
                    {item}
                  </span>
                </div>
              ))}
              {(!service.whatsIncluded || service.whatsIncluded.length === 0) && (
                <span className="text-[14px] italic text-[#667085]">Nothing listed.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
