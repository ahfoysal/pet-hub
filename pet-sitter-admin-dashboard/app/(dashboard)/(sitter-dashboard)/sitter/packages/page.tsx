"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetMyPackagesQuery,
} from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";
import { useSession } from "next-auth/react";
import { SitterPackageListItem } from "@/types/dashboard/sitter/sitterPackageTypes";
import PackageDetailsModal from "@/components/dashboard/sitter/packages/PackageDetailsModal";
import CreatePackageModal from "@/components/dashboard/sitter/packages/CreatePackageModal";
import EditPackageModal from "@/components/dashboard/sitter/packages/EditPackageModal";
import DeletePackageModal from "@/components/dashboard/sitter/packages/DeletePackageModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SitterPackagesPage() {
  const { status } = useSession();
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState<SitterPackageListItem | null>(null);

  const { data, isLoading, isError, refetch } = useGetMyPackagesQuery(
    undefined,
    {
      skip: status === "loading",
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const { showToast } = useToast();

  const packages = data?.data?.data ?? [];

  // Format price (convert cents to dollars or use as is if already dollars)
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    // Assuming price from backend is in cents based on previous modal logic
    return `$${(numPrice / 100).toFixed(0)}`;
  };

  // Handlers
  const handleView = (pkg: SitterPackageListItem) => {
    setSelectedPackage(pkg);
    setIsViewModalOpen(true);
  };

  const handleEdit = (pkg: SitterPackageListItem) => {
    setSelectedPackage(pkg);
    setIsEditModalOpen(true);
  };

  const handleDelete = (pkg: SitterPackageListItem) => {
    setSelectedPackage(pkg);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = (id: string) => {
    setIsDeleteModalOpen(false);
    setSelectedPackage(null);
    refetch(); // Refetch to sync with backend
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load packages</h2>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#ff7176] text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f2f4f8] min-h-screen font-arimo p-6 sm:p-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 max-w-[1092px] mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-[30px] font-normal text-[#0a0a0a] leading-[36px]">
            My Packages
          </h1>
          <p className="text-[16px] font-normal text-[#4a5565] leading-[24px]">
            Manage your sitter packages and availability
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#ff7176] h-[48px] px-[20px] rounded-[10px] flex items-center gap-3 text-white hover:bg-[#ff7176]/90 transition-all shadow-sm"
        >
          <Plus size={20} />
          <span className="text-[16px] font-normal">Add New Package</span>
        </button>
      </div>

      {/* Main Container / Table */}
      <div className="bg-white border border-[#eaecf0] rounded-[8px] overflow-hidden max-w-[1091px] mx-auto shadow-[0px_1px_3px_rgba(16,24,40,0.1)]">
        {/* Table Header Section */}
        <div className="px-6 py-5 border-b border-[#eaecf0]">
          <h2 className="text-[18px] font-medium text-[#101828] leading-[28px]">
            All Packages
          </h2>
        </div>

        {/* Table Structure */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                <th className="px-6 h-[44px] text-left text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Package Name
                </th>
                <th className="px-6 h-[44px] text-left text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 h-[44px] text-left text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Creation Date
                </th>
                <th className="px-6 h-[44px] text-left text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="h-[72px] hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 text-[14px] font-normal text-[#667085]">
                      {pkg.name}
                    </td>
                    <td className="px-6 text-[14px] font-normal text-[#667085]">
                      {formatPrice(pkg.offeredPrice)}
                    </td>
                    <td className="px-6 text-[14px] font-normal text-[#667085]">
                      {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).replace(/ /g, '-') : '14-Oct-2026'}
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleView(pkg)}
                          className="p-2 text-[#667085] hover:text-[#ff7176] transition-colors rounded-lg border border-[#eaecf0]"
                          title="View"
                        >
                          <Eye size={20} />
                        </button>
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="p-2 text-[#667085] hover:text-[#ff7176] transition-colors rounded-lg border border-[#eaecf0]"
                          title="Edit"
                        >
                          <Pencil size={20} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(pkg)}
                          className="p-2 text-[#667085] hover:text-red-500 transition-colors rounded-lg border border-[#eaecf0]"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#667085]">
                    No packages found. Click "Add New Package" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 flex items-center justify-between bg-white border-t border-[#eaecf0]">
          <button className="flex items-center gap-2 px-[14px] py-2 bg-white border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] shadow-sm hover:bg-gray-50 transition-all">
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#f9f5ff] text-[#7f56d9] text-[14px] font-medium">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-[8px] text-[#667085] text-[14px] font-medium hover:bg-gray-50">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-[8px] text-[#667085] text-[14px] font-medium hover:bg-gray-50">
              3
            </button>
            <span className="w-10 h-10 flex items-center justify-center text-[#667085] text-[14px]">
              ...
            </span>
            <button className="w-10 h-10 flex items-center justify-center rounded-[8px] text-[#667085] text-[14px] font-medium hover:bg-gray-50">
              8
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-[8px] text-[#667085] text-[14px] font-medium hover:bg-gray-50">
              9
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-[8px] text-[#667085] text-[14px] font-medium hover:bg-gray-50">
              10
            </button>
          </div>

          <button className="flex items-center gap-2 px-[14px] py-2 bg-white border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] shadow-sm hover:bg-gray-50 transition-all">
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <PackageDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedPackage(null);
        }}
        packageId={selectedPackage?.id ?? null}
      />

      <CreatePackageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedPackage && (
        <EditPackageModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPackage(null);
          }}
          pkg={selectedPackage}
        />
      )}

      {selectedPackage && (
        <DeletePackageModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPackage(null);
          }}
          pkg={{
            id: selectedPackage.id,
            name: selectedPackage.name,
            image: selectedPackage.image,
            description: "",
            durationInMinutes: selectedPackage.durationInMinutes,
            calculatedPrice: selectedPackage.calculatedPrice,
            offeredPrice: selectedPackage.offeredPrice,
            isAvailable: true,
          }}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}