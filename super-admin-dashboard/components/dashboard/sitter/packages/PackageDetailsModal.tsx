"use client";

import { X, Clock, DollarSign, Package, Layers, Loader2 } from "lucide-react";
import { useGetPackageByIdQuery } from "@/redux/features/api/dashboard/sitter/packages/sitterPackageApi";

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string | null;
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `$${(numPrice / 100).toFixed(2)}`;
};

export default function PackageDetailsModal({
  isOpen,
  onClose,
  packageId,
}: PackageDetailsModalProps) {
  const { data, isLoading } = useGetPackageByIdQuery(packageId ?? "", {
    skip: !isOpen || !packageId,
  });

  if (!isOpen || !packageId) return null;

  const pkg = data?.data ?? null;

  const hasDiscount =
    pkg?.offeredPrice &&
    pkg?.calculatedPrice &&
    parseFloat(pkg.offeredPrice) < parseFloat(pkg.calculatedPrice);

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="bg-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Package Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {isLoading || !pkg ? (
            <div className="px-6 pb-6 flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto">
                {/* Package Image */}
                {pkg.image && (
                  <div className="w-full h-56 rounded-2xl overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Name & Description */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {pkg.name}
                  </h3>
                  {pkg.description && (
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {pkg.description}
                    </p>
                  )}
                </div>

                {/* Price & Duration Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-2xl">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <DollarSign size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Offered Price
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(pkg.offeredPrice)}
                    </p>
                    {hasDiscount && (
                      <p className="text-sm text-gray-400 line-through mt-1">
                        {formatPrice(pkg.calculatedPrice)}
                      </p>
                    )}
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Clock size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Duration
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {pkg.durationInMinutes} min
                    </p>
                  </div>
                </div>

                {/* Calculated Price Info */}
                {pkg.calculatedPrice && (
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                      <Package size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Calculated Price
                      </span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(pkg.calculatedPrice)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Based on total service prices
                    </p>
                  </div>
                )}

                {/* Included Services */}
                {pkg.services && pkg.services.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                      <Layers size={18} />
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Included Services
                      </span>
                    </div>
                    <div className="space-y-2">
                      {pkg.services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-sm font-medium text-gray-900">
                              {service.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-500">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 pt-4 pb-6 bg-white flex-shrink-0">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
