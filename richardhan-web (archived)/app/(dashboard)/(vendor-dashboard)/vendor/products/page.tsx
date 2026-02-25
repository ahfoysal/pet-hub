"use client";

import { useEffect, useState } from "react";
import { useGetMyProductsQuery } from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";
import { Eye, Pencil, Trash2, Search, Plus, Package, CheckCircle2, Boxes, Star } from "lucide-react";
import ProductDetailsModal from "@/components/dashboard/vendor/products/ProductDetailsModal";
import CreateProductModal from "@/components/dashboard/vendor/products/CreateProductModal";
import EditProductModal from "@/components/dashboard/vendor/products/EditProductModal";
import DeleteProductModal from "@/components/dashboard/vendor/products/DeleteProductModal";
import { useSession } from "next-auth/react";

export default function VendorProductsPage() {
  const { status } = useSession();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useGetMyProductsQuery(
    { limit, page },
    {
      skip: status === "loading",
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log("✓ Product data updated:", {
        totalProducts: data.data?.data?.length,
        meta: data.data?.meta,
      });
    }
  }, [data]);

  const products = data?.data?.data || [];
  const meta = data?.data?.meta;

  // Calculate total stock from all variants of all products
  const totalStock = products.reduce((total: number, product: any) => {
    if (product.variants && product.variants.length > 0) {
      return total + product.variants.reduce((variantTotal: number, variant: any) => {
        return variantTotal + (variant.stock || 0);
      }, 0);
    }
    return total;
  }, 0);

  // Filter products based on search
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const getStatusBadge = (isPublish: boolean, inStock: boolean) => {
    if (isPublish && inStock) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Published
        </span>
      );
    } else if (!isPublish) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Out of Stock
        </span>
      );
    }
  };

  // Calculate average rating
  const avgRating = products.length > 0
    ? (products.reduce((acc: number, p: any) => acc + (p.avgRating || 0), 0) / products.length).toFixed(1)
    : "N/A";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load products</h2>
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
            Products
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your product catalog
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span className="whitespace-nowrap">Add Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            name="search-products"
            className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border-0"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {meta?.total || 0}
              </p>
            </div>
            <div className="p-3.5 bg-blue-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Published</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">
                {products.filter((p: any) => p.isPublish).length}
              </p>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Total Stock - Using brand primary light pink */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Stock</p>
              <p className="text-2xl font-bold text-primary mt-2">
                {totalStock}
              </p>
            </div>
            <div className="p-3.5 bg-primary/10 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Boxes className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Avg Rating */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Avg Rating</p>
              <p className="text-2xl font-bold text-amber-500 mt-2">
                {avgRating}
              </p>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Products
            <span className="ml-2 text-sm font-normal text-gray-500">
              {filteredProducts.length} products
            </span>
          </h2>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: any, index: number) => (
              <div
                key={product.id}
                className="p-4 hover:bg-gray-50/50 transition-colors"
                style={{ borderTop: index !== 0 ? '1px solid #f9fafb' : 'none' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={product.images[0] || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {getStatusBadge(product.isPublish, product.inStock)}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {product.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-xs text-gray-500">
                    {product.variants?.length || 0} variants
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(product)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
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
                <Package className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-600">No products found</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first product to get started
              </p>
            </div>
          )}
        </div>

        {/* Desktop Table View - No borders, clean design */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: any, index: number) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                    style={{ borderTop: index !== 0 ? '1px solid #f9fafb' : 'none' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.images[0] || "/placeholder-product.jpg"}
                          alt={product.name}
                          className="h-11 w-11 rounded-xl object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            PRD-{product.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.productCategory}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {product.petCategory}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {product.variants && product.variants.length > 0
                          ? `$${product.variants[0].sellingPrice}`
                          : "No variants"}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {product.variants?.length || 0} variants
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.isPublish, product.inStock)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(product)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-base font-medium text-gray-600">No products found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create your first product to get started
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-5 sm:px-6 py-4 flex items-center justify-between bg-gray-50/50">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!meta.hasPrev}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page <span className="font-semibold text-gray-700">{meta.page}</span> of <span className="font-semibold text-gray-700">{meta.totalPages}</span>
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!meta.hasNext}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedProduct && (
        <>
          <ProductDetailsModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
          <EditProductModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
            onSuccess={() => {
              console.log("🔄 Product updated - triggering refetch");
              refetch();
            }}
            product={selectedProduct}
          />
          <DeleteProductModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedProduct(null);
            }}
            onSuccess={() => {
              console.log("🔄 Product deleted - triggering refetch");
              refetch();
            }}
            product={selectedProduct}
          />
        </>
      )}

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          console.log(
            "🔄 Product created - triggering refetch and clearing search",
          );
          setSearchTerm(""); // Clear search so user sees new product
          refetch();
        }}
      />
    </div>
  );
}
