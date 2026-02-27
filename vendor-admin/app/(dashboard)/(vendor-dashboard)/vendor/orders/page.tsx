"use client";

import { useState } from "react";
import { useGetVendorOrdersQuery } from "@/redux/features/api/dashboard/vendor/orders/vendorOrderApi";
import { Search, SlidersHorizontal, Eye, PackageOpen, Package } from "lucide-react";
import { VendorOrder } from "@/types/dashboard/vendor/vendorOrderType";
import OrderDetailsModal from "@/components/dashboard/vendor/orders/OrderDetailsModal";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { PageHeader } from "@/components/dashboard/shared/DashboardUI";

export default function VendorOrdersPage() {
  const { status } = useSession();
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const { data, isLoading } = useGetVendorOrdersQuery(undefined, {
    skip: status === "loading",
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const orders = data?.data || [];

  const handleView = (order: VendorOrder) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-[24px] font-arimo pb-10">
      {/* Header */}
      <PageHeader 
        title="Orders" 
        subtitle="Manage customer orders" 
      />

      {/* Action Bar (Search & Filters) */}
      <div className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[10.7px] p-[10px] flex items-center justify-between">
        <div className="relative w-full max-w-[976px] mr-2">
           <Search className="absolute left-[9px] top-1/2 -translate-y-1/2 text-gray-400 w-[15px] h-[15px]" />
           <input 
             type="text" 
             placeholder="Search orders..." 
             className="w-full pl-[30px] pr-[12px] py-[6px] border-[0.8px] border-[#d1d5dc] rounded-[7.7px] text-[12px] focus:outline-none focus:ring-1 focus:ring-[#ff7176]"
           />
        </div>
        <button className="flex items-center justify-center gap-[6px] w-[80px] h-[32px] border-[0.8px] border-[#d1d5dc] rounded-[7.7px] hover:bg-gray-50 transition-colors">
           <SlidersHorizontal size={15} className="text-[#0a0a0a]" />
           <span className="text-[12px] text-[#0a0a0a]">Filters</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#eaecf0] rounded-[8px] overflow-hidden flex flex-col">
        <div className="px-[24px] py-[20px] pb-[19px]">
           <h2 className="text-[18px] font-medium text-[#101828] font-inter">All Order</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-y border-[#eaecf0]">
                <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-[0.2px] w-[300px]">Name</th>
                <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-[0.2px] w-[95px]">Quantity</th>
                <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-[0.2px] w-[138px]">Price</th>
                <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-[0.2px] w-[174px]">Status</th>
                <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-[0.2px] w-[138px]">Category</th>
                <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-[0.2px] w-[133px]">Date</th>
                <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-[0.2px] w-[117px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, idx) => {
                  const qty = order.orderItems?.reduce((ac, cur) => ac + cur.quantity, 0) || 1;
                  
                  // Extract info from the first item in the order to represent the order row
                  const firstItem = order.orderItems?.[0];
                  const productName = firstItem?.product?.name || `Order #${order.id.slice(0, 8).toUpperCase()}`;
                  const productCategory = firstItem?.product?.productCategory || "Mixed/Other";
                  const sku = firstItem?.variant?.sku || `ORD-${order.id.slice(0, 4).toUpperCase()}`;
                  
                  // Use product image if available, else fallback avatar
                  const itemImage = firstItem?.variant?.images?.[0] || firstItem?.product?.images?.[0] || ("https://avatar.iran.liara.run/public/" + ((idx % 20) + 1));

                  return (
                    <tr key={order.id} className="border-b border-[#eaecf0] last:border-0 hover:bg-gray-50/50 transition-colors h-[72px]">
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[40px] h-[40px] rounded-lg border border-gray-100 overflow-hidden shrink-0 bg-gray-50 relative flex items-center justify-center text-gray-400">
                            {itemImage ? (
                              <Image src={itemImage} alt={productName} fill className="object-cover" />
                            ) : (
                              <Package size={20} />
                            )}
                          </div>
                          <div className="flex flex-col max-w-[200px]">
                            <span className="text-[14px] font-medium text-[#101828] font-inter truncate" title={productName}>
                              {productName}
                            </span>
                            <span className="text-[14px] text-[#667085] font-inter truncate">
                              {sku} {order.orderItems?.length > 1 && `(+${order.orderItems.length - 1} items)`}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">{qty}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">${order.grandTotal.toFixed(2)}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <div className="inline-flex">
                           {order.status === "DELIVERED" || order.status === "COMPLETED" ? (
                             <span className="bg-[#ecfdf3] text-[#027a48] px-[8px] py-[2px] rounded-full text-[12px] font-medium flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-[#12b76a] rounded-full shrink-0"></span>
                               Completed
                             </span>
                           ) : order.status === "PENDING" ? (
                             <span className="bg-[#ff7176]/10 text-[#ff7176] px-[8px] py-[2px] rounded-full text-[12px] font-medium flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-[#ff7176] rounded-full shrink-0"></span>
                               Pending
                             </span>
                           ) : order.status === "PROCESSING" ? (
                             <span className="bg-blue-50 text-blue-600 px-[8px] py-[2px] rounded-full text-[12px] font-medium flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-blue-500 rounded-full shrink-0"></span>
                               Processing
                             </span>
                           ) : order.status === "CANCELLED" ? (
                             <span className="bg-red-50 text-red-600 px-[8px] py-[2px] rounded-full text-[12px] font-medium flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-red-500 rounded-full shrink-0"></span>
                               Cancelled
                             </span>
                           ) : (
                             <span className="bg-gray-100 text-gray-700 px-[8px] py-[2px] rounded-full text-[12px] font-medium flex items-center gap-[6px] capitalize">
                               <span className="w-[8px] h-[8px] bg-gray-400 rounded-full shrink-0"></span>
                               {order.status.toLowerCase()}
                             </span>
                           )}
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter truncate block max-w-[120px]">{productCategory}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[4px]">
                          <button 
                            onClick={() => handleView(order)}
                            className="p-[8px] text-[#667085] hover:bg-gray-100 rounded-[8px] transition-colors"
                            title="View Order Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-[24px] py-[60px] text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-[80px] h-[80px] bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                         <PackageOpen size={40} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-[16px] font-medium text-[#101828]">No orders found</h3>
                      <p className="text-[14px] text-[#667085] max-w-[300px]">
                        You haven&apos;t received any orders yet, or no orders match your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        {orders.length > 0 && (
          <div className="h-[64px] border-t border-[#eaecf0] w-full flex items-center justify-between px-[24px]">
              <p className="text-[14px] text-[#667085] font-inter font-medium flex items-center gap-1">
                Showing <span className="text-[#101828]">1</span> to <span className="text-[#101828]">{orders.length}</span> of <span className="text-[#101828]">{orders.length}</span> orders
              </p>
              <div className="flex gap-2">
                <button disabled className="px-4 py-[8px] border border-[#eaecf0] rounded-[8px] text-[14px] font-medium text-[#98a2b3] bg-gray-50 font-inter shadow-sm cursor-not-allowed">Previous</button>
                <button disabled className="px-4 py-[8px] border border-[#eaecf0] rounded-[8px] text-[14px] font-medium text-[#98a2b3] bg-gray-50 font-inter shadow-sm cursor-not-allowed">Next</button>
              </div>
          </div>
        )}
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
