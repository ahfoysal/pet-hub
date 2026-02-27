"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { AdminUser } from "@/types/dashboard/admin/manageAdmins/manageAdminsType";

interface DeleteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  admin: AdminUser | null;
  isLoading?: boolean;
}

const DeleteAdminModal = ({ isOpen, onClose, onConfirm, admin, isLoading }: DeleteAdminModalProps) => {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[34px] w-[500px] p-[32px] relative flex flex-col items-center text-center gap-[24px]">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-[42px] h-[42px] rounded-full bg-[#f2f4f8] flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-[#282828]" />
        </button>

        {/* Warning Icon */}
        <div className="w-[84px] h-[84px] rounded-full bg-[#fef2f2] flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-[#ef4444]" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 font-inter">
          <h2 className="font-nunito font-bold text-[28px] leading-[34px] text-[#282828]">
            Delete Admin?
          </h2>
          <p className="text-[#64748b] text-[16px] leading-[24px]">
            Are you sure you want to delete <span className="font-bold text-[#282828]">{admin.fullName}</span>? 
            This action cannot be undone and will remove them from both the database and Firebase.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full font-inter">
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className="w-full h-[54px] rounded-[12px] bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold text-[18px] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Yes, Delete Admin"}
          </button>
          <button
            disabled={isLoading}
            onClick={onClose}
            className="w-full h-[54px] rounded-[12px] bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold text-[18px] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAdminModal;
