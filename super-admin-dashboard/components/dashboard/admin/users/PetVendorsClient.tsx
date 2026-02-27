"use client";

import React, { useState } from "react";
import {
  Search,
  Loader2,
  Trash2,
  Eye,
  FileBadge,
} from "lucide-react";
import { useGetPetVendorsQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";
import { PetVendorItem } from "@/types/dashboard/admin/dashboard/adminDashboardType";
import TablePagination from "./TablePagination";

export default function PetVendorsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<PetVendorItem | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const { data, isLoading, isError } = useGetPetVendorsQuery({
    search: searchTerm,
    limit: itemsPerPage,
    page,
  });

  const vendors = data?.data?.items || [];

  return (
    <div className="size-full bg-[#f2f4f8] -m-6 p-6 min-h-[calc(100vh-80px)]" data-name="Pet Vendors">
      {/* Container */}
      <div className="flex flex-col gap-[25px] w-[1090px] mx-auto mt-[26px]" data-name="Container">
        
        {/* Header Text */}
        <div className="flex flex-col gap-[8px] h-[68px] w-full" data-name="Container">
          <div className="h-[36px] w-full" data-name="Heading 1">
            <h1 className="font-['Nunito',sans-serif] font-medium leading-[36px] text-[#0a0a0a] text-[30px] m-0">
              Pet Vendors
            </h1>
          </div>
          <div className="h-[24px] w-full" data-name="Paragraph">
            <p className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#4a5565] text-[16px] m-0">
              Manage all pet product vendors and suppliers
            </p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white border border-[#e2e8f0] border-solid flex flex-col h-[76px] pb-px pt-[17px] px-[17px] rounded-[14px] w-full" data-name="Container">
          <div className="h-[42px] w-full" data-name="Container">
            <div className="relative h-[42px] w-[1056px]" data-name="Container">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="absolute border border-[#cad5e2] border-solid flex h-[42px] items-center left-0 pl-[40px] pr-[16px] py-[8px] rounded-[10px] top-0 w-full font-['Inter',sans-serif] font-normal leading-[24px] text-[#6a7282] text-[16px] outline-none focus:border-red-500 transition-colors"
                data-name="Text Input"
              />
              <div className="absolute left-[12px] top-[11px] text-[#6a7282]" data-name="Icon">
                <Search className="size-[20px]" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Table Container */}
      <div className="w-[1090px] mx-auto mt-[25px] bg-white border border-[#e2e8f0] border-solid rounded-[10px] overflow-hidden" data-name="Table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1090px]">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] h-[60px]">
                <th className="font-['Inter',sans-serif] font-semibold leading-[16px] px-[10px] text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle pl-[20px]">Vendor</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-[16px] px-[10px] text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle">KYC Status</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-[16px] px-[10px] text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle">Account Status</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-[16px] px-[10px] text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle text-center">Products</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-[16px] px-[10px] text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle text-right">Total Earnings</th>
                <th className="font-['Inter',sans-serif] font-semibold leading-[16px] px-[10px] text-[#314158] text-[12px] tracking-[0.6px] uppercase align-middle text-right pr-[70px]">Actions</th>
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
                    Failed to load pet vendors.
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[#62748e] font-['Nunito',sans-serif]"
                  >
                    No pet vendors found.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor: PetVendorItem) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-gray-50/50 transition-colors h-[68px]"
                  >
                    <td className="px-[10px] align-middle pl-[20px]">
                      <div className="flex flex-col">
                        <span className="font-['Nunito',sans-serif] font-normal leading-[24px] text-[#0f172b] text-[14px]">
                          {vendor.fullName}
                        </span>
                        <span className="font-['Nunito',sans-serif] font-normal leading-[20px] text-[#45556c] text-[10px]">
                          {vendor.email}
                        </span>
                        <span className="font-['Nunito',sans-serif] font-normal leading-[16px] text-[#62748e] text-[10px]">
                          {vendor.location || "Location not provided"}
                        </span>
                      </div>
                    </td>
                    <td className="px-[10px] align-middle">
                      {vendor.kycStatus === 'APPROVED' ? (
                        <div className="bg-[#dcfce7] border border-[#b9f8cf] border-solid flex h-[22px] items-center px-[11px] py-[3px] rounded-[30px] w-fit">
                          <span className="font-['Nunito',sans-serif] font-medium leading-[16px] text-[#008236] text-[12px]">
                            Approved
                          </span>
                        </div>
                      ) : vendor.kycStatus === 'PENDING' ? (
                         <div className="bg-[#fef3c6] border border-[#fee685] border-solid flex h-[22px] items-center px-[11px] py-[3px] rounded-[30px] w-fit">
                          <span className="font-['Inter',sans-serif] font-medium leading-[16px] text-[#bb4d00] text-[12px]">
                            Pending
                          </span>
                        </div>
                      ) : (
                        <div className="bg-[#f1f5f9] border border-[#e2e8f0] border-solid flex h-[22px] items-center px-[11px] py-[3px] rounded-[30px] w-fit">
                           <span className="font-['Nunito',sans-serif] font-medium leading-[16px] text-[#64748b] text-[12px]">
                             Unverified
                           </span>
                        </div>
                      )}
                    </td>
                    <td className="px-[10px] align-middle">
                        {vendor.status === 'ACTIVE' ? (
                            <div className="bg-[#dcfce7] border border-[#b9f8cf] border-solid flex h-[22px] items-center px-[11px] py-[3px] rounded-[30px] w-fit">
                                <span className="font-['Nunito',sans-serif] font-medium leading-[16px] text-[#008236] text-[12px]">
                                Active
                                </span>
                            </div>
                        ) : (
                           <div className="bg-[#fee2e2] border border-[#fecaca] border-solid flex h-[22px] items-center px-[11px] py-[3px] rounded-[30px] w-fit">
                                <span className="font-['Nunito',sans-serif] font-medium leading-[16px] text-[#ef4444] text-[12px]">
                                {vendor.status}
                                </span>
                            </div> 
                        )}
                    </td>
                    <td className="px-[10px] align-middle text-center">
                      <span className="font-['Nunito',sans-serif] font-semibold leading-[24px] text-[#0f172b] text-[16px]">
                        {vendor.totalProducts || 0}
                      </span>
                    </td>
                    <td className="px-[10px] align-middle text-right">
                      <span className="font-['Nunito',sans-serif] font-semibold leading-[24px] text-[#00a63e] text-[16px]">
                        ${(vendor.totalEarnings || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-[10px] align-middle">
                      <div className="flex gap-[4px] items-center justify-end pr-[20px]">
                        <button
                          title="View KYC"
                          className="flex flex-col items-center justify-center p-[8px] rounded-[10px] size-[40px] text-[#64748b] hover:bg-gray-100 transition-colors"
                        >
                           <FileBadge className="size-[20px]" />
                        </button>
                        <button
                          title="View Details"
                          onClick={() => setSelectedUser(vendor)}
                          className="flex flex-col items-center justify-center p-[8px] rounded-[10px] size-[40px] text-[#64748b] hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="size-[20px]" />
                        </button>
                        <button
                          title="Delete Provider"
                          className="flex items-center justify-center p-[10px] rounded-[8px] size-[40px] text-[#ef4444] hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="size-[20px]" />
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
        {!isLoading && !isError && vendors.length > 0 && (
          <TablePagination
            currentPage={page}
            totalPages={Math.ceil((data?.data?.totalCount || 0) / itemsPerPage)}
            onPageChange={(p) => setPage(p)}
            totalItems={data?.data?.totalCount || 0}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>

       {/* Need to add UserDetailsModal here eventually */}
    </div>
  );
}
