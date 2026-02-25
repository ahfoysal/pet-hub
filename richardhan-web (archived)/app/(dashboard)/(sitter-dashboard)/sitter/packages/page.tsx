"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetMyPackagesQuery,
  useTogglePackageAvailabilityMutation,
} from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";
import { useSession } from "next-auth/react";
import { SitterPackageListItem } from "@/types/dashboard/sitter/sitterPackageTypes";
import PackageDetailsModal from "@/components/dashboard/sitter/packages/PackageDetailsModal";
import CreatePackageModal from "@/components/dashboard/sitter/packages/CreatePackageModal";
import EditPackageModal from "@/components/dashboard/sitter/packages/EditPackageModal";
import DeletePackageModal from "@/components/dashboard/sitter/packages/DeletePackageModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SitterPackagesPage() {
  const { status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState<SitterPackageListItem | null>(null);

  // Local state to track availability (since /me endpoint doesn't return isAvailable)
  const [availabilityMap, setAvailabilityMap] = useState<
    Record<string, boolean>
  >({});

  // Persist deleted package IDs in localStorage so they survive refetches & page reloads
  // (backend soft-deletes packages but /me still returns them)
  const DELETED_STORAGE_KEY = "sitter_deleted_package_ids";
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(DELETED_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const { data, isLoading, isError, refetch } = useGetMyPackagesQuery(
    undefined,
    {
      skip: status === "loading",
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [toggleAvailability, { isLoading: isToggling }] =
    useTogglePackageAvailabilityMutation();

  const { showToast } = useToast();

  const rawPackages = data?.data?.data ?? [];

  // Filter out soft-deleted packages from API AND locally deleted ones
  const packages = rawPackages.filter(
    (pkg) =>
      !deletedIds.includes(pkg.id) &&
      !pkg.isDeleted &&
      !pkg.deletedAt
  );

  // Initialize availability map when packages load
  // Default to true for all packages (newly created = available)
  useEffect(() => {
    if (packages.length > 0) {
      setAvailabilityMap((prev) => {
        const updated = { ...prev };
        packages.forEach((pkg) => {
          // Only set if not already tracked
          if (updated[pkg.id] === undefined) {
            // Use isAvailable from API if present, default to true
            updated[pkg.id] =
              (pkg as any).isAvailable !== undefined
                ? (pkg as any).isAvailable
                : true;
          }
        });
        return updated;
      });
    }
  }, [rawPackages]);

  // Helper to get availability
  const getAvailability = (pkgId: string) => {
    if (availabilityMap[pkgId] !== undefined) return availabilityMap[pkgId];
    return true; // default available
  };

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const isAvailable = getAvailability(pkg.id);
    const matchesFilter =
      availabilityFilter === "ALL" ||
      (availabilityFilter === "AVAILABLE" && isAvailable) ||
      (availabilityFilter === "UNAVAILABLE" && !isAvailable);

    return matchesSearch && matchesFilter;
  });

  // Stats calculations
  const totalPackages = packages.length;
  const availablePackages = packages.filter((p) =>
    getAvailability(p.id)
  ).length;
  const unavailablePackages = totalPackages - availablePackages;
  const avgDuration =
    totalPackages > 0
      ? Math.round(
          packages.reduce((acc, p) => acc + p.durationInMinutes, 0) /
            totalPackages
        )
      : 0;

  // Format price (convert cents to dollars)
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `$${(numPrice / 100).toFixed(2)}`;
  };

  // Handle successful package deletion — save to localStorage so it persists
  const handleDeleteSuccess = (id: string) => {
    const updated = [...deletedIds, id];
    setDeletedIds(updated);
    try {
      localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage full or unavailable, state still works for current session
    }
    setIsDeleteModalOpen(false);
    setSelectedPackage(null);
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



  const handleToggleAvailability = async (pkg: SitterPackageListItem) => {
    try {
      const result = await toggleAvailability(pkg.id).unwrap();
      // Flip the local availability state
      setAvailabilityMap((prev) => ({
        ...prev,
        [pkg.id]: !getAvailability(pkg.id),
      }));
      showToast(result.message || "Availability updated", "success");
    } catch (err: any) {
      showToast(
        err?.data?.message || "Failed to update availability",
        "error"
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load packages
          </h2>
          <p className="text-gray-500 mb-5">
            Something went wrong. Please try again.
          </p>
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
            My Packages
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your pet sitting service packages
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span className="whitespace-nowrap">Add Package</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search packages by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
              style={{ border: "none" }}
            />
          </div>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all min-w-[160px]"
            style={{ border: "none" }}
          >
            <option value="ALL">All Packages</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Packages */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Total Packages
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {totalPackages}
              </p>
            </div>
            <div className="order-1 sm:order-2 p-2.5 sm:p-3.5 bg-blue-50 rounded-xl w-fit transition-transform duration-300 group-hover:scale-110">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="order-2 sm:order-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Available
              </p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                {availablePackages}
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
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Unavailable
              </p>
              <p className="text-xl sm:text-2xl font-bold text-red-500 mt-1">
                {unavailablePackages}
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
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Avg Duration
              </p>
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

      {/* Packages Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Packages
            <span className="ml-2 text-sm font-normal text-gray-500">
              {filteredPackages.length} package
              {filteredPackages.length !== 1 ? "s" : ""}
            </span>
          </h2>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg, index) => {
              const isAvailable = getAvailability(pkg.id);
              return (
                <div
                  key={pkg.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                  style={{
                    borderTop: index !== 0 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={pkg.image || "/placeholder-service.jpg"}
                      alt={pkg.name}
                      className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(pkg.offeredPrice)}
                        </span>
                        {pkg.calculatedPrice &&
                          parseFloat(pkg.offeredPrice) <
                            parseFloat(pkg.calculatedPrice) && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(pkg.calculatedPrice)}
                            </span>
                          )}
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {pkg.durationInMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    {/* Availability Toggle */}
                    <button
                      onClick={() => handleToggleAvailability(pkg)}
                      disabled={isToggling}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isAvailable ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            isAvailable ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isAvailable ? "text-emerald-600" : "text-gray-500"
                        }`}
                      >
                        {isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleView(pkg)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-600">
                No packages found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || availabilityFilter !== "ALL"
                  ? "Try adjusting your search or filter"
                  : "Create your first package to get started"}
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
                  Package
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Offered Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Calculated Price
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
              {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg, index) => {
                  const isAvailable = getAvailability(pkg.id);
                  const hasDiscount =
                    pkg.calculatedPrice &&
                    parseFloat(pkg.offeredPrice) <
                      parseFloat(pkg.calculatedPrice);
                  return (
                    <tr
                      key={pkg.id}
                      className="hover:bg-gray-50/50 transition-colors"
                      style={{
                        borderTop:
                          index !== 0 ? "1px solid #f3f4f6" : "none",
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={pkg.image || "/placeholder-service.jpg"}
                            alt={pkg.name}
                            className="h-11 w-11 rounded-xl object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {pkg.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {pkg.durationInMinutes} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPrice(pkg.offeredPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            hasDiscount
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {formatPrice(pkg.calculatedPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(pkg)}
                          disabled={isToggling}
                          className="flex items-center gap-2 group"
                        >
                          <div
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isAvailable ? "bg-emerald-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                isAvailable
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              isAvailable
                                ? "text-emerald-600"
                                : "text-gray-500"
                            }`}
                          >
                            {isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(pkg)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(pkg)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(pkg)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-base font-medium text-gray-600">
                      No packages found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchTerm || availabilityFilter !== "ALL"
                        ? "Try adjusting your search or filter"
                        : "Create your first package to get started"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            isAvailable: getAvailability(selectedPackage.id),
          }}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}