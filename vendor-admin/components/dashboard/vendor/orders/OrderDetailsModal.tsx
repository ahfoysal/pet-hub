import { VendorOrder } from "@/types/dashboard/vendor/vendorOrderType";
import {
  X,
  Package,
  User,
  CreditCard,
  MapPin,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: VendorOrder;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-[#ff7176]/10 text-[#ff7176] border-[#ff7176]/20";
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DELIVERED":
      case "COMPLETED":
      case "Completed":
        return "bg-[#ecfdf3] text-[#027a48] border-[#a6f4c5]";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "SUCCESS":
        return "bg-[#ecfdf3] text-[#027a48] border-[#a6f4c5]";
      case "FAILED":
        return "bg-red-50 text-red-700 border-red-200";
      case "PENDING":
        return "bg-[#ff7176]/10 text-[#ff7176] border-[#ff7176]/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center font-arimo">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0a0a0a]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[16px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4 overflow-hidden transform transition-all border border-[#eaecf0]">
        
        {/* Header */}
        <div className="flex-none bg-white border-b border-[#eaecf0] px-[24px] py-[20px] flex items-center justify-between z-10">
          <div className="flex items-center gap-[16px]">
            <div className="h-[48px] w-[48px] rounded-[12px] bg-[#f9fafb] border border-[#eaecf0] flex items-center justify-center flex-shrink-0">
              <Package className="h-[24px] w-[24px] text-[#4a5565]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#101828] font-inter">
                Order ORD-{order.id.slice(0, 8).toUpperCase()}
              </h2>
              <p className="text-[14px] text-[#667085] mt-[2px]">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <span
              className={`px-[12px] py-[4px] rounded-full text-[12px] font-medium border ${getStatusColor(order.status)} font-inter flex items-center gap-1.5 uppercase`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'DELIVERED' || order.status === 'COMPLETED' || order.status === 'Completed' ? 'bg-[#12b76a]' : order.status === 'PENDING' ? 'bg-[#ff7176]' : 'bg-current'}`}></span>
              {order.status}
            </span>
            <button
              onClick={onClose}
              className="p-[8px] hover:bg-gray-100 rounded-[8px] transition-colors text-[#667085]"
            >
              <X className="h-[20px] w-[20px]" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-[24px] bg-[#f9fafb]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
            
            {/* Left Column (Main Details) */}
            <div className="lg:col-span-2 space-y-[24px]">
              
              {/* Order Items */}
              <div className="bg-white border border-[#eaecf0] rounded-[12px] overflow-hidden">
                <div className="px-[20px] py-[16px] border-b border-[#eaecf0] flex items-center gap-2">
                  <ShoppingBag className="h-[18px] w-[18px] text-[#4a5565]" />
                  <h3 className="text-[16px] font-bold text-[#101828] font-inter">
                    Order Items <span className="text-[#667085] font-normal">({order.orderItems.length})</span>
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[14px] font-inter">
                    <thead className="bg-[#f9fafb] text-[#667085] font-medium border-b border-[#eaecf0]">
                      <tr>
                        <th className="text-left px-[20px] py-[12px]">Product Details</th>
                        <th className="text-center px-[20px] py-[12px]">Qty</th>
                        <th className="text-right px-[20px] py-[12px]">Unit Price</th>
                        <th className="text-right px-[20px] py-[12px]">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaecf0]">
                      {order.orderItems.length > 0 ? order.orderItems.map((item, index) => {
                        const productName = item.product?.name || `Product ${item.productId.slice(-6).toUpperCase()}`;
                        const sku = item.variant?.sku || `SKU-${item.variantId.slice(-4).toUpperCase()}`;
                        const itemImage = item.variant?.images?.[0] || item.product?.images?.[0] || `https://avatar.iran.liara.run/public/${(index % 20) + 1}`;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-[20px] py-[16px]">
                               <div className="flex items-center gap-3">
                                 <div className="w-[48px] h-[48px] rounded-[8px] bg-[#f9fafb] border border-[#eaecf0] relative overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
                                   {itemImage ? (
                                     <Image src={itemImage} alt={productName} fill className="object-cover" />
                                   ) : (
                                     <Package size={24} />
                                   )}
                                 </div>
                                 <div className="max-w-[150px]">
                                   <p className="font-medium text-[#101828] truncate" title={productName}>{productName}</p>
                                   <p className="text-[#667085] text-[12px] mt-0.5 uppercase">{sku}</p>
                                 </div>
                               </div>
                            </td>
                            <td className="px-[20px] py-[16px] text-center text-[#4a5565]">{item.quantity}</td>
                            <td className="px-[20px] py-[16px] text-right text-[#4a5565]">${item.price.toFixed(2)}</td>
                            <td className="px-[20px] py-[16px] text-right font-medium text-[#101828]">${item.totalPrice.toFixed(2)}</td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={4} className="px-[20px] py-[40px] text-center text-[#667085]">
                            No items found in this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>


              {/* Payment Summary */}
              <div className="bg-white border border-[#eaecf0] rounded-[12px] p-[20px]">
                <div className="flex items-center justify-between mb-[16px]">
                  <h3 className="text-[16px] font-bold text-[#101828] font-inter flex items-center gap-2">
                    <CreditCard className="h-[18px] w-[18px] text-[#4a5565]" />
                    Payment Details
                  </h3>
                  <span className={`px-[10px] py-[2px] rounded-full text-[12px] font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                <div className="space-y-[12px] text-[14px]">
                    <div className="flex justify-between items-center text-[#667085]">
                      <span>Subtotal</span>
                      <span className="text-[#101828] font-medium">${order.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#667085]">
                      <span>Platform Fee</span>
                      <span className="text-[#101828] font-medium">${order.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#667085]">
                      <span>Discount</span>
                      <span className="text-[#101828] font-medium">-{order.discount ? `$${order.discount.toFixed(2)}` : "$0.00"}</span>
                    </div>
                    <div className="pt-[16px] border-t border-[#eaecf0]">
                      <div className="flex justify-between items-center text-[18px] font-bold text-[#101828]">
                        <span>Grand Total</span>
                        <span className="text-[#ff7176]">${order.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                </div>
              </div>

            </div>

            {/* Right Column (Customer & Shipping) */}
            <div className="space-y-[24px]">
              
              {/* Customer Info */}
              <div className="bg-white border border-[#eaecf0] rounded-[12px] p-[20px]">
                <h3 className="text-[16px] font-bold text-[#101828] font-inter mb-[16px] flex items-center gap-2">
                  <User className="h-[18px] w-[18px] text-[#4a5565]" />
                  Customer
                </h3>
                <div className="flex items-center gap-[12px] mb-[16px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#f9fafb] border border-[#eaecf0] flex items-center justify-center shrink-0">
                    <User className="w-[20px] h-[20px] text-[#98a2b3]" />
                  </div>
                  <div className="max-w-full overflow-hidden">
                    <p className="text-[14px] font-medium text-[#101828] truncate">{order.user.fullName}</p>
                    <p className="text-[13px] text-[#667085] truncate">{order.user.email}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white border border-[#eaecf0] rounded-[12px] p-[20px]">
                <h3 className="text-[16px] font-bold text-[#101828] font-inter mb-[16px] flex items-center gap-2">
                  <MapPin className="h-[18px] w-[18px] text-[#4a5565]" />
                  Shipping Address
                </h3>
                <div className="text-[14px] text-[#4a5565] space-y-[4px] bg-[#f9fafb] p-[16px] rounded-[8px] border border-[#eaecf0]">
                  <p className="font-medium text-[#101828] mb-1">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-[12px] pt-[12px] border-t border-[#eaecf0] text-[#667085]">
                      <span className="font-medium mr-2 text-[#4a5565]">Phone:</span> 
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Date */}
              <div className="bg-white border border-[#eaecf0] rounded-[12px] p-[20px]">
                <h3 className="text-[16px] font-bold text-[#101828] font-inter mb-[12px] flex items-center gap-2">
                  <Calendar className="h-[18px] w-[18px] text-[#4a5565]" />
                  Order Information
                </h3>
                <div className="space-y-[12px]">
                   <div className="flex justify-between items-center text-[14px]">
                     <span className="text-[#667085]">Date Placed</span>
                     <span className="font-medium text-[#101828]">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                   </div>
                   <div className="flex justify-between items-center text-[14px]">
                     <span className="text-[#667085]">Order ID</span>
                     <span className="font-medium text-[#101828] truncate max-w-[120px]" title={order.id}>{order.id}</span>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex-none bg-white border-t border-[#eaecf0] px-[24px] py-[16px] flex justify-end gap-[12px] rounded-b-[16px]">
          <button
            onClick={onClose}
            className="px-[16px] py-[8px] bg-white border border-[#d1d5dc] text-[#344054] rounded-[8px] text-[14px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
