"use client";

import { X, AlertTriangle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useDeleteFoodMutation } from "@/redux/features/api/dashboard/hotel/food/hotelFoodApi";

interface DeleteFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: { id: string; name: string } | null;
}

export default function DeleteFoodModal({
  isOpen,
  onClose,
  food,
}: DeleteFoodModalProps) {
  const { showToast } = useToast();
  const [deleteFood, { isLoading }] = useDeleteFoodMutation();

  const handleDelete = async () => {
    if (!food) return;
    try {
      await deleteFood(food.id).unwrap();
      showToast("Food deleted successfully", "success");
      onClose();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete food", "error");
    }
  };

  if (!isOpen || !food) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-6 text-center">
            {/* Warning Icon */}
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Food Item
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-500 mb-1">
              Are you sure you want to delete
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-6">
              &ldquo;{food.name}&rdquo;?
            </p>
            <p className="text-xs text-gray-400 mb-6">
              This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
