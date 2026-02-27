"use client";

import { useSession } from "next-auth/react";
import { useGetVendorInventoryQuery } from "@/redux/features/api/dashboard/vendor/inventory/vendorInventoryApi";
import { PageHeader } from "@/components/dashboard/shared/DashboardUI";
import { Package, TrendingUp, TrendingDown, LayoutGrid, DollarSign, Star, CreditCard } from "lucide-react";

export default function VendorInventoryPage() {
  const { status } = useSession();
  const {
    data: response,
    isLoading,
    isError,
  } = useGetVendorInventoryQuery(undefined, {
    skip: status === "loading",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-500 font-medium">Failed to load inventory data.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#ff7176] text-white rounded-lg hover:bg-[#ff5a60] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Use Figma mock numbers as fallbacks to ensure it matches perfectly
  // Use dynamic stats from backend with reasonable defaults
  const stats = {
    totalCategories: response?.data?.stats?.totalProducts ?? 0,
    totalUnitsSold: response?.data?.stats?.totalUnitsSold ?? 0,
    totalRevenue: response?.data?.stats?.totalRevenue ?? 0,
    totalSpend: response?.data?.stats?.totalPayouts ?? 0,
    totalStock: response?.data?.stats?.totalStock ?? 0,
    avgProductRating: response?.data?.stats?.averageRating ?? 0,
  };

  const bestSellingProducts = response?.data?.bestSellingProducts || [];
  const detailedList = response?.data?.detailedList || [];

  return (
    <div className="space-y-[24px] font-arimo pb-10">
      <PageHeader 
        title="Inventory" 
        subtitle="Manage your Inventory" 
      />

      {/* KPI Stats Grid - 6 Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        
        {/* Total Categories */}
        <div className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[10px] p-[20px] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-[38px] h-[38px] rounded-[8px] bg-blue-50 flex items-center justify-center">
              <LayoutGrid size={20} className="text-blue-500" />
            </div>
            <div className="bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-[10px] text-green-600 font-medium">+12%</span>
            </div>
          </div>
          <div className="mt-[16px]">
            <p className="text-[14px] text-[#4a5565] mb-1">Total Categories</p>
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">{stats.totalCategories}</h2>
          </div>
        </div>

        {/* Total Units Sold */}
        <div className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[10px] p-[20px] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-[38px] h-[38px] rounded-[8px] bg-green-50 flex items-center justify-center">
              <Package size={20} className="text-green-500" />
            </div>
            <div className="bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-[10px] text-green-600 font-medium">+18%</span>
            </div>
          </div>
          <div className="mt-[16px]">
            <p className="text-[14px] text-[#4a5565] mb-1">Total Units Sold</p>
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">{(stats.totalUnitsSold || 0).toLocaleString()}</h2>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[10px] p-[20px] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-[38px] h-[38px] rounded-[8px] bg-green-50 flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div className="bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-[10px] text-green-600 font-medium">+24%</span>
            </div>
          </div>
          <div className="mt-[16px]">
            <p className="text-[14px] text-[#4a5565] mb-1">Total Revenue</p>
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">${(stats.totalRevenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>
        </div>

        {/* Total Spend */}
        <div className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[10px] p-[20px] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-[38px] h-[38px] rounded-[8px] bg-orange-50 flex items-center justify-center">
              <CreditCard size={20} className="text-orange-500" />
            </div>
            <div className="bg-red-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingDown size={12} className="text-red-600" />
              <span className="text-[10px] text-red-600 font-medium">-5%</span>
            </div>
          </div>
          <div className="mt-[16px]">
            <p className="text-[14px] text-[#4a5565] mb-1">Total Spend</p>
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">${(stats.totalSpend || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
          </div>
        </div>

        {/* Total Stock */}
        <div className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[10px] p-[20px] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-[38px] h-[38px] rounded-[8px] bg-gray-50 flex items-center justify-center">
              <Package size={20} className="text-gray-600" />
            </div>
            <div className="bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-[10px] text-green-600 font-medium">+8%</span>
            </div>
          </div>
          <div className="mt-[16px]">
            <p className="text-[14px] text-[#4a5565] mb-1">Total Stock</p>
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">{stats.totalStock}</h2>
          </div>
        </div>

        {/* Avg Product Rating */}
        <div className="bg-white border-[0.8px] border-[#e5e7eb] rounded-[10px] p-[20px] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-[38px] h-[38px] rounded-[8px] bg-yellow-50 flex items-center justify-center">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
            </div>
            <div className="bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-[10px] text-green-600 font-medium">+0.3</span>
            </div>
          </div>
          <div className="mt-[16px]">
            <p className="text-[14px] text-[#4a5565] mb-1">Avg Product Rating</p>
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">{stats.avgProductRating}</h2>
          </div>
        </div>

      </div>

      {/* Best Selling Products */}
      <div className="bg-white border border-[#e5e7eb] rounded-[10px] p-[20px] shadow-sm">
         <div className="flex items-center gap-2 mb-[16px]">
            <Star className="text-blue-500 fill-blue-500" size={20} />
            <h2 className="text-[16px] font-bold text-[#0a0a0a]">Best Selling Products</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-5 gap-[16px]">
            {bestSellingProducts.map((item, index) => (
               <div key={index} className="border border-[#e5e7eb] rounded-[8px] p-[12px] flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div>
                    <div className="flex items-start justify-between mb-[12px]">
                       <span className="text-[18px] font-bold text-[#0a0a0a]">#{index + 1}</span>
                       <div className="w-[38px] h-[38px] bg-gray-100 rounded-[6px] overflow-hidden">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No Img</div>
                          )}
                       </div>
                    </div>
                    <p className="text-[12px] text-[#4a5565] mb-[12px] line-clamp-2 h-[36px] font-medium">{item.productName}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#eaecf0] pt-[12px]">
                     <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{item.unitsSold} sold</span>
                     <span className="text-[12px] text-green-600 font-bold">${item.revenue.toLocaleString()}</span>
                  </div>
               </div>
            ))}
            {bestSellingProducts.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500">No sales records yet.</div>
            )}
         </div>
      </div>

      {/* All Products Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-[10px] shadow-sm overflow-hidden flex flex-col">
         <div className="px-[20px] py-[18px] border-b border-[#e5e7eb]">
            <h2 className="text-[16px] font-bold text-[#0a0a0a]">All Products</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                    <th className="px-[20px] py-[12px] text-[11px] font-bold tracking-wider text-[#4a5565] uppercase">Order ID</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold tracking-wider text-[#4a5565] uppercase">Product</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold tracking-wider text-[#4a5565] uppercase">Customer</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold tracking-wider text-[#4a5565] uppercase">Quantity</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold tracking-wider text-[#4a5565] uppercase">Amount</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold tracking-wider text-[#4a5565] uppercase">Date</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold tracking-wider text-[#4a5565] uppercase">Status</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold tracking-wider text-[#4a5565] uppercase">Stock</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#e5e7eb]">
                  {detailedList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors h-[50px]">
                       <td className="px-[20px] py-[14px] text-[12px] text-[#0a0a0a] font-medium">#{row.orderId.slice(0, 8).toUpperCase()}</td>
                       <td className="px-[20px] py-[14px] text-[12px] text-[#0a0a0a] font-medium truncate max-w-[200px]">{row.productName}</td>
                       <td className="px-[20px] py-[14px] text-[12px] text-[#4a5565] truncate max-w-[120px]">{row.customerName}</td>
                       <td className="px-[20px] py-[14px] text-[12px] text-[#4a5565]">{row.quantity}</td>
                       <td className="px-[20px] py-[14px] text-[12px] text-[#00a63e] font-bold">${row.amount.toLocaleString()}</td>
                       <td className="px-[20px] py-[14px] text-[12px] text-[#4a5565]">{new Date(row.date).toLocaleDateString()}</td>
                       <td className="px-[20px] py-[14px]">
                         <span className={`px-[10px] py-[4px] rounded-full text-[10px] font-medium ${
                           row.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                           row.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                           'bg-blue-100 text-blue-700'
                         }`}>{row.status}</span>
                       </td>
                       <td className="px-[20px] py-[14px] text-[12px] text-[#0a0a0a] font-medium">{row.stock}</td>
                    </tr>
                  ))}
                  {detailedList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-[20px] py-[40px] text-center text-gray-500">No items in inventory.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
         {/* Footer Pagination mock */}
         <div className="px-[20px] py-[12px] border-t border-[#e5e7eb] flex justify-between items-center text-[12px] text-[#6a7282]">
            <span>Showing 1 to {detailedList.length} of {detailedList.length} items</span>
            <div className="flex items-center gap-2">
               <button className="px-3 py-1 border border-[#e5e7eb] rounded-[6px] hover:bg-gray-50">Prev</button>
               <button className="px-3 py-1 bg-gray-100 rounded-[6px] font-bold text-[#0a0a0a]">1</button>
               <button className="px-3 py-1 border border-[#e5e7eb] rounded-[6px] hover:bg-gray-50">Next</button>
            </div>
         </div>
      </div>
    </div>
  );
}
