"use client";

import { useState } from "react";
import {
  Search,
  Loader2,
  Trash2,
  Eye,
  FileBadge,
} from "lucide-react";
import { useGetPetSchoolsQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";
import { PetSchoolItem } from "@/types/dashboard/admin/dashboard/adminDashboardType";
import TablePagination from "./TablePagination";
// import UserDetailsModal from "./UserDetailsModal"; // We'll assume UserDetailsModal works for schools or needs adaptation.

export default function PetSchoolsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<PetSchoolItem | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const { data, isLoading, isError } = useGetPetSchoolsQuery({
    search: searchTerm,
    limit: itemsPerPage,
    page,
  });

  const schools = data?.data?.items || [];

  return (
    <div className="size-full bg-[#f2f4f8] -m-6 p-6 min-h-[calc(100vh-80px)]" data-name="Pet Schools">
      <div className="flex flex-col gap-[25px] w-full max-w-[1090px] mx-auto">
        
        <div className="flex flex-col gap-[8px] h-[68px] items-start shrink-0 w-full" data-name="Header">
          <h1 className="font-['Nunito',sans-serif] font-medium leading-[36px] text-[#0a0a0a] text-[30px] m-0">
            Pet Schools
          </h1>
          <p className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#4a5565] text-[16px] m-0">
            Manage all pet training and education providers
          </p>
        </div>

        <div className="bg-white border border-[#e2e8f0] flex flex-col items-start px-[17px] py-[16px] rounded-[14px] shrink-0 w-full shadow-sm">
          <div className="relative h-[42px] w-full max-w-[1056px]">
            <Search className="absolute left-[16px] top-[11px] text-[#6a7282] w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-[42px] pl-[46px] pr-[16px] py-[8px] border border-[#cad5e2] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#ff7176] focus:border-[#ff7176] transition-all font-['Inter',sans-serif] text-[16px] text-[#6a7282] bg-white placeholder:text-[#6a7282]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[white] rounded-[10px] border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1090px]">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] h-[60px]">
                  <th className="pl-[26px] pr-4 py-4 font-['Inter',sans-serif] font-semibold text-[#314158] text-[12px] uppercase tracking-[0.6px] whitespace-nowrap">
                    Provider
                  </th>
                  <th className="px-4 py-4 font-['Inter',sans-serif] font-semibold text-[#314158] text-[12px] uppercase tracking-[0.6px] whitespace-nowrap">
                    KYC Status
                  </th>
                  <th className="px-4 py-4 font-['Inter',sans-serif] font-semibold text-[#314158] text-[12px] uppercase tracking-[0.6px] whitespace-nowrap">
                    Account Status
                  </th>
                  <th className="px-4 py-4 font-['Inter',sans-serif] font-semibold text-[#314158] text-[12px] uppercase tracking-[0.6px] whitespace-nowrap text-center">
                    Courses
                  </th>
                  <th className="px-4 py-4 font-['Inter',sans-serif] font-semibold text-[#314158] text-[12px] uppercase tracking-[0.6px] whitespace-nowrap text-right">
                    Total Earnings
                  </th>
                  <th className="pr-[26px] pl-4 py-4 font-['Inter',sans-serif] font-semibold text-[#314158] text-[12px] uppercase tracking-[0.6px] whitespace-nowrap text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#ff7176] mx-auto mb-2" />
                      <p className="text-[#62748e] font-['Nunito',sans-serif] italic text-sm">
                        Loading pet schools...
                      </p>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-red-500 font-['Nunito',sans-serif]"
                    >
                      Failed to load pet schools. Please try again later.
                    </td>
                  </tr>
                ) : schools.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-[#62748e] font-['Nunito',sans-serif]"
                    >
                      No pet schools found.
                    </td>
                  </tr>
                ) : (
                  schools.map((school: PetSchoolItem) => (
                    <tr
                      key={school.id}
                      className="hover:bg-gray-50/50 transition-colors h-[68px]"
                    >
                      <td className="pl-[26px] pr-4 py-2">
                        <div className="flex flex-col items-start gap-1">
                          <p className="font-['Nunito',sans-serif] font-normal leading-[1.2] text-[#0f172b] text-[14px]">
                            {school.fullName}
                          </p>
                          <p className="font-['Nunito',sans-serif] font-normal leading-[1.2] text-[#45556c] text-[10px]">
                            {school.email}
                          </p>
                          <p className="font-['Nunito',sans-serif] font-normal leading-[1.2] text-[#62748e] text-[10px]">
                            {school.location || "San Francisco, CA"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <span
                          className={`inline-flex items-center px-[11px] py-[3px] rounded-[30px] font-['Nunito',sans-serif] font-medium leading-[16px] text-[12px] border ${
                            school.kycStatus === "APPROVED"
                              ? "bg-[#dcfce7] border-[#b9f8cf] text-[#008236]"
                              : school.kycStatus === "PENDING"
                                ? "bg-[#fef3c6] border-[#fee685] text-[#bb4d00]"
                                : school.kycStatus === "REJECTED"
                                  ? "bg-[#fee2e2] border-[#fecaca] text-[#dc2626]"
                                  : "bg-[#979797] border-[#939393] text-white"
                          }`}
                        >
                          {school.kycStatus === "APPROVED" ? "Approved" : school.kycStatus === "PENDING" ? "Pending" : school.kycStatus === "REJECTED" ? "Rejected" : "Not submitted"}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-middle">
                        <span
                          className={`inline-flex items-center px-[11px] py-[3px] rounded-[30px] font-['Nunito',sans-serif] font-medium leading-[16px] text-[12px] border flex-shrink-0 ${
                            school.status === "ACTIVE"
                              ? "bg-[#dcfce7] border-[#b9f8cf] text-[#008236]"
                              : school.status === "BANNED"
                                ? "bg-[#fee2e2] border-[#fecaca] text-[#dc2626]"
                                : "bg-[#fef3c6] border-[#fee685] text-[#bb4d00]"
                          }`}
                        >
                          {school.status === "ACTIVE" ? "Active" : school.status === "BANNED" ? "Banned" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-middle text-center">
                        <span className="font-['Nunito',sans-serif] font-semibold leading-[24px] text-[#0f172b] text-[16px]">
                          {school.totalCourses || 0}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-middle text-right">
                        <span className="font-['Nunito',sans-serif] font-semibold leading-[24px] text-[#00a63e] text-[16px]">
                          ${(school.totalEarnings || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="pr-[26px] pl-4 py-2 align-middle">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View KYC"
                            className="p-[8px] rounded-[8px] hover:bg-gray-100 transition-colors shrink-0 flex items-center justify-center text-[#ff7176] hover:text-[#e0565b]"
                          >
                            <FileBadge className="w-5 h-5 focus:outline-none" />
                          </button>
                          <button
                            onClick={() => setSelectedUser(school)}
                            title="View Details"
                            className="p-[8px] rounded-[8px] hover:bg-gray-100 transition-colors shrink-0 flex items-center justify-center text-[#62748e] hover:text-[#0f172b]"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            title="Delete"
                            className="p-[8px] rounded-[8px] hover:bg-red-50 transition-colors shrink-0 flex items-center justify-center text-[#dc2626] hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && !isError && schools.length > 0 && (
            <TablePagination
              currentPage={page}
              totalPages={Math.ceil((data?.data?.totalCount || 0) / itemsPerPage)}
              onPageChange={(p) => setPage(p)}
              totalItems={data?.data?.totalCount || 0}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </div>
{/* 
      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        variant="schoool"
      /> */}
    </div>
  );
}
