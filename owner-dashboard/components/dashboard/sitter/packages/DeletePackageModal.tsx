"use client";

import { X, AlertTriangle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useDeletePackageMutation } from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";
import { SitterPackage } from "@/types/dashboard/sitter/sitterPackageTypes";

interface DeletePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: SitterPackage | null;
  onDeleteSuccess?: (id: string) => void;
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `$${(numPrice / 100).toFixed(2)}`;
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
      // Notify parent so it can remove the item from UI immediately
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
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Delete Package</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Are you sure you want to delete this package?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  This action cannot be undone.
                </p>
                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  {pkg.image && (
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {pkg.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(pkg.offeredPrice)} •{" "}
                      {pkg.durationInMinutes} min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-100 disabled:opacity-50 order-2 sm:order-1 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2 transition-colors"
            >
              {isLoading ? "Deleting..." : "Delete Package"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
