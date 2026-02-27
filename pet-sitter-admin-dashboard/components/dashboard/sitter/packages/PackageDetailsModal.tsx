"use client";

import { X, Package, Timer, CheckCircle2, Loader2 } from "lucide-react";
import { useGetPackageByIdQuery } from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";

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

  if (!isOpen || !packageId) return null;

  const pkg = data?.data ?? null;

  const createdAtDate = pkg?.createdAt ? new Date(pkg.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/ /g, "-") : "N/A";

  const calculateTotalValue = () => {
    if (!pkg?.services) return 0;
    return pkg.services.reduce((total: number, service: any) => {
      return total + (service ? Number(service.price) / 100 : 0);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#00000040] backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[32px] w-full max-w-[540px] max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header Image Area */}
        <div className="relative h-[200px] shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff717620] to-[#ff717610]" />
          {pkg?.image ? (
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={64} className="text-[#ff717620]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        {isLoading || !pkg ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff7176]" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Stats Row */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-[24px] font-bold text-[#111827]">
                  {pkg.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#6B7280]">Created on {createdAtDate}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[24px] font-bold text-[#00a63e]">
                  ${(Number(pkg.offeredPrice) / 100).toFixed(0)}
                </p>
                <p className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider">Fixed Price</p>
              </div>
            </div>

            {/* Description Card */}
            <div className="space-y-3">
              <h4 className="text-[16px] font-bold text-[#111827]">About this Package</h4>
              <div className="p-5 bg-[#F9FAFB] rounded-2xl border border-gray-100">
                <p className="text-[15px] text-[#4B5563] leading-relaxed">
                  {pkg.description || "This package offers a comprehensive pet sitting service tailored to your pet's specific needs. It includes all the essentials for a comfortable and happy stay."}
                </p>
              </div>
            </div>

            {/* Included Services Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-[#111827]">What&apos;s Included</h4>
                <div className="flex items-center gap-2 text-[#ff7176] bg-[#ff717610] px-3 py-1 rounded-full">
                  <Timer size={14} />
                  <span className="text-[13px] font-bold">{pkg.durationInMinutes} Mins</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {pkg.services && pkg.services.length > 0 ? (
                  pkg.services.map((service: { name: string; price: number | string }, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-[#ff717610] flex items-center justify-center text-[#ff7176]">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] font-semibold text-[#111827]">{service.name}</p>
                        <p className="text-[13px] text-[#6B7280]">Included in package</p>
                      </div>
                      <span className="text-[15px] font-bold text-[#111827]">
                        ${(Number(service.price) / 100).toFixed(0)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-[14px] text-[#6B7280] italic">No specific services listed for this package.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Value Breakdown */}
            <div className="p-5 bg-[#FDF2F2] rounded-2xl border border-[#FEE2E2] flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#991B1B] font-medium">Total Value</p>
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-bold text-[#991B1B]">${calculateTotalValue().toFixed(0)}</span>
                  <span className="text-[14px] text-[#F87171] line-through">${(calculateTotalValue() * 1.2).toFixed(0)}</span>
                </div>
              </div>
              <div className="bg-[#EF4444] text-white px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
                Custom Offer
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 pb-2">
              <button
                onClick={onClose}
                className="w-full py-4 bg-[#ff7176] hover:bg-[#ff5a60] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#ff717630] active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
