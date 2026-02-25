"use client";

import { useGetVendorDashboardQuery } from "@/redux/features/api/dashboard/vendor/dashboard/vendorDashboardApi";
import {
  Package,
  ShoppingCart,
  Star,
  Boxes,
  TrendingUp,
  Eye,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PageHeader, StatCard, TableContainer, StatusBadge, ActionButton } from "@/components/dashboard/shared/DashboardUI";

export default function VendorDashboardPage() {
  const { data: session, status } = useSession();
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetVendorDashboardQuery(undefined, {
    skip: status === "loading",
  });

  const dashboardData = response?.data;

  if (isError) {
    const isVerificationError =
      (response as any)?.meta?.statusCode === 403 ||
      (response as any)?.message?.includes("verified") ||
      (response as any)?.message?.includes("active");

    return (
      <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md border border-gray-100">
          <div className={`w-16 h-16 ${isVerificationError ? "bg-amber-100" : "bg-red-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {isVerificationError ? <Package className="w-8 h-8 text-amber-600" /> : <Boxes className="w-8 h-8 text-red-600" />}
          </div>
          <h2 className="text-xl font-bold text-[#101828] mb-2 font-arimo">{isVerificationError ? "Verification Required" : "Failed to load dashboard"}</h2>
          <p className="text-[#6a7282] mb-6 font-arimo">{isVerificationError ? "Your vendor profile is not yet verified. Please complete your identity verification to access the dashboard." : "Something went wrong. Please try again."}</p>
          {isVerificationError ? (
            <Link href="https://auth-pethub-rnc.vercel.app/kyc-verification" className="px-6 py-3 bg-[#ff7176] text-white rounded-xl font-bold hover:bg-[#ff7176]/90 transition-all shadow-md inline-block">Complete Verification</Link>
          ) : (
            <button onClick={() => refetch()} className="px-6 py-3 bg-[#ff7176] text-white rounded-xl font-bold hover:bg-[#ff7176]/90 transition-all shadow-md">Try Again</button>
          )}
        </div>
      </div>
    );
  }

  // Mock data for table as per Figma
  const recentOrders = [
    { id: "PRD-001", name: "Automatic Pet Feeder", quantity: 1, price: 200, status: "Completed", category: "Food", date: "12/02/2026", image: "https://avatar.iran.liara.run/public/4" },
    { id: "PRD-002", name: "Pet Grooming Kit", quantity: 2, price: 200, status: "Pending", category: "Accessories", date: "12/02/2026", image: "https://avatar.iran.liara.run/public/5" },
    { id: "PRD-003", name: "Orthopedic Dog Bed", quantity: 4, price: 200, status: "Completed", category: "Accessories", date: "12/02/2026", image: "https://avatar.iran.liara.run/public/6" },
    { id: "PRD-004", name: "Cat Climbing Post", quantity: 4, price: 200, status: "Pending", category: "Accessories", date: "12/02/2026", image: "https://avatar.iran.liara.run/public/7" },
    { id: "PRD-005", name: "Premium Dog Food", quantity: 1, price: 200, status: "Completed", category: "Food", date: "12/02/2026", image: "https://avatar.iran.liara.run/public/8" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-[26px]">
      <PageHeader 
        title={`Hey ${session?.user?.name?.split(" ")[0] || "Habib"}!`} 
        subtitle="Sales performance, product growth, and inventory insights" 
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18.6px]">
        <StatCard
          title="Total Order"
          value={dashboardData?.totalUnitsSold ?? 0}
          icon={<ShoppingCart className="text-blue-500" strokeWidth={2.5} size={18} />}
          iconBg="bg-blue-500/10"
          indicator="+12%"
          trendIcon={<TrendingUp className="w-[10px] h-[10px] text-[#008236]" />}
        />
        <StatCard
          title="Total Pending Order"
          value={6371}
          icon={<ShoppingCart className="text-purple-500" strokeWidth={2.5} size={18} />}
          iconBg="bg-purple-500/10"
          indicator="+18%"
          trendIcon={<TrendingUp className="w-[10px] h-[10px] text-[#008236]" />}
        />
        <StatCard
          title="Avg Product Rating"
          value={(dashboardData?.averageRating ?? 4.6).toFixed(1)}
          icon={<Star className="text-amber-500 fill-amber-500" size={18} />}
          iconBg="bg-amber-500/10"
          indicator="+0.3"
          trendIcon={<TrendingUp className="w-[10px] h-[10px] text-[#008236]" />}
        />
      </div>

      {/* Recent Orders Table */}
      <TableContainer 
        title="Recent Order" 
        footer={
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#667085] font-inter">Showing {recentOrders.length} of {recentOrders.length} orders</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer font-inter">Previous</button>
              <button className="px-4 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer font-inter">Next</button>
            </div>
          </div>
        }
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-wider">Name</th>
              <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-wider">Quantity</th>
              <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-wider">Price</th>
              <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-wider">Status</th>
              <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-wider">Category</th>
              <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-wider">Date</th>
              <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] font-inter tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, idx) => (
              <tr key={idx} className="border-b border-[#eaecf0] last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="px-[24px] py-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-[#c7b9da]/30 ring-1 ring-gray-100 shrink-0">
                      <img src={order.image} alt={order.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-medium text-[#101828] font-inter truncate">{order.name}</span>
                      <span className="text-[12px] text-[#667085] font-inter">{order.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-[24px] py-[16px] text-[14px] text-[#667085] font-inter">{order.quantity}</td>
                <td className="px-[24px] py-[16px] text-[14px] text-[#667085] font-inter">${order.price}</td>
                <td className="px-[24px] py-[16px]">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-[24px] py-[16px] text-[14px] text-[#667085] font-inter">{order.category}</td>
                <td className="px-[24px] py-[16px] text-[14px] text-[#667085] font-inter">{order.date}</td>
                <td className="px-[24px] py-[16px]">
                  <div className="flex items-center gap-[4px]">
                    <button className="p-[10px] text-[#667085] hover:bg-gray-50 rounded-[8px] transition-colors cursor-pointer">
                      <Eye size={20} />
                    </button>
                    <button className="p-[10px] text-[#667085] hover:bg-red-50 hover:text-red-500 rounded-[8px] transition-colors cursor-pointer">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
}
