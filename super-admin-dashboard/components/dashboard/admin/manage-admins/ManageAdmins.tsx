"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import {
  useGetAdminAnalyticsQuery,
  useGetAllAdminsQuery,
} from "@/redux/features/api/dashboard/admin/manageAdmins/manageAdminsApi";
import { AdminUser } from "@/types/dashboard/admin/manageAdmins/manageAdminsType";

import Link from "next/link";
import EditAdminModal from "./EditAdminModal";
import AdminDetailsModal from "./AdminDetailsModal";
import DeleteAdminModal from "./DeleteAdminModal";
import { useDeleteAdminMutation } from "@/redux/features/api/dashboard/admin/manageAdmins/manageAdminsApi";
import { toast } from "react-toastify";

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

  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [isAdminDetailsModalOpen, setIsAdminDetailsModalOpen] = useState(false);
  const [isDeleteAdminModalOpen, setIsDeleteAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

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

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;
    try {
      const res = await deleteAdmin(selectedAdmin.id).unwrap();
      if (res.success) {
        toast.success("Admin deleted successfully");
        setIsDeleteAdminModalOpen(false);
        setSelectedAdmin(null);
        refetch();
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to delete admin");
    }
  };

  return (
    <div className="flex flex-col gap-[36px] w-[1116px] mx-auto min-h-screen pb-[40px] pt-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-[8px]">
          <h1 className="font-['Nunito'] font-semibold text-[30px] leading-[36px] text-[#282828] m-0">
            All Admins
          </h1>
          <p className="font-['Arimo'] font-normal text-[16px] leading-[24px] text-[#4a5565] m-0">
            Manage platform administrators and their access
          </p>
        </div>
        <Link
          href="/admin/manage-admins/add-admin"
          className="bg-[#ff7176] flex items-center justify-center gap-[8px] h-[48px] px-[21px] py-[10px] rounded-[10px] hover:bg-[#ff5c62] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M10 4.16663V15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.16663 10H15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-['Inter'] font-medium text-[16px] leading-[24px] text-white">
            Add New Admin
          </span>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-4 gap-6 w-full h-[110px]">
        <div className="bg-white border border-[#e2e8f0] border-solid flex flex-col items-start justify-center pb-px pt-[25px] px-[25px] rounded-[14px]">
          <p className="font-['Inter'] font-normal text-[#45556c] text-[14px] leading-[20px] w-full">
            Total Admins
          </p>
          <p className="font-['Inter'] font-bold text-[#0f172b] text-[30px] leading-[36px] w-full mt-1">
            {analyticsData?.data?.totalAdmins ?? 0}
          </p>
        </div>

        <div className="bg-white border border-[#e2e8f0] border-solid flex flex-col items-start justify-center pb-px pt-[25px] px-[25px] rounded-[14px]">
          <p className="font-['Inter'] font-normal text-[#45556c] text-[14px] leading-[20px] w-full">
            Active Admins
          </p>
          <p className="font-['Inter'] font-bold text-[#00a63e] text-[30px] leading-[36px] w-full mt-1">
            {analyticsData?.data?.activeAdmins ?? 0}
          </p>
        </div>

        <div className="bg-white border border-[#e2e8f0] border-solid flex flex-col items-start justify-center pb-px pt-[25px] px-[25px] rounded-[14px]">
          <p className="font-['Inter'] font-normal text-[#45556c] text-[14px] leading-[20px] w-full">
            Suspended
          </p>
          <p className="font-['Inter'] font-bold text-[#e7000b] text-[30px] leading-[36px] w-full mt-1">
            {analyticsData?.data?.suspendedAdmins ?? 0}
          </p>
        </div>

        <div className="bg-white border border-[#e2e8f0] border-solid flex flex-col items-start justify-center pb-px pt-[25px] px-[25px] rounded-[14px]">
          <p className="font-['Inter'] font-normal text-[#45556c] text-[14px] leading-[20px] w-full">
            Full Access
          </p>
          <p className="font-['Inter'] font-bold text-[#ff7176] text-[30px] leading-[36px] w-full mt-1">
            {adminsData?.data?.data?.filter((a: AdminUser) => !a.role || a.role === "ADMIN" || a.role === "SUPER_ADMIN")?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="flex flex-col w-[1116px] min-h-[400px]">
        {/* Actions Bar */}
        <div className="flex gap-5 items-center w-full mb-6">
          <div className="bg-white border border-[#e2e8f0] border-solid flex flex-col h-[67px] items-center justify-center px-[16px] rounded-[14px] shrink-0 w-[811px]">
            <div className="relative w-full h-[42px]">
              <Search className="absolute left-[12px] top-[11px] w-[20px] h-[20px] text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="absolute left-0 top-0 w-full h-[42px] pl-[40px] pr-[16px] py-[8px] bg-transparent border border-[#cad5e2] rounded-[10px] outline-none font-['Nunito'] text-[16px] leading-[24px] text-[#0a0a0a] placeholder:text-[#0a0a0a]"
              />
            </div>
          </div>
          
          <div className="bg-white border border-[#e2e8f0] border-solid flex flex-col h-[67px] items-start justify-center px-[15px] py-[10px] rounded-[12px] shrink-0 flex-1">
            <div className="relative border border-[#cad5e2] border-solid h-[41px] rounded-[10px] w-full flex items-center pr-4">
              <select className="appearance-none w-full h-full bg-transparent outline-none font-['Nunito'] text-[16px] text-[#282828] pl-[14px] cursor-pointer z-10">
                <option value="">All Role</option>
                <option value="ADMIN">Super Administrator</option>
              </select>
              <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="#282828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Head */}
        <div className="bg-[#f8fafc] border-b border-[#e2e8f0] border-solid h-[49px] rounded-t-[6px] shrink-0 w-full">
          <div className="flex h-[49px] items-start w-full relative">
            <div className="flex h-full items-center px-[24px] w-[203px] shrink-0">
              <span className="font-['Inter'] font-semibold leading-[16px] text-[#314158] text-[12px] tracking-[0.6px] uppercase">Admin</span>
            </div>
            <div className="flex h-full items-center px-[24px] w-[160px] shrink-0">
              <span className="font-['Inter'] font-semibold leading-[16px] text-[#314158] text-[12px] tracking-[0.6px] uppercase">Role</span>
            </div>
            <div className="flex h-full items-center px-[24px] w-[128px] shrink-0">
              <span className="font-['Inter'] font-semibold leading-[16px] text-[#314158] text-[12px] tracking-[0.6px] uppercase">Access Level</span>
            </div>
            <div className="flex h-full items-center px-[24px] w-[109px] shrink-0">
              <span className="font-['Inter'] font-semibold leading-[16px] text-[#314158] text-[12px] tracking-[0.6px] uppercase">Status</span>
            </div>
            <div className="flex h-full items-center px-[24px] w-[109px] shrink-0">
              <span className="font-['Inter'] font-semibold leading-[16px] text-[#314158] text-[12px] tracking-[0.6px] uppercase">Date Added</span>
            </div>
            <div className="flex h-full items-center px-[24px] w-[214px] shrink-0">
              <span className="font-['Inter'] font-semibold leading-[16px] text-[#314158] text-[12px] tracking-[0.6px] uppercase">Last Login</span>
            </div>
            <div className="flex h-full items-center px-[24px] flex-1">
              <span className="font-['Inter'] font-semibold leading-[16px] text-[#314158] text-[12px] tracking-[0.6px] uppercase">Actions</span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="w-full bg-white border border-t-0 border-[#d0d0d0] rounded-b-[10px] overflow-hidden">
          <div className="w-full flex flex-col">
              {isLoading || isFetching ? (
                <div className="flex h-[70px] items-center justify-center text-center">
                  Loading Admins...
                </div>
              ) : adminsData?.data?.data && adminsData.data.data.length > 0 ? (
                adminsData.data.data.map((admin: AdminUser, idx: number) => (
                  <div
                    key={admin.id}
                    className={`flex items-center h-[72px] bg-white border-b border-solid border-[#e2e8f0] relative ${idx === adminsData.data.data.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <div className="flex h-full items-center px-[24px] w-[203px] shrink-0 gap-[8px]">
                      <div className="bg-gradient-to-b from-[#ff7176] to-[#ff8a8e] flex items-center justify-center rounded-full shrink-0 h-[40px] w-[40px]">
                        <span className="font-['Inter'] font-semibold leading-[20px] text-[14px] text-white">
                          {admin.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center h-full gap-0 overflow-hidden">
                        <p className="font-['Inter'] font-medium leading-[24px] text-[#0f172b] text-[14px] truncate w-full" title={admin.fullName}>
                          {admin.fullName}
                        </p>
                        <p className="font-['Inter'] font-normal leading-[20px] text-[#45556c] text-[12px] truncate w-full" title={admin.email}>
                          {admin.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex h-full items-center px-[24px] w-[160px] shrink-0">
                      <div className="bg-[#f3e8ff] border border-[#e9d4ff] flex items-center justify-center px-[11px] py-[3px] rounded-full max-w-full">
                        <span className="font-['Inter'] font-medium leading-[16px] text-[#8200db] text-[12px] truncate">
                          {!admin.role || admin.role.toUpperCase() === "ADMIN" || admin.role.toUpperCase() === "SUPER_ADMIN" ? "Super Administrator" : "Admin"}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-full items-center px-[24px] w-[128px] shrink-0">
                      <div className={`border flex items-center justify-center px-[11px] py-[3px] rounded-full ${
                        (!admin.role || admin.role.toUpperCase() === "ADMIN" || admin.role.toUpperCase() === "SUPER_ADMIN") ? "bg-[#dcfce7] border-[#b9f8cf]" : "bg-[#fef3c6] border-[#fee685]"
                      }`}>
                         <span className={`font-['Inter'] font-medium leading-[16px] text-[12px] truncate ${
                           (!admin.role || admin.role.toUpperCase() === "ADMIN" || admin.role.toUpperCase() === "SUPER_ADMIN") ? "text-[#008236]" : "text-[#bb4d00]"
                         }`}>
                            {!admin.role || admin.role.toUpperCase() === "ADMIN" || admin.role.toUpperCase() === "SUPER_ADMIN" ? "Full Access" : "Limited Access"}
                         </span>
                      </div>
                    </div>

                    <div className="flex h-full items-center px-[24px] w-[109px] shrink-0">
                      <div className={`border flex items-center justify-center px-[11px] py-[3px] rounded-full ${
                         admin.status === "ACTIVE" ? "bg-[#dcfce7] border-[#b9f8cf]" : admin.status === "SUSPENDED" ? "bg-[#fff8e1] border-[#fde68a]" : "bg-[#ffebee] border-[#ffcdd2]"
                      }`}>
                         <span className={`font-['Inter'] font-medium leading-[16px] text-[12px] truncate ${
                           admin.status === "ACTIVE" ? "text-[#008236]" : admin.status === "SUSPENDED" ? "text-[#b45309]" : "text-[#b91c1c]"
                         }`}>
                           {admin.status.charAt(0) + admin.status.slice(1).toLowerCase()}
                         </span>
                      </div>
                    </div>

                    <div className="flex h-full items-center px-[24px] w-[109px] shrink-0">
                      <span className="font-['Inter'] font-normal leading-[20px] text-[#45556c] text-[14px]">
                        {format(new Date(admin.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="flex h-full items-center px-[24px] w-[214px] shrink-0 gap-[7px]">
                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M8.00004 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00004C14.6667 4.31814 11.6819 1.33337 8.00004 1.33337C4.31814 1.33337 1.33337 4.31814 1.33337 8.00004C1.33337 11.6819 4.31814 14.6667 8.00004 14.6667Z" stroke="#45556C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M8 4V8L10.6667 9.33333" stroke="#45556C" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                      <span className="font-['Inter'] font-normal leading-[20px] text-[#45556c] text-[14px]">
                        2024-02-23 09:15 AM
                      </span>
                    </div>

                    <div className="flex h-full items-center px-[24px] flex-1 gap-2">
                      <button 
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsAdminDetailsModalOpen(true);
                        }}
                        className="flex items-center justify-center w-[40px] h-[40px] hover:bg-gray-100 rounded-[8px] transition-colors"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#45556C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="#45556C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsEditAdminModalOpen(true);
                        }}
                        className="flex items-center justify-center w-[40px] h-[40px] hover:bg-gray-100 rounded-[8px] transition-colors"
                      >
                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.1667 2.49993C14.3855 2.28114 14.6453 2.10759 14.9314 1.98921C15.2174 1.87084 15.5242 1.81006 15.8341 1.81006C16.1439 1.81006 16.4507 1.87084 16.7368 1.98921C17.0229 2.10759 17.2827 2.28114 17.5015 2.49993C17.7203 2.71871 17.8938 2.97851 18.0122 3.26463C18.1306 3.55074 18.1913 3.85754 18.1913 4.16743C18.1913 4.47732 18.1306 4.78411 18.0122 5.07023C17.8938 5.35634 17.7203 5.61614 17.5015 5.83493L5.83482 17.5016L1.66815 18.3349L2.50148 14.1683L14.1667 2.49993Z" stroke="#45556C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setIsDeleteAdminModalOpen(true);
                        }}
                        className="flex items-center justify-center w-[40px] h-[40px] hover:bg-gray-100 rounded-[8px] transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 5H4.16667H17.5" stroke="#45556C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.66666 5.00008V3.33341C6.66666 2.89139 6.84225 2.46746 7.15481 2.1549C7.46737 1.84234 7.8913 1.66675 8.33332 1.66675H11.6667C12.1087 1.66675 12.5326 1.84234 12.8452 2.1549C13.1577 2.46746 13.3333 2.89139 13.3333 3.33341V5.00008M15.8333 5.00008V16.6667C15.8333 17.1088 15.6577 17.5327 15.3452 17.8453C15.0326 18.1578 14.6087 18.3334 14.1667 18.3334H5.83332C5.39129 18.3334 4.96737 18.1578 4.65481 17.8453C4.34225 17.5327 4.16666 17.1088 4.16666 16.6667V5.00008H15.8333Z" stroke="#45556C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.33334 9.16675V14.1668" stroke="#45556C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.6667 9.16675V14.1668" stroke="#45556C" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-[70px] items-center justify-center text-center">
                    No admins found.
                </div>
              )}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-solid border-[#e2e8f0]">
             <Button
                variant="outline"
                className="h-[36px] bg-white border-[#d0d0d0] text-[#0a0a0a] font-['Nunito'] hover:bg-gray-50 rounded-[8px]"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                Previous
              </Button>

              {/* Dynamic Number List */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil((adminsData?.data?.total || 0) / limit) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                        // For now, this only works if navigating to adjacent pages due to cursor-based backend
                        // But satisfying the visual requirement first
                        if (p > page) handleNextPage();
                        else if (p < page) handlePrevPage();
                    }}
                    className={`w-[40px] h-[40px] rounded-[8px] flex justify-center items-center font-['Inter'] font-medium text-[14px] ${
                      page === p ? "bg-[#f8fafc] text-[#334155] border border-[#e2e8f0]" : "bg-white text-[#45556c] hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="h-[36px] bg-white border-[#d0d0d0] text-[#0a0a0a] font-['Nunito'] hover:bg-gray-50 rounded-[8px]"
                onClick={handleNextPage}
                disabled={!adminsData?.data?.nextCursor}
              >
                Next
              </Button>
          </div>
        </div>
      </div>
      
      <EditAdminModal
        isOpen={isEditAdminModalOpen}
        onClose={() => {
          setIsEditAdminModalOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onSuccess={() => refetch()}
      />

      <AdminDetailsModal 
        isOpen={isAdminDetailsModalOpen}
        onClose={() => {
          setIsAdminDetailsModalOpen(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
      />

      <DeleteAdminModal 
        isOpen={isDeleteAdminModalOpen}
        onClose={() => {
          setIsDeleteAdminModalOpen(false);
          setSelectedAdmin(null);
        }}
        onConfirm={handleDeleteAdmin}
        admin={selectedAdmin}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManageAdmins;
