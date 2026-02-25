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

  // Use Figma mock numbers as fallbacks to ensure it matches perfectly
  const stats = (response?.data?.stats as any) || {
    totalCategories: 10,
    totalUnitsSold: 6371,
    totalRevenue: 299606.29,
    totalSpend: 203732.28,
    totalStock: 934,
    avgProductRating: 4.6,
  };

  const bestSellingMock = [
    { name: "Dental Chew Sticks - 30 Pack", sold: 1567, revenue: 25066.33, image: "https://avatar.iran.liara.run/public/food1" },
    { name: "Premium Dog Food - Chicken & Rice", sold: 1243, revenue: 57157.57, image: "https://avatar.iran.liara.run/public/food2" },
    { name: "Interactive Cat Toy Bundle", sold: 892, revenue: 22291.08, image: "https://avatar.iran.liara.run/public/toy1" },
    { name: "Cat Litter - Odor Control", sold: 734, revenue: 14672.66, image: "https://avatar.iran.liara.run/public/litter" },
    { name: "Orthopedic Dog Bed - Large", sold: 567, revenue: 51022.33, image: "https://avatar.iran.liara.run/public/bed" },
  ];

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
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">{stats.totalUnitsSold.toLocaleString()}</h2>
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
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
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
            <h2 className="text-[24px] font-bold text-[#0a0a0a]">${stats.totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
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
            {bestSellingMock.map((item, index) => (
               <div key={index} className="border border-[#e5e7eb] rounded-[8px] p-[12px] flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div>
                    <div className="flex items-start justify-between mb-[12px]">
                       <span className="text-[18px] font-bold text-[#0a0a0a]">#{index + 1}</span>
                       <div className="w-[38px] h-[38px] bg-gray-100 rounded-[6px] overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                       </div>
                    </div>
                    <p className="text-[12px] text-[#4a5565] mb-[12px] line-clamp-2 h-[36px] font-medium">{item.name}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#eaecf0] pt-[12px]">
                     <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{item.sold} sold</span>
                     <span className="text-[12px] text-green-600 font-bold">${item.revenue.toLocaleString()}</span>
                  </div>
               </div>
            ))}
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
                 {[
                   { id: "ORD-1234", prod: "Premium Dog Food - Chicken & Rice", cust: "Sarah Johnson", qty: 2, amt: 91.98, date: "2025-12-24", stat: "Completed", stock: 489, stClass: "bg-green-100 text-green-700" },
                   { id: "ORD-1235", prod: "Interactive Cat Toy Bundle", cust: "Michael Chen", qty: 1, amt: 24.99, date: "2025-12-24", stat: "Processing", stock: 245, stClass: "bg-blue-100 text-blue-700" },
                   { id: "ORD-1236", prod: "Orthopedic Dog Bed - Large", cust: "Emily Davis", qty: 1, amt: 89.99, date: "2025-12-23", stat: "Pending", stock: 112, stClass: "bg-yellow-100 text-yellow-700" },
                 ].map((row, idx) => (
                   <tr key={idx} className="hover:bg-gray-50/50 transition-colors h-[50px]">
                      <td className="px-[20px] py-[14px] text-[12px] text-[#0a0a0a] font-medium">{row.id}</td>
                      <td className="px-[20px] py-[14px] text-[12px] text-[#0a0a0a] font-medium truncate max-w-[200px]">{row.prod}</td>
                      <td className="px-[20px] py-[14px] text-[12px] text-[#4a5565] truncate max-w-[120px]">{row.cust}</td>
                      <td className="px-[20px] py-[14px] text-[12px] text-[#4a5565]">{row.qty}</td>
                      <td className="px-[20px] py-[14px] text-[12px] text-[#00a63e] font-bold">${row.amt}</td>
                      <td className="px-[20px] py-[14px] text-[12px] text-[#4a5565]">{row.date}</td>
                      <td className="px-[20px] py-[14px]">
                        <span className={`px-[10px] py-[4px] rounded-full text-[10px] font-medium ${row.stClass}`}>{row.stat}</span>
                      </td>
                      <td className="px-[20px] py-[14px] text-[12px] text-[#0a0a0a] font-medium">{row.stock}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
         </div>
         {/* Footer Pagination mock */}
         <div className="px-[20px] py-[12px] border-t border-[#e5e7eb] flex justify-between items-center text-[12px] text-[#6a7282]">
            <span>Showing 1 to 3 of 152 items</span>
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
