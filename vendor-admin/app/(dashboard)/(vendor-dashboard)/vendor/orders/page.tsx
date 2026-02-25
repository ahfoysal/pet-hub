"use client";

import { useState } from "react";
import { useGetVendorOrdersQuery } from "@/redux/features/api/dashboard/vendor/orders/vendorOrderApi";
import { Search, SlidersHorizontal, Trash2, Eye } from "lucide-react";
import { VendorOrder } from "@/types/dashboard/vendor/vendorOrderType";
import OrderDetailsModal from "@/components/dashboard/vendor/orders/OrderDetailsModal";
import { useSession } from "next-auth/react";
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
                  const FallbackAvatar = "https://avatar.iran.liara.run/public/" + ((idx % 20) + 1);
                  return (
                    <tr key={order.id} className="border-b border-[#eaecf0] last:border-0 hover:bg-gray-50/50 transition-colors h-[72px]">
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[40px] h-[40px] rounded-full overflow-hidden shrink-0 bg-[#c7b9da] relative">
                            <img src={FallbackAvatar} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#101828] font-inter truncate">Automatic Pet Feeder</span>
                            <span className="text-[14px] text-[#667085] font-inter">PRD-{(idx+1).toString().padStart(3, '0')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">{qty}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">${order.grandTotal.toFixed(0)}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <div className="inline-flex">
                           {order.status === "DELIVERED" || order.status === "Completed" ? (
                             <span className="bg-[#ecfdf3] text-[#027a48] px-[8px] py-[2px] rounded-full text-[12px] font-medium font-inter flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-[#12b76a] rounded-full shrink-0"></span>
                               Completed
                             </span>
                           ) : order.status === "PENDING" ? (
                             <span className="bg-[#ff7176]/20 text-[#ff7176] px-[8px] py-[2px] rounded-full text-[12px] font-medium font-inter flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-[#ff7176] rounded-full shrink-0"></span>
                               Processing
                             </span>
                           ) : (
                             <span className="bg-gray-100 text-gray-700 px-[8px] py-[2px] rounded-full text-[12px] font-medium font-inter flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-gray-400 rounded-full shrink-0"></span>
                               {order.status}
                             </span>
                           )}
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">Accessories</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[4px]">
                          <button 
                            onClick={() => handleView(order)}
                            className="p-[10px] text-[#667085] hover:bg-gray-100 rounded-[8px] transition-colors"
                          >
                            <Eye size={20} />
                          </button>
                          <button className="p-[10px] text-[#667085] hover:bg-red-50 hover:text-red-500 rounded-[8px] transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                /* Mock Data for visual matching if no actual data is present */
                <>
                {[
                  { name: "Automatic Pet Feeder", sku: "PRD-001", qty: 1, price: 200, status: "Completed", category: "Food" },
                  { name: "Automatic Pet Feeder", sku: "PRD-001", qty: 2, price: 200, status: "Processing", category: "Accessories" },
                  { name: "Automatic Pet Feeder", sku: "PRD-001", qty: 4, price: 200, status: "Published", category: "Accessories" },
                  { name: "Automatic Pet Feeder", sku: "PRD-001", qty: 4, price: 200, status: "Pending", category: "Accessories" },
                  { name: "Automatic Pet Feeder", sku: "PRD-001", qty: 1, price: 200, status: "Published", category: "Food" },
                ].map((mock, idx) => (
                  <tr key={idx} className="border-b border-[#eaecf0] last:border-0 hover:bg-gray-50/50 transition-colors h-[72px]">
                    <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[40px] h-[40px] rounded-full overflow-hidden shrink-0 bg-[#c7b9da] relative">
                            <img src={`https://avatar.iran.liara.run/public/${idx+1}`} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#101828] font-inter truncate">{mock.name}</span>
                            <span className="text-[14px] text-[#667085] font-inter">{mock.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">{mock.qty}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">${mock.price}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                         <div className="inline-flex">
                           {mock.status === "Completed" || mock.status === "Published" ? (
                             <span className="bg-[#ecfdf3] text-[#027a48] px-[8px] py-[2px] rounded-full text-[12px] font-medium font-inter flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-[#12b76a] rounded-full shrink-0"></span>
                               {mock.status}
                             </span>
                           ) : mock.status === "Processing" || mock.status === "Pending" ? (
                             <span className="bg-[#ff7176]/20 text-[#ff7176] px-[8px] py-[2px] rounded-full text-[12px] font-medium font-inter flex items-center gap-[6px]">
                               <span className="w-[8px] h-[8px] bg-[#ff7176] rounded-full shrink-0"></span>
                               {mock.status}
                             </span>
                           ) : null}
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">{mock.category}</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <span className="text-[14px] text-[#667085] font-inter">12/02/2026</span>
                      </td>
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[4px]">
                          <button className="p-[10px] text-[#667085] hover:bg-gray-100 rounded-[8px] transition-colors">
                            <Eye size={20} />
                          </button>
                          <button className="p-[10px] text-[#667085] hover:bg-red-50 hover:text-red-500 rounded-[8px] transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
        <div className="h-[64px] border-t border-[#eaecf0] w-full flex items-center justify-between px-[24px]">
            <p className="text-[14px] text-[#667085] font-inter font-medium flex items-center gap-1">
              Showing 1 to 5 of {orders.length || 5} orders
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors cursor-pointer font-inter shadow-sm">Previous</button>
              <button className="px-4 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors cursor-pointer font-inter shadow-sm">Next</button>
            </div>
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
