"use client";

import { X, Clock, DollarSign, Tag, CheckCircle } from "lucide-react";
import { SitterService } from "@/types/profile/sitter/services/sitterServiceType";

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: SitterService | null;
}

const cleanArrayData = (arr: string[]): string[] => {
  if (!arr || arr.length === 0) return [];
  const result: string[] = [];
  arr.forEach((item) => {
    if (!item) return;
    if (
      typeof item === "string" &&
      item.startsWith("[") &&
      item.endsWith("]")
    ) {
      try {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) {
          parsed.forEach((p) => {
            if (p && typeof p === "string" && !result.includes(p.trim()))
              result.push(p.trim());
          });
          return;
        }
      } catch {
        /* ignore */
      }
    }
    if (typeof item === "string" && item.includes(",")) {
      item.split(",").forEach((s) => {
        const trimmed = s.trim();
        if (trimmed && !result.includes(trimmed)) result.push(trimmed);
      });
      return;
    }
    const trimmed = typeof item === "string" ? item.trim() : String(item);
    if (trimmed && !result.includes(trimmed)) result.push(trimmed);
  });
  return result;
};

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `$${(numPrice / 100).toFixed(2)}`;
};

export default function SitterServiceDetailsModal({
  isOpen,
  onClose,
  service,
}: ServiceDetailsModalProps) {
  if (!isOpen || !service) return null;

  const cleanedTags = cleanArrayData(service.tags || []);
  const cleanedWhatsIncluded = cleanArrayData(service.whatsIncluded || []);

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center px-4 pt-20 pb-10 sm:py-8">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <div className="bg-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Service Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto">
            {service.thumbnailImage && (
              <div className="w-full h-56 rounded-2xl overflow-hidden">
                <img
                  src={service.thumbnailImage}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {service.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-2xl">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <DollarSign size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Price
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(service.price)}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Clock size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Duration
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {service.durationInMinutes} min
                </p>
              </div>
            </div>

            {cleanedWhatsIncluded.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <CheckCircle size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    What's Included
                  </span>
                </div>
                <div className="space-y-2">
                  {cleanedWhatsIncluded.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cleanedTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Tag size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cleanedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 pt-4 pb-6 bg-white flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
