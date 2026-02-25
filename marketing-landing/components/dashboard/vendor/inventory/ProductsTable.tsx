// components/ProductsTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Search, AlertTriangle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useGetMyProductsQuery } from "@/redux/features/api/dashboard/vendor/products/vendorProductsApi";

/* ---------------- TYPES ---------------- */

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  lowStockThreshold: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

/* ---------------- COMPONENT ---------------- */

export default function ProductsTable() {
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useGetMyProductsQuery(
    { limit, page },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  /* -------- NORMALIZE API RESPONSE -------- */

  const products: Product[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  /* -------- DEBUG -------- */

  useEffect(() => {
    if (data) {
      console.log("✓ Products loaded:", {
        count: products.length,
        meta,
      });
    }
  }, [data, products.length, meta]);

  /* -------- HELPERS -------- */

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700";
      case "Low Stock":
        return "bg-amber-100 text-amber-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleView = (product: Product) => {
    showToast(`Viewing ${product.name}`, "info", 2000);
  };

  const handleDelete = (id: string) => {
    showToast("Product deleted successfully", "success");
    refetch();
  };

  /* ---------------- UI STATES ---------------- */

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border p-10 text-center text-gray-500">
        Loading products...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl border p-10 text-center">
        <p className="text-red-600 font-medium mb-3">Failed to load products</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Products</h2>
        <span className="text-sm text-gray-500">
          {products.length} products
        </span>
      </div>

      {/* ---------------- MOBILE ---------------- */}
      <div className="lg:hidden">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product.id}
              className={`p-4 hover:bg-gray-50/70 ${
                index !== 0 ? "border-t" : ""
              }`}
            >
              <div className="flex justify-between mb-3">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                    product.status,
                  )}`}
                >
                  {product.status}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-3">
                <span>Qty: {product.quantity}</span>
                <span>${product.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => handleView(product)}>
                  <Eye size={18} />
                </button>
                <button>
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(product.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-500">
            <Search className="mx-auto mb-4 h-10 w-10" />
            No products found
          </div>
        )}
      </div>

      {/* ---------------- DESKTOP ---------------- */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-50 ${index !== 0 ? "border-t" : ""}`}
              >
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.sku}</td>
                <td className="px-6 py-4">
                  {product.quantity}
                  {product.quantity <= product.lowStockThreshold && (
                    <AlertTriangle className="inline ml-2 h-4 w-4 text-amber-500" />
                  )}
                </td>
                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                      product.status,
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleView(product)}>
                      <Eye size={18} />
                    </button>
                    <button>
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
