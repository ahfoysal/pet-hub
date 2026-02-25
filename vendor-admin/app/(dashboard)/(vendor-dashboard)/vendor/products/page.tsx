"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMyProductsQuery } from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import { Eye, Pencil, Trash2, Plus, Package, CheckCircle2, Boxes, Star } from "lucide-react";
import DeleteProductModal from "@/components/dashboard/vendor/products/DeleteProductModal";
import { useSession } from "next-auth/react";
import { PageHeader, StatCard, TableContainer, StatusBadge, SearchBar, ActionButton, Pagination } from "@/components/dashboard/shared/DashboardUI";

interface BasicProduct {
  id: string;
  name: string;
  productCategory: string;
  petCategory: string;
  isPublish: boolean;
  inStock: boolean;
  images: string[];
  avgRating?: number;
  variants?: Array<{
    stock?: number;
    sellingPrice?: string | number;
  }>;
}

export default function VendorProductsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<BasicProduct | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useGetMyProductsQuery(
    { limit, page },
    {
      skip: status === "loading",
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const products: BasicProduct[] = data?.data?.data || [];
  const meta = data?.data?.meta;

  const totalStock = products.reduce((total: number, product: BasicProduct) => {
    if (product.variants && product.variants.length > 0) {
      return total + product.variants.reduce((variantTotal: number, variant) => variantTotal + (variant.stock || 0), 0);
    }
    return total;
  }, 0);

  const filteredProducts = products.filter((product: BasicProduct) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleView = (product: BasicProduct) => {
    router.push(`/vendor/products/${product.id}`);
  };

  const handleEdit = (product: BasicProduct) => {
    router.push(`/vendor/products/${product.id}/edit`);
  };

  const handleDelete = (product: BasicProduct) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const avgRating = products.length > 0
    ? (products.reduce((acc: number, p: BasicProduct) => acc + (p.avgRating || 0), 0) / products.length).toFixed(1)
    : "0.0";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 font-arimo">Failed to load products</h2>
          <button onClick={() => refetch()} className="px-6 py-2.5 bg-[#ff7176] text-white rounded-xl font-medium hover:bg-[#ff7176]/90 transition-all font-arimo">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[24.8px] pb-10">
      <PageHeader 
        title="Products" 
        subtitle="Manage your product catalog" 
        action={
          <ActionButton onClick={() => router.push("/vendor/products/create")}>
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </div>
          </ActionButton>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18.6px]">
        <StatCard
          title="Total Products"
          value={meta?.total || 0}
          icon={<Package className="text-blue-500" strokeWidth={2.5} size={18} />}
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Published"
          value={products.filter((p: any) => p.isPublish).length}
          icon={<CheckCircle2 className="text-emerald-500" strokeWidth={2.5} size={18} />}
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Total Stock"
          value={totalStock}
          icon={<Boxes className="text-[#ff7176]" strokeWidth={2.5} size={18} />}
          iconBg="bg-[#ff7176]/10"
        />
        <StatCard
          title="Avg Rating"
          value={avgRating}
          icon={<Star className="text-amber-500 fill-amber-500" size={18} />}
          iconBg="bg-amber-500/10"
        />
      </div>

      <div className="w-full">
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search products..." 
        />
      </div>

      <TableContainer 
        title="All Products" 
        badge={`${meta?.total || 0} Product`}
        footer={
          meta && meta.totalPages > 1 ? (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
              hasNext={meta.hasNext}
              hasPrev={meta.hasPrev}
            />
          ) : undefined
        }
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <th className="px-6 py-3 text-left text-[12px] font-medium text-[#667085] font-inter">Name</th>
              <th className="px-6 py-3 text-left text-[12px] font-medium text-[#667085] font-inter">Category</th>
              <th className="px-6 py-3 text-left text-[12px] font-medium text-[#667085] font-inter">Price</th>
              <th className="px-6 py-3 text-left text-[12px] font-medium text-[#667085] font-inter">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <tr key={product.id} className="border-b border-[#eaecf0] last:border-0 hover:bg-gray-50/50 transition-colors h-[72px]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#c7b9da]/30 shrink-0 border border-gray-100">
                        <img 
                          src={product.images?.[0] || "https://avatar.iran.liara.run/public/4"} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-medium text-[#101828] font-inter truncate">{product.name}</span>
                        <span className="text-[12px] text-[#667085] font-inter">PRD-{product.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] text-[#667085] font-inter">{product.productCategory}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] text-[#667085] font-inter">${product.variants?.[0]?.sellingPrice || "0"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleView(product)} 
                        className="p-2 text-[#667085] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="p-2 text-[#667085] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product)} 
                        className="p-2 text-[#667085] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="h-[200px]">
                <td colSpan={4} className="text-center text-[#667085] font-inter">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>

      {/* Delete Modal */}
      {selectedProduct && (
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => refetch()}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
