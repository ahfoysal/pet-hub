/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign
} from "lucide-react";
import { useGetMyBookingsQuery } from "@/redux/features/api/dashboard/sitter/bookings/sitterBookingApi";
import { useGetSitterStatsQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { 
  PageHeader, 
  TableContainer 
} from "@/components/dashboard/shared/DashboardUI";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SitterFinanceClient() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetSitterStatsQuery();
  const { data: bookingsData, isLoading: isBookingsLoading } =
    useGetMyBookingsQuery({ limit: 10 });

  const transactions = bookingsData?.data?.data || [];
  const stats = dashboardData?.data;
  const totalRevenue = stats?.totalEarnings || 0;
  const pendingPayout = stats?.pendingPayout || 0;
  const totalCompleted = stats?.bookings?.byStatus?.COMPLETED || 0;

  if (isDashboardLoading || isBookingsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-[25px] pb-10 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title="Finance & Payments" 
        subtitle="View your payment history and pending payouts" 
      />

      {/* Payment Flow Banner */}
      <div className="bg-[#fff9f1] border border-[#ff9d00]/20 rounded-[12px] p-4 flex items-start gap-3">
        <div className="mt-0.5">
           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15V10M10 7H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#FF9D00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <p className="text-[14px] leading-relaxed text-[#0a0a0a]">
          <span className="font-bold text-[#ff7176]">Payment Flow:</span> All payments go to Super Admin first. After booking completion and final review, payments are released to your account.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[25px]">
        {/* Released Payments */}
        <div className="bg-white border border-[#e5e7eb] rounded-[18px] p-6 shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-[#008236]" />
                </div>
                <span className="text-[16px] font-medium text-[#4a5565]">Released Payments</span>
              </div>
              <h2 className="text-[32px] font-bold text-[#0a0a0a] mt-2">${totalRevenue}</h2>
              <p className="text-[14px] text-[#667085] mt-1">Total received amount</p>
            </div>
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-white border border-[#e5e7eb] rounded-[18px] p-6 shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#f3e8ff] flex items-center justify-center">
                  <Clock size={18} className="text-[#7e22ce]" />
                </div>
                <span className="text-[16px] font-medium text-[#4a5565]">Pending Payout</span>
              </div>
              <h2 className="text-[32px] font-bold text-[#0a0a0a] mt-2">${pendingPayout}</h2>
              <p className="text-[14px] text-[#667085] mt-1">Awaiting release</p>
            </div>
          </div>
        </div>

        {/* Total Completed */}
        <div className="bg-white border border-[#e5e7eb] rounded-[18px] p-6 shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#e0f2fe] flex items-center justify-center">
                  <TrendingUp size={18} className="text-[#0369a1]" />
                </div>
                <span className="text-[16px] font-medium text-[#4a5565]">Total Completed</span>
              </div>
              <h2 className="text-[32px] font-bold text-[#0a0a0a] mt-2">{totalCompleted}</h2>
              <p className="text-[14px] text-[#667085] mt-1">Bookings completed</p>
            </div>
          </div>
        </div>
      </div>

      <TableContainer title="Payment History">
        <table className="w-full border-collapse">
          <thead className="bg-[#f9fafb]">
            <tr>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Booking ID</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Pet Name</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Amount</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Completed Date</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Release Date</th>
              <th className="px-6 py-4 text-left text-[14px] font-bold text-[#4a5565] border-b border-[#eaecf0]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
             {transactions.length > 0 ? (
               transactions.slice(0, 5).map((row: any, idx: number) => {
                 const status = row.status === "COMPLETED" ? "Released" : "Pending";
                 const releaseDate = row.status === "COMPLETED" ? new Date(row.updatedAt).toLocaleDateString() : "Pending";
                 
                 return (
                   <tr key={idx} className="hover:bg-gray-50/50 transition-colors h-[72px]">
                     <td className="px-6 py-4 text-[14px] font-medium text-[#0a0a0a]">#{row.bookingId || row.id?.substring(0,6).toUpperCase()}</td>
                     <td className="px-6 py-4 text-[14px] text-[#0a0a0a]">{row.pet?.name || "N/A"}</td>
                     <td className="px-6 py-4 text-[14px] font-bold text-[#008236]">${row.totalPrice || row.amount || 0}</td>
                     <td className="px-6 py-4 text-[14px] text-[#0a0a0a]">{new Date(row.createdAt).toLocaleDateString()}</td>
                     <td className="px-6 py-4 text-[14px] text-[#667085]">{releaseDate}</td>
                     <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                          status === "Released" ? "bg-[#dcfce7] text-[#008236]" : "bg-[#fff5e5] text-[#fe9a00]"
                        }`}>
                          {status}
                        </span>
                     </td>
                   </tr>
                 );
               })
             ) : (
               <tr>
                 <td colSpan={6} className="px-6 py-8 text-center text-[#667085] text-sm">
                   No payments found
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </TableContainer>

      {/* Payment Timeline */}
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] p-6 shadow-sm">
        <h3 className="text-[18px] font-bold text-[#0a0a0a] mb-8">Payment Timeline</h3>
        
        <div className="space-y-0 pl-4 relative">
          {/* Vertical Line */}
          <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-[#f2f4f8]"></div>
          
          {/* Step 1 */}
          <div className="flex items-start gap-6 relative pb-10">
            <div className="z-10 w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
               <CheckCircle2 size={16} className="text-[#008236]" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#0a0a0a]">Booking Completed</p>
              <p className="text-[14px] text-[#4a5565] mt-1">Pet check-out and final inspection</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-6 relative pb-10">
            <div className="z-10 w-8 h-8 rounded-full bg-[#e0f2fe] flex items-center justify-center flex-shrink-0">
               <DollarSign size={16} className="text-[#0369a1]" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#0a0a0a]">Super Admin Review</p>
              <p className="text-[14px] text-[#4a5565] mt-1">Admin verifies completion and customer satisfaction</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-6 relative">
            <div className="z-10 w-8 h-8 rounded-full bg-[#f3e8ff] flex items-center justify-center flex-shrink-0">
               <TrendingUp size={16} className="text-[#7e22ce]" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-[#0a0a0a]">Payment Released</p>
              <p className="text-[14px] text-[#4a5565] mt-1">Funds transferred to your account (typically 2-3 business days)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
