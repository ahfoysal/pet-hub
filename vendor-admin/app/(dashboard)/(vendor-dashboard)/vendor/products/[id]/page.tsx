/**
 * Single Product Detail Page
 * Displays product info from Product model + Variant data from Variant model.
 * Fields like sellingPrice, originalPrice, stock, sku live on variants, not the product.
 */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetProductQuery,
} from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/contexts/ToastContext";
import DeleteProductModal from "@/components/dashboard/vendor/products/DeleteProductModal";

// Breadcrumbs component
const Breadcrumbs = ({ product }: { product: { name?: string } }) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 mb-6 text-[14px]">
      <button
        onClick={() => router.push("/vendor/products")}
        className="flex items-center gap-1 text-[#6a7282] hover:text-[#101828] transition-colors"
      >
        <div className="p-1 border border-gray-200 rounded-md">
          <ChevronLeft size={16} />
        </div>
        <span>Products</span>
      </button>
      <ChevronRight size={14} className="text-[#6a7282]" />
      <span className="text-[#101828] font-medium truncate max-w-[300px]">
        {product?.name || "Product Name"}
      </span>
    </div>
  );
};

interface Variant {
  id: string;
  sku: string | null;
  sellingPrice: number;
  originalPrice: number;
  stock: number;
  images: string[];
  attributes: Record<string, string> | null;
}

export default function SingleProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading, isError } = useGetProductQuery({
    productId: id as string,
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const product = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-gray-900 font-medium">Product not found</p>
          <button
            onClick={() => router.push("/vendor/products")}
            className="mt-4 text-[#ff7176] hover:underline"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const variants: Variant[] = product.variants || [];
  const activeVariant: Variant | undefined = variants[selectedVariantIndex];

  // Current display values (from active variant or first variant)
  const displayPrice = activeVariant?.sellingPrice ?? 0;
  const displayOriginalPrice = activeVariant?.originalPrice ?? 0;
  const displaySku = activeVariant?.sku || "N/A";
  const displayStock = activeVariant?.stock ?? 0;

  // Format variant attributes for display
  const formatAttributes = (attrs: Record<string, string> | null) => {
    if (!attrs || typeof attrs !== "object") return "";
    return Object.entries(attrs)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
  };

  return (
    <div className="pb-10 animate-in fade-in duration-500">
      <Breadcrumbs product={product} />

      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[20px] font-medium text-[#101828]">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                product.isPublish
                  ? "bg-[#dcfce7] text-[#008236]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {product.isPublish ? "Published" : "Draft"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                product.inStock
                  ? "bg-blue-50 text-blue-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/vendor/products/${id}/edit`)}
            className="flex items-center gap-2 px-6 py-[10px] border border-[#d1d5dc] rounded-[12px] text-[#364153] text-[14px] font-medium hover:bg-gray-50 transition-all font-inter"
          >
            <span>Edit</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-6 py-[10px] bg-[#ff6b6b] rounded-[12px] text-white text-[14px] font-medium hover:bg-red-600 transition-all font-inter shadow-sm"
          >
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Product Card */}
        <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 sm:p-7 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-[#f9fafb] rounded-[14px] aspect-[4/3] relative flex items-center justify-center overflow-hidden border border-gray-100">
                {images.length > 0 ? (
                  <Image
                    src={images[activeImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <Package className="h-20 w-20 text-gray-300" />
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-[#ff7176]"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Quick Info */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[14px] text-[#6a7282] mb-1">Brand</p>
                  <p className="text-[14px] font-medium text-[#101828]">
                    {product.brandName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#6a7282] mb-1">Category</p>
                  <p className="text-[14px] font-medium text-[#101828]">
                    {product.productCategory || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#6a7282] mb-1">Pet Type</p>
                  <div className="inline-flex px-3 py-1 bg-[#dcfce7] rounded-full text-[#008236] text-[12px] font-medium">
                    {product.petCategory || "All Pets"}
                  </div>
                </div>
                <div>
                  <p className="text-[14px] text-[#6a7282] mb-1">
                    Avg Rating
                  </p>
                  <p className="text-[14px] font-medium text-[#101828]">
                    {product.avgRating > 0
                      ? `⭐ ${product.avgRating.toFixed(1)}`
                      : "No ratings yet"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[32px] font-bold text-[#101828] font-inter">
                  ${displayPrice}
                </p>
                {displayOriginalPrice > displayPrice && (
                  <p className="text-[16px] text-[#6a7282] line-through mt-[-4px]">
                    ${displayOriginalPrice}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[14px] text-[#4a5565] leading-[1.6]">
                  {product.description}
                </p>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(product.tags)
                    ? product.tags
                    : product.tags.split(",")
                  ).map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-[14px] py-[8px] bg-[#f3f4f6] rounded-[8px] text-[14px] font-medium text-[#364153]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Inventory Card */}
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">
              Inventory
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">SKU</p>
                <p className="text-[14px] font-medium text-[#101828] uppercase">
                  {displaySku}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">
                  Stock Threshold
                </p>
                <p className="text-[14px] font-medium text-[#101828]">
                  {product.lowStockThreshold || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">
                  Current Stock
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#101828]">
                    {displayStock}
                  </span>
                  {displayStock <= (product.lowStockThreshold || 0) && displayStock > 0 && (
                    <span className="px-2 py-0.5 bg-[#ffedd4] text-[#ca3500] text-[12px] font-medium rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Details Card */}
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">
              Pricing
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">
                  Selling Price
                </p>
                <p className="text-[14px] font-medium text-[#101828]">
                  ${displayPrice}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">
                  Original Price
                </p>
                <p className="text-[14px] font-medium text-[#101828]">
                  ${displayOriginalPrice}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Status</p>
                <span className={`text-[13px] font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                  {product.inStock ? "Active in Store" : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>

          {/* Origin & Date Card */}
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">
              Origin & Date
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Country of Origin</p>
                <p className="text-[14px] font-medium text-[#101828]">
                  {Array.isArray(product.countryOfOrigin) ? product.countryOfOrigin.join(", ") : (product.countryOfOrigin || "N/A")}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Mfg Date</p>
                <p className="text-[14px] font-medium text-[#101828]">
                  {product.manufacturingDate ? new Date(product.manufacturingDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Expiry Date</p>
                <p className="text-[14px] font-medium text-[#101828]">
                  {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* SEO & Metadata Card */}
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">
              SEO & Metadata
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">SEO Title</p>
                <p className="text-[14px] font-medium text-[#101828] truncate">
                  {product.seoTitle || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Created</p>
                <p className="text-[14px] font-medium text-[#101828]">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Auto Status</p>
                <span className={`text-[13px] font-medium ${product.isPublish ? "text-green-600" : "text-amber-500"}`}>
                  {product.isPublish ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Variants Section */}
        {variants.length > 0 && (
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">
              Variants ({variants.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                    <th className="px-4 py-3 text-left text-[12px] font-medium text-[#667085] tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] font-medium text-[#667085] tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] font-medium text-[#667085] tracking-wider">
                      Attributes
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] font-medium text-[#667085] tracking-wider">
                      Selling Price
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] font-medium text-[#667085] tracking-wider">
                      Original Price
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] font-medium text-[#667085] tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] font-medium text-[#667085] tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant: Variant, idx: number) => (
                    <tr
                      key={variant.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`border-b border-[#eaecf0] last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                        selectedVariantIndex === idx ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-[14px] text-[#667085]">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-medium text-[#101828] uppercase">
                        {variant.sku || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-[14px] text-[#667085]">
                        {formatAttributes(variant.attributes) || "Default"}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-medium text-[#101828]">
                        ${variant.sellingPrice}
                      </td>
                      <td className="px-4 py-4 text-[14px] text-[#667085]">
                        ${variant.originalPrice}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-medium text-[#101828]">
                        {variant.stock}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${
                            variant.stock > 10
                              ? "bg-[#dcfce7] text-[#008236]"
                              : variant.stock > 0
                                ? "bg-[#ffedd4] text-[#ca3500]"
                                : "bg-red-50 text-red-500"
                          }`}
                        >
                          {variant.stock > 10
                            ? "In Stock"
                            : variant.stock > 0
                              ? "Low Stock"
                              : "Out of Stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Highlights / Features */}
        {product.features && product.features.length > 0 && (
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">
              Product Highlights
            </h3>
            <ul className="space-y-3">
              {(Array.isArray(product.features)
                ? product.features
                : product.features.split(",")
              ).map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[#ff7176] rounded-full shrink-0" />
                  <span className="text-[14px] text-[#364153]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          router.push("/vendor/products");
        }}
        product={product}
      />
    </div>
  );
}
