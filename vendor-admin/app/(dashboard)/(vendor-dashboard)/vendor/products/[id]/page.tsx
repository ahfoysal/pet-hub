"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useGetProductQuery, 
  useDeleteProductMutation 
} from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign,
  AlertCircle,
  Tag
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/contexts/ToastContext";
import DeleteProductModal from "@/components/dashboard/vendor/products/DeleteProductModal";

// Premium UI Components from shared DashboardUI
const Breadcrumbs = ({ product }: { product: any }) => {
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
      <span className="text-[#101828] font-medium truncate max-w-[300px]">{product?.name || "Product Name"}</span>
    </div>
  );
};

export default function SingleProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isLoading, isError } = useGetProductQuery({ productId: id as string });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  return (
    <div className="pb-10 animate-in fade-in duration-500">
      <Breadcrumbs product={product} />

      {/* Header with Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-[20px] font-medium text-[#101828]">{product.name}</h1>
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

      {/* Main Content Grid */}
      <div className="space-y-6">
        {/* Main Product Card */}
        <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 sm:p-7 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-[#f9fafb] rounded-[14px] aspect-[4/3] relative flex items-center justify-center overflow-hidden border border-gray-100">
                {images.length > 0 ? (
                  <img
                    src={images[activeImageIndex]}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain p-4"
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
                        activeImageIndex === idx ? "border-[#ff7176]" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
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
                  <p className="text-[14px] font-medium text-[#101828]">{product.brandName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[14px] text-[#6a7282] mb-1">Category</p>
                  <p className="text-[14px] font-medium text-[#101828]">{product.category}</p>
                </div>
                <div>
                  <p className="text-[14px] text-[#6a7282] mb-1">Pet Type</p>
                  <div className="inline-flex px-3 py-1 bg-[#dcfce7] rounded-full text-[#008236] text-[12px] font-medium">
                    {product.petCategory || "All Pets"}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[32px] font-bold text-[#101828] font-inter">
                  ${product.variants?.[0]?.sellingPrice || product.sellingPrice || "0"}
                </p>
                {product.originalPrice > (product.variants?.[0]?.sellingPrice || product.sellingPrice) && (
                  <p className="text-[16px] text-[#6a7282] line-through mt-[-4px]">
                    ${product.originalPrice}
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
                  {Array.isArray(product.tags) ? product.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-[14px] py-[8px] bg-[#f3f4f6] rounded-[8px] text-[14px] font-medium text-[#364153]">
                      {tag}
                    </span>
                  )) : product.tags.split(',').map((tag: string, i: number) => (
                    <span key={i} className="px-[14px] py-[8px] bg-[#f3f4f6] rounded-[8px] text-[14px] font-medium text-[#364153]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Info Cards Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inventory Card */}
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">Inventory</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">SKU</p>
                <p className="text-[14px] font-medium text-[#101828] uppercase">{product.sku || product.variants?.[0]?.sku || "N/A"}</p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Available Stock</p>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#101828]">
                    {product.stock || product.variants?.[0]?.stock || 0}
                  </span>
                  {(product.stock || product.variants?.[0]?.stock) < 10 && (
                    <span className="px-2 py-0.5 bg-[#ffedd4] text-[#ca3500] text-[12px] font-medium rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Stock Unit</p>
                <p className="text-[14px] font-medium text-[#101828]">{product.stockUnit || "Pieces"}</p>
              </div>
            </div>
          </div>

          {/* Origin & Date Card */}
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">Origin & Date</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Country of Origin</p>
                <p className="text-[14px] font-medium text-[#101828]">{Array.isArray(product.countryOfOrigin) ? product.countryOfOrigin[0] : (product.countryOfOrigin || "N/A")}</p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Manufacturing Date</p>
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

          {/* Pricing Details Card */}
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">Pricing Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Selling Price</p>
                <p className="text-[14px] font-medium text-[#101828]">${product.variants?.[0]?.sellingPrice || product.sellingPrice || "0"}</p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Compare at Price</p>
                <p className="text-[14px] font-medium text-[#101828]">${product.originalPrice || "0"}</p>
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282] mb-1">Stock Threshold</p>
                <p className="text-[14px] font-medium text-[#101828]">{product.lowStockThreshold || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Highlights / Features */}
        {product.features && (
          <div className="bg-white border border-[#eaeaea] rounded-[14px] p-6 shadow-sm space-y-4">
            <h3 className="text-[16px] font-semibold text-[#101828]">Product Highlights</h3>
            <ul className="space-y-3">
              {(Array.isArray(product.features) ? product.features : product.features.split(',')).map((feature: string, i: number) => (
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
          showToast("Product deleted successfully", "success");
          router.push("/vendor/products");
        }}
        product={product}
      />
    </div>
  );
}
