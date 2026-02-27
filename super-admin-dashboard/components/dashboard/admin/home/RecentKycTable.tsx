// Figma Node: Recent KYC Table
// Architectural Intent: Table showing 5 most recent KYC submissions with "View" button to open modal

"use client";

import React from "react";
import { Eye } from "lucide-react";
import { useGetRecentKycQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";
import type { RecentKycItem } from "@/types/dashboard/admin/dashboard/adminDashboardType";

interface RecentKycTableProps {
  onViewKyc?: (kyc: RecentKycItem) => void;
}

export const RecentKycTable = ({ onViewKyc }: RecentKycTableProps) => {
  const { data: recentKyc, isLoading } = useGetRecentKycQuery();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <span className="px-3 py-1 rounded-[100px] bg-[#fff5d9] text-[#eab308] text-[12px] font-medium font-['Nunito']">Pending</span>;
      case "approved":
        return <span className="px-3 py-1 rounded-[100px] bg-[#e8fbf0] text-[#00c875] text-[12px] font-medium font-['Nunito']">Approved</span>;
      case "rejected":
        return <span className="px-3 py-1 rounded-[100px] bg-[#ffeeef] text-[#ff7176] text-[12px] font-medium font-['Nunito']">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-[100px] bg-gray-100 text-gray-600 text-[12px] font-medium font-['Nunito']">{status}</span>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const roleMap: Record<string, { label: string; borderColor: string; bgColor: string; textColor: string }> = {
      PET_SITTER: { label: "Pet Sitter", borderColor: "#ff7176", bgColor: "#ffeeef", textColor: "#ff7176" },
      VENDOR: { label: "Vendor", borderColor: "#3b82f6", bgColor: "#eff6ff", textColor: "#3b82f6" },
      PET_HOTEL: { label: "Pet Hotel", borderColor: "#00c875", bgColor: "#e8fbf0", textColor: "#00c875" },
      PET_SCHOOL: { label: "Pet School", borderColor: "#eab308", bgColor: "#fff5d9", textColor: "#eab308" },
    };

    const role = roleMap[category] || { label: category, borderColor: "#3b82f6", bgColor: "#eff6ff", textColor: "#3b82f6" };

    return (
      <span
        className="px-3 py-1 rounded-[100px] border text-[12px] font-medium font-['Nunito']"
        style={{ borderColor: role.borderColor, backgroundColor: role.bgColor, color: role.textColor }}
      >
        {role.label}
      </span>
    );
  };

  const displayData = recentKyc?.data ?? [];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[14px] w-full mt-6">
      <div className="p-[25px] border-b border-[#e5e7eb]">
        <h3 className="font-['Nunito',sans-serif] font-normal text-[18px] leading-[28px] text-[#282828]">
          Recent KYC
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="pb-4 pt-4 px-6 font-['Nunito',sans-serif] font-bold text-[14px] text-[#62748e]">Name</th>
              <th className="pb-4 pt-4 px-6 font-['Nunito',sans-serif] font-bold text-[14px] text-[#62748e]">Category</th>
              <th className="pb-4 pt-4 px-6 font-['Nunito',sans-serif] font-bold text-[14px] text-[#62748e]">Submitted</th>
              <th className="pb-4 pt-4 px-6 font-['Nunito',sans-serif] font-bold text-[14px] text-[#62748e]">Status</th>
              <th className="pb-4 pt-4 px-6 font-['Nunito',sans-serif] font-bold text-[14px] text-[#62748e]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-[#FF7176] border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">
                  No recent KYC submissions.
                </td>
              </tr>
            ) : (
              displayData.map((item: RecentKycItem, idx: number) => (
                <tr key={item.id || idx} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="py-4 px-6 font-['Arial',sans-serif] text-[14px] text-[#282828] font-medium">
                    {item.fullName}
                  </td>
                  <td className="py-4 px-6">
                    {getCategoryBadge(item.roleType)}
                  </td>
                  <td className="py-4 px-6 font-['Arial',sans-serif] text-[14px] text-[#282828]">
                    {item.createdAt.includes('T') ? item.createdAt.split('T')[0] : item.createdAt}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onViewKyc?.(item)}
                      className="flex items-center gap-2 px-3 py-1.5 border border-[#d0d0d0] rounded-[100px] text-[#62748e] hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      <span className="font-['Nunito',sans-serif] text-[12px] font-medium">View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
