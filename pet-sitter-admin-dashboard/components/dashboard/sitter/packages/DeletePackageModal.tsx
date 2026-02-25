"use client";

import { X, AlertTriangle, Trash2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useDeletePackageMutation } from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";
import { SitterPackage } from "@/types/dashboard/sitter/sitterPackageTypes";

interface DeletePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: SitterPackage | { id: string; name: string; image?: string; offeredPrice?: string | number; durationInMinutes?: number } | null;
  onDeleteSuccess?: (id: string) => void;
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `$${((numPrice || 0) / 100).toFixed(0)}`;
};

export default function DeletePackageModal({
  isOpen,
  onClose,
  pkg,
  onDeleteSuccess,
}: DeletePackageModalProps) {
  const { showToast } = useToast();
  const [deletePackage, { isLoading }] = useDeletePackageMutation();

  const handleDelete = async () => {
    if (!pkg?.id) return;
    try {
      await deletePackage(pkg.id).unwrap();
      showToast("Package deleted successfully", "success");
      if (onDeleteSuccess) {
        onDeleteSuccess(pkg.id);
      } else {
        onClose();
      }
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete package", "error");
    }
  };

  if (!isOpen || !pkg) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center font-arimo p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#c4c4c4]/80 backdrop-blur-[2px]" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[440px] rounded-[34px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)] flex flex-col p-8 gap-6 animate-in fade-in zoom-in duration-200">
        
        {/* Warning Icon */}
        <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#fff1f1] rounded-full flex items-center justify-center">
                <Trash2 size={40} className="text-[#ff7176]" />
            </div>
        </div>

        {/* Text Area */}
        <div className="text-center flex flex-col gap-2">
            <h3 className="text-[24px] font-bold text-[#101828]">Delete Package?</h3>
            <p className="text-[16px] font-normal text-[#667085] leading-[24px]">
                Are you sure you want to delete <span className="font-bold text-[#101828]">"{pkg.name}"</span>? 
                This action cannot be undone and will remove the package from your listings.
            </p>
        </div>

        {/* Package Preview Card */}
        <div className="bg-[#f9fafb] p-4 rounded-[20px] flex items-center gap-4 border border-[#eaecf0]">
           {pkg.image && (
             <img 
               src={pkg.image} 
               alt={pkg.name} 
               className="h-16 w-16 rounded-[12px] object-cover border border-white" 
             />
           )}
           <div className="flex flex-col">
              <span className="text-[16px] font-bold text-[#101828] truncate max-w-[200px]">{pkg.name}</span>
              <span className="text-sm font-medium text-[#ff7176]">
                {formatPrice(pkg.offeredPrice || 0)} • {pkg.durationInMinutes || 0} min
              </span>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full h-[52px] bg-[#ff7176] text-white rounded-[10px] text-[18px] font-bold hover:bg-[#ff7176]/90 transition-all disabled:opacity-50"
            >
              {isLoading ? "Deleting..." : "Delete Package"}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full h-[52px] bg-white text-[#667085] border border-[#eaecf0] rounded-[10px] text-[18px] font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
        </div>
      </div>
    </div>
  );
}
