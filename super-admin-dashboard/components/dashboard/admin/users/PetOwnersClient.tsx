"use client";

import React, { useState } from "react";
import {
  Search,
  Loader2,
  Eye,
  FileBadge,
  Users,
  Activity,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import {
  useGetPetOwnersQuery,
  useGetRolesCountQuery,
  useGetFinanceStatsQuery,
} from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";
import { PetOwnerItem } from "@/types/dashboard/admin/dashboard/adminDashboardType";
import PetOwnerDetailsModal from "./PetOwnerDetailsModal";

export default function PetOwnersClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<PetOwnerItem | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "SUSPENDED">("ALL");

  const { data: rolesCount } = useGetRolesCountQuery();
  const { data: financeData, isLoading: isFinanceLoading } = useGetFinanceStatsQuery();
  const { data, isLoading, isError } = useGetPetOwnersQuery({
    search: searchTerm,
    limit: 20,
    // Add filtering by status if backend supports it, otherwise filter on frontend
  });

  const owners = data?.data?.items || [];
  const filteredOwners = activeTab === "ALL" 
    ? owners 
    : owners.filter(o => o.status === "SUSPENDED" || o.status === "BANNED");

  const displayUsers = isFinanceLoading ? "..." : (financeData?.data?.activeUsers || 0).toLocaleString();
  const displayBookings = isFinanceLoading ? "..." : (financeData?.data?.totalBookings || 0).toLocaleString();
  
  const stats = [
    { label: "Total Pet Owners", value: rolesCount?.data?.PET_OWNER || 0, icon: <Users size={18} className="text-blue-500" />, bgColor: "bg-blue-50" },
    { label: "Active Users", value: displayUsers, icon: <Activity size={18} className="text-green-500" />, bgColor: "bg-green-50" },
    { label: "Suspended Users", value: owners.filter(o => o.status === "SUSPENDED").length, icon: <FileBadge size={18} className="text-red-500" />, bgColor: "bg-red-50" },
    { label: "Total Bookings", value: displayBookings, icon: <Loader2 size={18} className="text-purple-500" />, bgColor: "bg-purple-50" },
  ];

  return (
    <div className="size-full bg-[#f2f4f8] -m-6 p-6 min-h-[calc(100vh-80px)]" data-name="Pet Owners">
      {/* Container */}
      <div className="flex flex-col gap-6 w-full max-w-272.5 mx-auto mt-7" data-name="Container">
        
        {/* Header Text */}
        <div className="flex flex-col gap-2 h-17 w-full" data-name="Container">
          <div className="h-9 w-full" data-name="Heading 1">
            <h1 className="font-['Nunito',sans-serif] font-medium leading-9 text-[#0a0a0a] text-[30px] m-0">
              Pet Owners (Users)
            </h1>
          </div>
          <div className="h-6 w-full" data-name="Paragraph">
            <p className="font-['Arimo',sans-serif] font-normal leading-6 text-[#4a5565] text-[16px] m-0">
              Manage all public users and pet owners
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-[14px] p-6 border border-[#e2e8f0] flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[14px] text-[#62748e] font-['Arimo']">{stat.label}</p>
                <p className="text-[20px] font-bold text-[#0a0a0a] font-['Nunito']">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Tabs Container */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-4 flex flex-col gap-4 shadow-sm" data-name="Container">
          <div className="flex items-center justify-between">
            <div className="flex bg-[#f1f5f9] p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-4 py-2 rounded-md text-[14px] font-medium transition-all ${
                  activeTab === "ALL" ? "bg-white text-[#0f172a] shadow-sm" : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setActiveTab("SUSPENDED")}
                className={`px-4 py-2 rounded-md text-[14px] font-medium transition-all ${
                  activeTab === "SUSPENDED" ? "bg-white text-[#ef4444] shadow-sm" : "text-[#64748b] hover:text-[#ef4444]"
                }`}
              >
                Suspended
              </button>
            </div>
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-[#cbd5e1] h-10 pl-10 pr-4 rounded-lg text-[14px] focus:border-red-500 outline-none transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-[#94a3b8] size-4.5" />
            </div>
          </div>
        </div>

      </div>

      {/* Table Container */}
      <div className="w-full max-w-272.5 mx-auto mt-6 bg-white border border-[#e2e8f0] border-solid rounded-[10px] overflow-hidden" data-name="Table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-272.5">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] h-15">
                <th className="font-['Inter',sans-serif] font-semibold leading-4 px-2.5 text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle pl-5">User</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-4 px-2.5 text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle">Contact</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-4 px-2.5 text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle text-center">Member Since</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-4 px-2.5 text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle text-center">Bookings</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-4 px-2.5 text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle text-center">Reports</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-4 px-2.5 text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle text-center">Status</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-4 px-2.5 text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[#62748e] font-['Nunito',sans-serif]"
                  >
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-red-500 font-['Nunito',sans-serif]"
                  >
                    Failed to load pet owners.
                  </td>
                </tr>
              ) : filteredOwners.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[#62748e] font-['Nunito',sans-serif]"
                  >
                    No pet owners found.
                  </td>
                </tr>
              ) : (
                filteredOwners.map((owner: PetOwnerItem) => (
                  <tr
                    key={owner.id}
                    className="hover:bg-gray-50/50 transition-colors h-17"
                  >
                    <td className="px-2.5 align-middle pl-5">
                      <div className="flex flex-col">
                        <span className="font-['Nunito',sans-serif] font-normal leading-6 text-[#0f172b] text-[14px]">
                          {owner.fullName}
                        </span>
                        <span className="font-['Nunito',sans-serif] font-normal leading-5 text-[#45556c] text-[10px]">
                          ID: {owner.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-2.5 align-middle">
                      <div className="flex flex-col">
                        <span className="font-['Nunito',sans-serif] font-normal leading-6 text-[#0f172b] text-[12px]">
                          {owner.email}
                        </span>
                        <span className="font-['Nunito',sans-serif] font-normal leading-5 text-[#62748e] text-[10px]">
                          {owner.phone || "+1 555-1001"}
                        </span>
                      </div>
                    </td>
                    <td className="px-2.5 align-middle text-center">
                      <span className="font-['Nunito',sans-serif] font-normal text-[#45556c] text-[13px]">
                        {new Date(owner.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-2.5 align-middle text-center">
                      <span className="font-['Nunito',sans-serif] font-semibold leading-6 text-[#0f172b] text-[14px]">
                        {owner.totalBookings || 0}
                      </span>
                    </td>
                    <td className="px-2.5 align-middle text-center">
                      <span className={`font-['Nunito',sans-serif] font-semibold leading-6 text-[14px] ${owner.reportsFiled > 0 ? 'text-[#ef4444]' : 'text-[#0f172b]'}`}>
                        {owner.reportsFiled || 0}
                      </span>
                    </td>
                    <td className="px-2.5 align-middle text-center">
                      <div className="flex justify-center">
                        {owner.status === 'ACTIVE' ? (
                            <div className="bg-[#dcfce7] border border-[#b9f8cf] border-solid flex h-5.5 items-center px-2.75 py-0.75 rounded-[30px] w-fit">
                                <span className="font-['Nunito',sans-serif] font-medium leading-4 text-[#008236] text-[12px]">
                                Active
                                </span>
                            </div>
                        ) : (
                           <div className="bg-[#fee2e2] border border-[#fecaca] border-solid flex h-5.5 items-center px-2.75 py-0.75 rounded-[30px] w-fit">
                                <span className="font-['Nunito',sans-serif] font-medium leading-4 text-[#ef4444] text-[12px]">
                                {owner.status === 'SUSPENDED' ? 'Suspended' : owner.status}
                                </span>
                            </div> 
                        )}
                      </div>
                    </td>
                    <td className="px-2.5 align-middle">
                      <div className="flex gap-1 items-center justify-end pr-5">
                        <button
                          title="View Details"
                          onClick={() => setSelectedUser(owner)}
                          className="flex items-center justify-center rounded-lg size-9 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          title="Active User"
                          className="flex items-center justify-center rounded-lg size-9 text-green-600 hover:bg-green-50 transition-colors border border-green-100"
                        >
                           <CheckCircle2 className="size-4" />
                        </button>
                        <button
                          title="Suspend/Ban"
                          className="flex items-center justify-center rounded-lg size-9 text-red-600 hover:bg-red-50 transition-colors border border-red-100"
                        >
                          <ShieldAlert className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder matching the design */}
        <div className="border-t border-[#e2e8f0] px-6 py-4 flex items-center justify-between bg-white h-17">
          <p className="font-['Inter',sans-serif] text-sm text-[#475569]">
             Showing 1 to {filteredOwners.length} of {filteredOwners.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded w-8 h-8 flex items-center justify-center border border-[#e2e8f0] text-gray-400 cursor-not-allowed">
              {"<"}
            </button>
            <button className="px-3 py-1 bg-red-500 text-white rounded w-8 h-8 flex items-center justify-center">
              1
            </button>
             <button className="px-3 py-1 rounded w-8 h-8 flex items-center justify-center border border-[#e2e8f0] text-gray-400 cursor-not-allowed" disabled>
              {">"}
            </button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <PetOwnerDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
