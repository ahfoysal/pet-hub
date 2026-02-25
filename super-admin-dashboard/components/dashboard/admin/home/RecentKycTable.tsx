"use client";

import React from "react";
import { Eye } from "lucide-react";
import { useGetRecentKycQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";

export const RecentKycTable = () => {
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
    if (category === "Pet Sitter" || category === "PET_SITTER") {
      return <span className="px-3 py-1 rounded-[100px] border border-[#ff7176] bg-[#ffeeef] text-[#ff7176] text-[12px] font-medium font-['Nunito']">Pet Sitter</span>;
    }
    return <span className="px-3 py-1 rounded-[100px] border border-[#3b82f6] bg-[#eff6ff] text-[#3b82f6] text-[12px] font-medium font-['Nunito']">{category}</span>;
  };

  // Mock data to match Figma if no backend data
  const mockData = [
    { id: "1", fullName: "Furry Friends Care", roleType: "Pet Sitter", createdAt: "2024-02-20", status: "Pending" },
    { id: "2", fullName: "Luna & Bella", roleType: "Pet Sitter", createdAt: "2024-02-20", status: "Pending" },
    { id: "3", fullName: "Charlie", roleType: "Pet Sitter", createdAt: "2024-02-20", status: "Pending" },
    { id: "4", fullName: "Whiskers", roleType: "Pet Sitter", createdAt: "2024-02-20", status: "Rejected" },
  ];

  const displayData = !isLoading && recentKyc?.data && recentKyc.data.length > 0 ? recentKyc.data : mockData;

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
            {displayData.map((item: any, idx) => (
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
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-[#d0d0d0] rounded-[100px] text-[#62748e] hover:bg-gray-50 transition-colors">
                    <Eye size={14} />
                    <span className="font-['Nunito',sans-serif] text-[12px] font-medium">View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
