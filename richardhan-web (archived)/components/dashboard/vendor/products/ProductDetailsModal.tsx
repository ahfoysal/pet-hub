"use client";

import { X, Package, Tag, Star } from "lucide-react";
import { useState } from "react";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto top-20">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Product Details
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  PRD-{product.id.slice(0, 8)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Images */}
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                  <img
                    src={
                      product.images[activeImageIndex] ||
                      "/placeholder-product.jpg"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`bg-gray-100 rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                          activeImageIndex === index
                            ? "border-primary"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        product.isPublish && product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isPublish && product.inStock
                        ? "Published"
                        : "Unavailable"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {product.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Categories */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Product Category:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.productCategory}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Pet Category:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.petCategory}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Features
                    </h4>
                    <ul className="space-y-2">
                      {product.features.map(
                        (feature: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="text-green-500 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Variants ({product.variants.length})
                    </h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {product.variants.map((variant: any) => (
                        <div
                          key={variant.id}
                          className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex gap-4"
                        >
                          <div className="h-20 w-20 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                            <img
                              src={
                                variant.images?.[0] ||
                                "/placeholder-product.jpg"
                              }
                              alt="Variant"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {Object.entries(variant.attributes || {}).map(
                                ([key, value]) => (
                                  <span
                                    key={key}
                                    className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded"
                                  >
                                    <span className="opacity-70">{key}:</span>{" "}
                                    {value as string}
                                  </span>
                                ),
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">
                                  ${variant.sellingPrice}
                                </span>
                                {variant.originalPrice >
                                  variant.sellingPrice && (
                                  <span className="text-xs text-secondary line-through">
                                    ${variant.originalPrice}
                                  </span>
                                )}
                              </div>
                              <div
                                className={`text-xs ${variant.stock === 0 ? "text-red-600 font-medium" : variant.stock < 10 ? "text-orange-600" : "text-gray-500"}`}
                              >
                                Stock:{" "}
                                <span className="font-semibold">
                                  {variant.stock}
                                </span>
                                {variant.stock === 0 && (
                                  <span className="ml-1">• Out of Stock</span>
                                )}
                                {variant.stock > 0 && variant.stock < 10 && (
                                  <span className="ml-1">• Low</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
                  <p>
                    Created: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Last Updated:{" "}
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
