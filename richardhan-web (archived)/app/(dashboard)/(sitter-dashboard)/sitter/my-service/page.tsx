"use client";

import { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetSitterServiceQuery,
  useToggleServiceAvailabilityMutation,
} from "@/redux/features/api/dashboard/sitter/services/sitterServiceApi";
import { useSession } from "next-auth/react";
import { SitterService } from "@/types/profile/sitter/services/sitterServiceType";
import SitterServiceDetailsModal from "@/components/dashboard/sitter/myService/SitterServicedetailsmodal";
import CreateSitterServiceModal from "@/components/dashboard/sitter/myService/CreateSitterServiceModal";
import EditSitterServiceModal from "@/components/dashboard/sitter/myService/EditSitterServiceModal";
import DeleteServiceModal from "@/components/dashboard/sitter/myService/DeleteServiceModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Helper to clean tags/whatsIncluded that may have been stored as JSON strings
const cleanArrayData = (arr: string[]): string[] => {
  if (!arr || arr.length === 0) return [];
  
  return arr.flatMap((item) => {
    // Check if item looks like a JSON array string
    if (item.startsWith("[") && item.endsWith("]")) {
      try {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Not valid JSON, continue
      }
    }
    // Check if it's a comma-separated string
    if (item.includes(",") && !item.startsWith("[")) {
      return item.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return item;
  }).filter(Boolean);
};

export default function MyServicesPage() {
  const { status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SitterService | null>(null);

  const { data, isLoading, isError, refetch } = useGetSitterServiceQuery(undefined, {
    skip: status === "loading",
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [toggleAvailability, { isLoading: isToggling }] = useToggleServiceAvailabilityMutation();

  const { showToast } = useToast();

  const services = data?.data?.data ?? [];

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      availabilityFilter === "ALL" ||
      (availabilityFilter === "AVAILABLE" && service.isAvailable) ||
      (availabilityFilter === "UNAVAILABLE" && !service.isAvailable);

    return matchesSearch && matchesFilter;
  });

  // Stats calculations
  const totalServices = services.length;
  const availableServices = services.filter((s) => s.isAvailable).length;
  const unavailableServices = services.filter((s) => !s.isAvailable).length;
  const avgDuration = totalServices > 0
    ? Math.round(services.reduce((acc, s) => acc + s.durationInMinutes, 0) / totalServices)
    : 0;

  // Format price (convert cents to dollars)
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `$${(numPrice / 100).toFixed(2)}`;
  };

  // Handlers
  const handleView = (service: SitterService) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleEdit = (service: SitterService) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const handleDelete = (service: SitterService) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleToggleAvailability = async (service: SitterService) => {
    try {
      const result = await toggleAvailability(service.id).unwrap();
      showToast(result.message || "Availability updated", "success");
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update availability", "error");
    }
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedService(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load services</h2>
          <p className="text-gray-500 mb-5">Something went wrong. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground font-bold">
            My Services
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your pet sitting services
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span className="whitespace-nowrap">Add Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search services by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border-0"
            />
          </div>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border-0 min-w-[160px]"
          >
            <option value="ALL">All Services</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Services */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Services</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {totalServices}
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-blue-50 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Available</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                {availableServices}
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-emerald-50 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Unavailable */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Unavailable</p>
              <p className="text-xl sm:text-2xl font-bold text-red-500 mt-1">
                {unavailableServices}
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-red-50 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Avg Duration */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Avg Duration</p>
              <p className="text-xl sm:text-2xl font-bold text-primary mt-1">
                {avgDuration} min
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-primary/10 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Services
            <span className="ml-2 text-sm font-normal text-gray-500">
              {filteredServices.length} services
            </span>
          </h2>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <div
                key={service.id}
                className="p-4 hover:bg-gray-50/50 transition-colors"
                style={{ borderTop: index !== 0 ? "1px solid #f3f4f6" : "none" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={service.thumbnailImage?.trim() || "/placeholder-service.jpg"}
                    alt={service.name}
                    className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {service.durationInMinutes} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => handleToggleAvailability(service)}
                    disabled={isToggling}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        service.isAvailable ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                          service.isAvailable ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${service.isAvailable ? "text-emerald-600" : "text-gray-500"}`}>
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(service)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-600">No services found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || availabilityFilter !== "ALL"
                  ? "Try adjusting your search or filter"
                  : "Create your first service to get started"}
              </p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50/50 transition-colors"
                    style={{ borderTop: index !== 0 ? "1px solid #f3f4f6" : "none" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={service.thumbnailImage?.trim() || "/placeholder-service.jpg"}
                          alt={service.name}
                          className="h-11 w-11 rounded-xl object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {service.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.durationInMinutes} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(service.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(service)}
                        disabled={isToggling}
                        className="flex items-center gap-2 group"
                      >
                        <div
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            service.isAvailable ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                              service.isAvailable ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </div>
                        <span className={`text-xs font-medium ${service.isAvailable ? "text-emerald-600" : "text-gray-500"}`}>
                          {service.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(service)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-base font-medium text-gray-600">No services found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchTerm || availabilityFilter !== "ALL"
                        ? "Try adjusting your search or filter"
                        : "Create your first service to get started"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder for future cursor-based pagination */}
        {data?.data?.pagination?.hasNextPage && (
          <div className="px-5 sm:px-6 py-4 flex items-center justify-center bg-gray-50/50">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <SitterServiceDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedService(null);
        }}
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
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedService(null);
            }}
            service={selectedService}
          />
          
          <DeleteServiceModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedService(null);
            }}
            service={selectedService}
          />
        </>
      )}
    </div>
  );
}
