// Figma Node: KYC Detail Modal
// Architectural Intent: Modal showing KYC detail when "View" is clicked on Recent KYC table

"use client";

import React from "react";
import { X } from "lucide-react";
import type { RecentKycItem } from "@/types/dashboard/admin/dashboard/adminDashboardType";

interface KycDetailModalProps {
  kyc: RecentKycItem;
  onClose: () => void;
}

export const KycDetailModal = ({ kyc, onClose }: KycDetailModalProps) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <span className="px-3 py-1 rounded-full bg-[#fff5d9] text-[#eab308] text-[13px] font-medium font-['Nunito']">Pending</span>;
      case "approved":
        return <span className="px-3 py-1 rounded-full bg-[#e8fbf0] text-[#00c875] text-[13px] font-medium font-['Nunito']">Approved</span>;
      case "rejected":
        return <span className="px-3 py-1 rounded-full bg-[#ffeeef] text-[#ff7176] text-[13px] font-medium font-['Nunito']">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[13px] font-medium font-['Nunito']">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRoleType = (roleType: string) => {
    return roleType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
          <h3 className="font-['Nunito',sans-serif] font-bold text-[18px] text-[#282828]">
            KYC Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} className="text-[#62748e]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-['Arial',sans-serif] text-[14px] text-[#62748e]">Full Name</span>
            <span className="font-['Arial',sans-serif] text-[14px] text-[#282828] font-medium">{kyc.fullName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-['Arial',sans-serif] text-[14px] text-[#62748e]">Role Type</span>
            <span className="font-['Arial',sans-serif] text-[14px] text-[#282828] font-medium">{formatRoleType(kyc.roleType)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-['Arial',sans-serif] text-[14px] text-[#62748e]">Submitted</span>
            <span className="font-['Arial',sans-serif] text-[14px] text-[#282828] font-medium">{formatDate(kyc.createdAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-['Arial',sans-serif] text-[14px] text-[#62748e]">Status</span>
            {getStatusBadge(kyc.status)}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-['Arial',sans-serif] text-[14px] text-[#62748e]">KYC ID</span>
            <span className="font-['Arial',sans-serif] text-[13px] text-[#62748e] font-mono">{kyc.id}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e5e7eb] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#FF7176] text-white rounded-lg text-[14px] font-medium font-['Nunito'] hover:bg-[#ff5c62] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
