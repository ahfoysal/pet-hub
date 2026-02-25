"use client";

import { useEffect, useState } from "react";
import { useGetVendorOrdersQuery } from "@/redux/features/api/dashboard/vendor/orders/vendorOrderApi";
import { Eye, Package, Calendar, User, CreditCard, MapPin } from "lucide-react";
import { VendorOrder } from "@/types/dashboard/vendor/vendorOrderType";
import OrderDetailsModal from "@/components/dashboard/vendor/orders/OrderDetailsModal";
import { useSession } from "next-auth/react";

export default function VendorOrdersPage() {
  const { status } = useSession();
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const { data, isLoading, isError } = useGetVendorOrdersQuery(undefined, {
    skip: status === "loading",
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Debug logging
  useEffect(() => {
    if (data) {
      console.log("✓ Order data updated:", {
        totalOrders: data.data?.length,
      });
    }
  }, [data]);

  const orders = data?.data || [];

  const handleView = (order: VendorOrder) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    
    const statusText: Record<string, string> = {
      PENDING: "Pending",
      PROCESSING: "Processing",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    };
    
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
    const textStatus = statusText[status] || status;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        • {textStatus}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusColors: Record<string, string> = {
      SUCCESS: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    
    const statusText: Record<string, string> = {
      SUCCESS: "Paid",
      FAILED: "Failed",
      PENDING: "Pending",
    };
    
    const colorClass = statusColors[paymentStatus] || "bg-gray-100 text-gray-800";
    const textStatus = statusText[paymentStatus] || paymentStatus;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        • {textStatus}
      </span>
    );
  };

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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">Failed to load orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground font-bold">
            Orders
          </h1>
          <p className="text-secondary mt-1 text-sm sm:text-base">
            Manage your customer orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                {orders.length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
                {orders.filter((o) => o.status === "PENDING").length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                {orders.filter((o) => o.status === "DELIVERED").length}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-lg sm:text-xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                ${orders
                  .filter((o) => o.paymentStatus === "SUCCESS")
                  .reduce((sum, order) => sum + order.grandTotal, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        <div className="p-4 sm:p-6 border-b" style={{ borderBottomColor: '#e5e7eb' }}>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            All Orders
            <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500">
              {orders.length} orders
            </span>
          </h2>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div
                key={order.id}
                className="p-4 hover:bg-gray-50 transition-colors"
                style={{ borderTop: index !== 0 ? '1px solid #e5e7eb' : 'none' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        ORD-{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <span className="text-xs font-medium text-gray-500">
                        ${order.grandTotal.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.user.fullName}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {order.orderItems.length} items
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(order)}
                      className="p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
              <p className="text-base font-medium">No orders found</p>
              <p className="text-sm">
                You don't have any orders yet
              </p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b" style={{ borderBottomColor: '#e5e7eb' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{ borderTop: index !== 0 ? '1px solid #e5e7eb' : 'none' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            ORD-{order.id.slice(0, 8).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.cartId.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.orderItems.length} items
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} total
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.grandTotal.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Subtotal: ${order.subTotal.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div>{getStatusBadge(order.status)}</div>
                        <div>{getPaymentStatusBadge(order.paymentStatus)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(order)}
                          className="p-2 text-gray-600 hover:text-primary transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Package className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm">
                      You don't have any orders yet
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
}