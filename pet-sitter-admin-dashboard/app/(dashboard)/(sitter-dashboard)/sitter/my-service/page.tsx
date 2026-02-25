"use client";

import { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetSitterServiceQuery,
} from "@/redux/features/api/dashboard/sitter/services/sitterServiceApi";
import { useSession } from "next-auth/react";
import { SitterService } from "@/types/profile/sitter/services/sitterServiceType";
import SitterServiceDetailsModal from "@/components/dashboard/sitter/myService/SitterServicedetailsmodal";
import CreateSitterServiceModal from "@/components/dashboard/sitter/myService/CreateSitterServiceModal";
import EditSitterServiceModal from "@/components/dashboard/sitter/myService/EditSitterServiceModal";
import DeleteServiceModal from "@/components/dashboard/sitter/myService/DeleteServiceModal";
import { format } from "date-fns";

export default function MyServicesPage() {
  const { status } = useSession();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SitterService | null>(null);

  const { data, isLoading } = useGetSitterServiceQuery(undefined, {
    skip: status === "loading",
  });

  const services = data?.data?.data ?? [];

  const handleAction = (service: SitterService, type: "view" | "edit" | "delete") => {
    setSelectedService(service);
    if (type === "view") setIsViewModalOpen(true);
    else if (type === "edit") setIsEditModalOpen(true);
    else if (type === "delete") setIsDeleteModalOpen(true);
  };

  const formatPrice = (price: number) => `$${(price / 100).toFixed(0)}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#f2f4f8] font-arimo">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-[30px] font-normal text-[#0a0a0a] leading-9">
            My Services
          </h1>
          <p className="text-base font-normal text-[#4a5565] leading-6">
            Manage your pet sitting services and availability
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#ff7176] text-white px-5 py-3 rounded-[10px] flex items-center gap-3 hover:bg-[#ff7176]/90 transition-all shadow-sm"
        >
          <Plus size={20} />
          <span className="text-base font-normal leading-6">Add New Services</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border-[#eaecf0] border-[1px] rounded-[8px] overflow-hidden">
        <div className="p-6 border-b border-[#eaecf0]">
          <h2 className="text-lg font-medium text-[#101828] leading-[28px]">
            All Services
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <tr>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-[#667085] uppercase tracking-wider">Service Name</span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-[#667085] uppercase tracking-wider">Category</span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-[#667085] uppercase tracking-wider">Price</span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-[#667085] uppercase tracking-wider">Date</span>
                </th>
                <th className="px-6 py-3 text-center">
                  <span className="text-xs font-medium text-[#667085] uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {services.map((service) => (
                <tr key={service.id} className="h-[72px] hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={service.thumbnailImage || "/placeholder-service.jpg"}
                          alt={service.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#101828]">{service.name}</span>
                        <span className="text-sm font-normal text-[#667085]">PRD-{service.id.slice(-3).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm font-normal text-[#667085]">
                      Services
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm font-normal text-[#667085]">{formatPrice(service.price)}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm font-normal text-[#667085]">
                      {service.createdAt ? format(new Date(service.createdAt), "dd-MMM-yyyy") : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleAction(service, "view")}
                        className="p-2 text-[#667085] hover:text-[#ff7176] transition-colors"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => handleAction(service, "edit")}
                        className="p-2 text-[#667085] hover:text-[#ff7176] transition-colors"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleAction(service, "delete")}
                        className="p-2 text-[#667085] hover:text-[#ff7176] transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 font-arimo italic">
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-4 flex items-center justify-between border-t border-[#eaecf0]">
          <button className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-lg text-sm font-medium text-[#344054] shadow-sm hover:bg-gray-50 transition-all">
            <ChevronLeft size={16} />
            Previous
          </button>
          <div className="flex items-center gap-0.5">
            <div className="size-10 flex items-center justify-center rounded-lg bg-[#f9f5ff] text-[#7f56d9] text-sm font-medium cursor-pointer">
              1
            </div>
            {[2, 3].map((num) => (
              <div key={num} className="size-10 flex items-center justify-center rounded-lg text-[#667085] text-sm font-medium cursor-pointer hover:bg-gray-50 transition-all">
                {num}
              </div>
            ))}
            <div className="size-10 flex items-center justify-center text-[#667085] text-sm font-medium">...</div>
            {[8, 9, 10].map((num) => (
              <div key={num} className="size-10 flex items-center justify-center rounded-lg text-[#667085] text-sm font-medium cursor-pointer hover:bg-gray-50 transition-all">
                {num}
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-lg text-sm font-medium text-[#344054] shadow-sm hover:bg-gray-50 transition-all">
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <SitterServiceDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        service={selectedService}
      />

      <CreateSitterServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedService && (
        <>
          <EditSitterServiceModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            service={selectedService}
          />
          <DeleteServiceModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            service={selectedService}
          />
        </>
      )}
    </div>
  );
}
