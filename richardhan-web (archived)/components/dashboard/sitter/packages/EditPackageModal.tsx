"use client";

import { useState, useEffect } from "react";
import { X, Upload, Search, Check } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useUpdatePackageMutation, useGetPackageByIdQuery } from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";
import { useGetSitterServiceQuery } from "@/redux/features/api/dashboard/sitter/services/sitterServiceApi";
import { SitterPackageListItem } from "@/types/dashboard/sitter/sitterPackageTypes";

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: SitterPackageListItem | null;
}

export default function EditPackageModal({
  isOpen,
  onClose,
  pkg,
}: EditPackageModalProps) {
  const { showToast } = useToast();
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();

  // Fetch full package details (includes services)
  const { data: packageDetails } = useGetPackageByIdQuery(pkg?.id ?? "", {
    skip: !isOpen || !pkg?.id,
  });

  const { data: servicesData } = useGetSitterServiceQuery(undefined, {
    skip: !isOpen,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    offeredPrice: "",
    durationInMinutes: "",
    serviceIds: [] as string[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [serviceSearch, setServiceSearch] = useState("");

  const services = servicesData?.data?.data ?? [];
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Populate form when package details load
  useEffect(() => {
    if (packageDetails?.data && isOpen) {
      const detail = packageDetails.data;
      const priceInDollars = detail.offeredPrice
        ? (parseFloat(detail.offeredPrice) / 100).toFixed(2)
        : "";

      setFormData({
        name: detail.name || "",
        description: detail.description || "",
        offeredPrice: priceInDollars,
        durationInMinutes: detail.durationInMinutes?.toString() || "",
        serviceIds: detail.services?.map((s) => s.id) || [],
      });
      setImagePreview(detail.image || null);
    }
  }, [packageDetails, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast("Package name is required", "error");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Description is required", "error");
      return;
    }
    if (
      !formData.durationInMinutes ||
      parseInt(formData.durationInMinutes) < 1
    ) {
      showToast("Duration must be at least 1 minute", "error");
      return;
    }

    try {
      const packageData = new FormData();
      packageData.append("name", formData.name);
      packageData.append("description", formData.description);
      if (formData.offeredPrice) {
        const priceInCents = Math.round(
          parseFloat(formData.offeredPrice) * 100
        );
        packageData.append("offeredPrice", priceInCents.toString());
      }
      packageData.append("durationInMinutes", formData.durationInMinutes);
      if (formData.serviceIds.length > 0) {
        formData.serviceIds.forEach((id) => {
          packageData.append("serviceIds", id);
        });
      }
      if (imageFile) {
        packageData.append("file", imageFile);
      }

      if (pkg?.id) {
        await updatePackage({ id: pkg.id, data: packageData }).unwrap();
        showToast("Package updated successfully", "success");
        handleClose();
      }
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update package", "error");
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      offeredPrice: "",
      durationInMinutes: "",
      serviceIds: [],
    });
    setImagePreview(null);
    setImageFile(null);
    setServiceSearch("");
    onClose();
  };

  if (!isOpen || !pkg) return null;

  const inputStyles =
    "w-full px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all";

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `$${(numPrice / 100).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Package</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Package Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Package"
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <Upload className="text-gray-400" size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Upload a new image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Package Name */}
            <div>
              <label
                htmlFor="edit-pkg-name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="edit-pkg-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Premium Care Bundle"
                className={inputStyles}
                style={{ border: "none" }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="edit-pkg-description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-pkg-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what's included in this package..."
                rows={3}
                className={`${inputStyles} resize-none`}
                style={{ border: "none" }}
                required
              />
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="edit-pkg-price"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Offered Price ($)
                </label>
                <input
                  type="number"
                  id="edit-pkg-price"
                  name="offeredPrice"
                  value={formData.offeredPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., 35.00 (optional)"
                  min="0.01"
                  step="0.01"
                  className={inputStyles}
                  style={{ border: "none" }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Cannot exceed calculated price
                </p>
              </div>
              <div>
                <label
                  htmlFor="edit-pkg-duration"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="edit-pkg-duration"
                  name="durationInMinutes"
                  value={formData.durationInMinutes}
                  onChange={handleInputChange}
                  placeholder="e.g., 60"
                  min="1"
                  className={inputStyles}
                  style={{ border: "none" }}
                  required
                />
              </div>
            </div>

            {/* Services Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Services
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Update services included in this package
              </p>

              {/* Service Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Search services..."
                  className={`${inputStyles} pl-10`}
                  style={{ border: "none" }}
                />
              </div>

              {/* Service List */}
              <div className="max-h-48 overflow-y-auto rounded-xl bg-gray-50" style={{ border: "none" }}>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service, idx) => {
                    const isSelected = formData.serviceIds.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        style={{ borderTop: idx !== 0 ? "1px solid #f3f4f6" : "none" }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-gray-100 ${
                          isSelected ? "bg-primary/5" : ""
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-white ring-1 ring-gray-300"
                          }`}
                        >
                          {isSelected && <Check size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {service.name}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          {formatPrice(service.price)}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    {services.length === 0
                      ? "No services available."
                      : "No services match your search"}
                  </div>
                )}
              </div>

              {formData.serviceIds.length > 0 && (
                <p className="text-xs text-primary font-medium mt-2">
                  {formData.serviceIds.length} service
                  {formData.serviceIds.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pt-4 pb-6 bg-white flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 order-2 sm:order-1 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl disabled:opacity-50 order-1 sm:order-2 transition-colors"
            >
              {isLoading ? "Updating..." : "Update Package"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
