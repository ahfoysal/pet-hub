"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  useGetAdminAnalyticsQuery,
  useGetAllAdminsQuery,
} from "@/redux/features/api/dashboard/admin/manageAdmins/manageAdminsApi";
import { AdminUser } from "@/types/dashboard/admin/manageAdmins/manageAdminsType";

import AddAdminModal from "./AddAdminModal";
import EditAdminModal from "./EditAdminModal";

const ManageAdmins = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const currentCursor = cursorStack[cursorStack.length - 1] || undefined;
  const limit = 10;

  const { data: analyticsData } = useGetAdminAnalyticsQuery();
  const { data: adminsData, isLoading, isFetching, refetch } = useGetAllAdminsQuery({
    search: debouncedSearch,
    cursor: currentCursor,
    limit,
  });

  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // Implement debounced search handler
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
      setCursorStack([]);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleNextPage = () => {
    if (adminsData?.data?.nextCursor) {
      setCursorStack((prev) => [...prev, adminsData.data.nextCursor!]);
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setCursorStack((prev) => prev.slice(0, -1));
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-[36px] w-[1116px] mx-auto min-h-screen pb-[40px] pt-4">
      {/* Analytics Cards */}
      <div className="flex items-center gap-6 w-full">
        <div className="flex flex-col justify-center h-[126px] pl-[26px] bg-white rounded-xl flex-1 shrink-0 border border-solid border-[#e9e9ea]">
          <p className="font-['Arimo:Regular'] text-[15.932px] leading-[30.271px] text-[#4f4f4f]">
            Total Admins
          </p>
          <div className="flex items-center gap-[15px] mt-[5px]">
            <p className="font-['Inter:SemiBold'] font-semibold text-[31.864px] leading-[38.563px] text-[#282828]">
              {analyticsData?.data?.totalAdmins ?? 0}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center h-[126px] pl-[26px] bg-white rounded-xl flex-1 shrink-0 border border-solid border-[#e9e9ea]">
          <p className="font-['Arimo:Regular'] text-[15.932px] leading-[30.271px] text-[#4f4f4f]">
            Active
          </p>
          <div className="flex items-center gap-[15px] mt-[5px]">
            <p className="font-['Inter:SemiBold'] font-semibold text-[31.864px] leading-[38.563px] text-[#282828]">
              {analyticsData?.data?.activeAdmins ?? 0}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center h-[126px] pl-[26px] bg-white rounded-xl flex-1 shrink-0 border border-solid border-[#e9e9ea]">
          <p className="font-['Arimo:Regular'] text-[15.932px] leading-[30.271px] text-[#4f4f4f]">
            Suspended
          </p>
          <div className="flex items-center gap-[15px] mt-[5px]">
            <p className="font-['Inter:SemiBold'] font-semibold text-[31.864px] leading-[38.563px] text-[#282828]">
              {analyticsData?.data?.suspendedAdmins ?? 0}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-[1116px] min-h-[400px]">
        {/* Actions Bar */}
        <div className="flex justify-between items-center w-full mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[300px] h-[45px] pl-10 pr-4 bg-white border border-[#d0d0d0] rounded-[8px] outline-none font-['Montserrat:Medium'] text-[14px] leading-[22px] text-[#4f4f4f] placeholder:text-gray-400"
            />
          </div>
          <Button
            onClick={() => setIsAddAdminModalOpen(true)}
            className="w-[160px] h-[45px] rounded-[10px] bg-[#E50914] hover:bg-[#E50914]/90 text-white font-bold"
          >
            + Add Admin
          </Button>
        </div>

        {/* Table Head */}
        <div className="bg-[#f0f2f5] rounded-t-xl overflow-hidden min-w-[700px] border border-solid border-[#d0d0d0] border-b-0">
          <table className="w-full text-left font-['Arial:Regular'] text-[18px] text-[#4f4f4f]">
            <thead className="bg-[#f2f4f8]">
              <tr className="flex items-center h-[52px] border-b border-solid border-[#d0d0d0]">
                <th className="font-normal w-[220px] px-8 pl-[60px]">Admin Name</th>
                <th className="font-normal w-[240px] px-8">Email</th>
                <th className="font-normal w-[180px] px-8">Phone No.</th>
                <th className="font-normal w-[160px] px-8">Join Date</th>
                <th className="font-normal w-[140px] px-8 text-center">Status</th>
                <th className="font-normal flex-1 px-8 text-center text-[#ff3b30]">Action</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className="w-full bg-white border border-solid border-[#d0d0d0] rounded-b-xl overflow-hidden">
          <table className="w-full text-left font-['Arial:Regular'] text-[16px] text-[#4f4f4f]">
            <tbody>
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    Loading Admins...
                  </td>
                </tr>
              ) : adminsData?.data?.data && adminsData.data.data.length > 0 ? (
                adminsData.data.data.map((admin: AdminUser) => (
                  <tr
                    key={admin.id}
                    className="flex items-center h-[65px] border-b border-solid border-[#e5e5e5] last:border-b-0 group hover:bg-gray-50"
                  >
                    <td className="w-[220px] px-8 pl-[60px] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">
                        {admin.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate" title={admin.fullName}>{admin.fullName}</span>
                    </td>
                    <td className="w-[240px] px-8 truncate" title={admin.email}>{admin.email}</td>
                    <td className="w-[180px] px-8">{admin.phone || "N/A"}</td>
                    <td className="w-[160px] px-8">
                      {format(new Date(admin.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="w-[140px] px-8 text-center">
                      <span
                        className={`inline-block w-[100px] h-[33px] leading-[33px] text-center rounded-[8px] font-medium text-[14px] ${
                          admin.status === "ACTIVE"
                            ? "bg-[#e8f5e9] text-[#22c55e]"
                            : admin.status === "SUSPENDED"
                            ? "bg-[#fff8e1] text-[#f59e0b]"
                            : "bg-[#ffebee] text-[#ef4444]"
                        }`}
                      >
                        {admin.status.charAt(0) + admin.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="flex-1 px-8 flex justify-center items-center gap-[22px]">
                      {/* Edit Button */}
                      <button 
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsEditAdminModalOpen(true);
                        }}
                        className="flex justify-center items-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Image
                          src="/assets/b4459b4b9dd24dc85c78c2e1cb4a5bfaacd1133d.svg"
                          alt="Edit"
                          width={16}
                          height={16}
                        />
                      </button>
                      {/* Delete / Suspend Button */}
                      <button className="flex justify-center items-center w-8 h-8 rounded-full bg-[#ffebee] hover:bg-red-100 transition-colors">
                        <Image
                          src="/assets/5c3ec2832ef409d939b1e8d9cad9f054d311727a.svg"
                          alt="Delete"
                          width={16}
                          height={16}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-solid border-[#e5e5e5] gap-4">
            <span className="text-sm text-gray-500">Page {page}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!adminsData?.data?.nextCursor}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditAdminModal
        isOpen={isEditAdminModalOpen}
        onClose={() => {
          setIsEditAdminModalOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default ManageAdmins;
