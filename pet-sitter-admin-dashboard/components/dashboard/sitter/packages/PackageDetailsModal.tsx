"use client";

import { X, Package, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { useGetPackageByIdQuery } from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";
import { Loader2 } from "lucide-react";

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string | null;
}

export default function PackageDetailsModal({
  isOpen,
  onClose,
  packageId,
}: PackageDetailsModalProps) {
  const { data, isLoading } = useGetPackageByIdQuery(packageId ?? "", {
    skip: !isOpen || !packageId,
  });

  const [showTotal, setShowTotal] = useState(true);

  if (!isOpen || !packageId) return null;

  const pkg = data?.data ?? null;

  const createdAtDate = pkg ? new Date(pkg.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/ /g, "-") : "";

  const calculateTotalValue = () => {
    if (!pkg?.services) return 0;
    return pkg.services.reduce((total: number, service: any) => {
      return total + (service ? Number(service.price) / 100 : 0);
    }, 0);
  };

  const inputStyles =
    "flex-1 px-[12px] bg-white border border-[#f2f2f2] rounded-[12px] text-[14px] text-[#828282] font-arimo flex items-center";
  const labelStyles = "w-[120px] shrink-0 text-[14px] text-black font-arimo";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#c4c4c4]/80 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[512px] p-[32px] rounded-[32px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)] flex flex-col gap-[40px] items-center z-10 max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#667085] hover:text-[#ff7176] transition-colors rounded-full hover:bg-gray-100 z-20"
        >
          <X size={20} />
        </button>

        {isLoading || !pkg ? (
          <div className="flex items-center justify-center py-[100px] w-full">
            <Loader2 className="h-12 w-12 animate-spin text-[#ff7176]" />
          </div>
        ) : (
          <>
            {/* Thumbnail Image */}
            <div className="w-full h-[221px] shrink-0 relative rounded-[24px] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f3e8ff] to-[#e9d4ff]" />
              {pkg.image ? (
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={64} className="text-[#ff7176]/20" />
                </div>
              )}
            </div>

            {/* Read-Only Form Content */}
            <div className="w-full flex flex-col gap-[16px]">
              {/* Info Rows */}
              <div className="w-full flex flex-col gap-[12px] border border-white shrink-0 font-arimo text-[14px]">
                <div className="flex items-center justify-between w-full">
                  <p className="text-black w-[146px] shrink-0">Package Category</p>
                  <p className="flex-1 text-[#828282]">Custom Package</p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-black w-[120px] shrink-0">Creation Date</p>
                  <p className="flex-1 text-[#828282]">{createdAtDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full">
                <p className={labelStyles}>Name</p>
                <div className={`${inputStyles} h-[38px]`}>
                   {pkg.name}
                </div>
              </div>

              <div className="flex items-center justify-between w-full">
                <p className={labelStyles}>Price ($)</p>
                <div className={`${inputStyles} h-[38px]`}>
                   {(Number(pkg.offeredPrice) / 100).toFixed(0)}
                </div>
              </div>

              <div className="flex items-center justify-between w-full">
                <p className={labelStyles}>Duration (min)</p>
                <div className={`${inputStyles} h-[38px]`}>
                   {pkg.durationInMinutes}
                </div>
              </div>

              <div className="flex items-start justify-between w-full">
                <p className={labelStyles}>Description</p>
                <div className={`${inputStyles} min-h-[80px] py-[8px] items-start`}>
                   {pkg.description || "No description provided."}
                </div>
              </div>

              {/* What's Included */}
              <div className="flex items-start justify-between w-full">
                <p className={labelStyles}>What&apos;s Included</p>
                <div className="flex-1 flex flex-col gap-[4px] px-[16px]">
                  <div className="max-h-[160px] overflow-y-auto pr-2 flex flex-col gap-[4px] custom-scrollbar">
                    {pkg.services && pkg.services.length > 0 ? (
                      pkg.services.map((service: any) => {
                        const priceStr = (Number(service.price) / 100).toFixed(0);
                        return (
                          <div
                            key={service.id}
                            className="flex items-center px-[14px] py-[8px] rounded-[8px] gap-[8px] bg-gray-50/50"
                          >
                            <div className="relative w-[20px] h-[20px] shrink-0 flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full border-2 border-[#ff7176]" />
                              <div className="absolute inset-[4px] rounded-full bg-[#ff7176]" />
                            </div>
                            <p className="font-['Inter'] font-normal text-[14px] text-[#717680] leading-[1.55] truncate">
                              {service.name} - ${priceStr}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[14px] text-[#717680] italic px-[14px] py-[8px]">
                        No specific services listed.
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

              {/* Action Button */}
              <div className="w-full flex justify-center mt-[8px]">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-[190px] h-[48px] bg-[#ff7176] text-white rounded-[10px] text-[16px] font-arimo font-normal hover:bg-[#ff7176]/90 transition-all shadow-sm flex items-center justify-center"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
