import React from "react";
import Button from "@/components/ui/Button";
import { Delete, X } from "lucide-react";

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseName?: string;
  isSubmitting: boolean;
}

const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  courseName,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto top-20">
      <div
        className="fixed inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200! px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Confirm Deletion
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-lg mb-4">
              Are you sure you want to delete the course &apos;{courseName}
              &apos;?
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. All related data will be permanently
              removed.
            </p>
            <div className="flex gap-2">
              <Button
                text={`${isSubmitting ? "Deleting..." : "Delete"}   `}
                variant="primary"
                icon={<Delete size={18} />}
                onClick={onConfirm}
                disabled={isSubmitting}
                className={`bg-red-600 hover:bg-red-700 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              <Button
                text="Cancel"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal;
