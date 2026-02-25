"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { CheckCircle2, Clock, TrendingUp, HelpCircle, ArrowRight } from "lucide-react";
import React from "react";

const statsData = [
  { 
    label: "Released Payments", 
    value: "$600", 
    subtext: "Total received amount", 
    icon: CheckCircle2, 
    color: "bg-green-50", 
    iconColor: "text-emerald-500" 
  },
  { 
    label: "Pending Payout", 
    value: "$1270", 
    subtext: "Awaiting release", 
    icon: Clock, 
    color: "bg-purple-50", 
    iconColor: "text-purple-500" 
  },
  { 
    label: "Total Completed", 
    value: "4", 
    subtext: "Bookings completed", 
    icon: TrendingUp, 
    color: "bg-blue-50", 
    iconColor: "text-blue-500" 
  },
];

const paymentHistory = [
  { id: "#4", petName: "Rocky", amount: "$350", completedDate: "2025-12-05", releaseDate: "2025-12-08", status: "Released" },
  { id: "#5", petName: "Whiskers", amount: "$250", completedDate: "2025-11-25", releaseDate: "2025-11-28", status: "Released" },
  { id: "#1", petName: "Max", amount: "$250", completedDate: "2025-12-15", releaseDate: "Pending", status: "Pending" },
  { id: "#2", petName: "Luna & Bella", amount: "$1020", completedDate: "2025-12-20", releaseDate: "Pending", status: "Pending" },
];

export default function FinancePage() {
  return (
    <div className="space-y-6 pb-10">
      <DashboardHeading 
        title="Finance & Payments" 
        subtitle="View your payment history and pending payouts" 
      />

      {/* Info Banner */}
      <div className="bg-[#fff9f9] border border-[#ff7176] border-opacity-20 rounded-[10px] p-4 flex items-center gap-3 w-full max-w-[1092px]">
        <HelpCircle className="w-5 h-5 text-[#ff7176]" />
        <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">
          <span className="font-bold text-[#ff7176]">Payment Flow:</span> All payments go to Super Admin first. After booking completion and final review, payments are released to your account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1092px]">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-gray-500 font-['Arial:Regular']">{stat.label}</span>
              </div>
              <span className="text-[28px] font-bold text-[#101828] font-['Arial:Bold']">{stat.value}</span>
              <span className="text-[12px] text-gray-400 font-['Arial:Regular']">{stat.subtext}</span>
            </div>
            <div className={`w-[48px] h-[48px] rounded-[10px] ${stat.color} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Payment History Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] shadow-sm w-full max-w-[1092px] overflow-hidden">
        <div className="p-6 pb-4 border-b border-[#e5e7eb]">
          <h2 className="text-[18px] font-bold text-[#101828] font-['Arial:Bold']">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="px-6 py-3 text-[12px] font-bold text-gray-500 uppercase font-['Arial:Bold']">Booking ID</th>
                <th className="px-6 py-3 text-[12px] font-bold text-gray-500 uppercase font-['Arial:Bold']">Pet Name</th>
                <th className="px-6 py-3 text-[12px] font-bold text-gray-500 uppercase font-['Arial:Bold']">Amount</th>
                <th className="px-6 py-3 text-[12px] font-bold text-gray-500 uppercase font-['Arial:Bold']">Completed Date</th>
                <th className="px-6 py-3 text-[12px] font-bold text-gray-500 uppercase font-['Arial:Bold']">Release Date</th>
                <th className="px-6 py-3 text-[12px] font-bold text-gray-500 uppercase font-['Arial:Bold'] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {paymentHistory.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-[14px] text-black font-['Arial:Regular']">{row.id}</td>
                  <td className="px-6 py-4 text-[14px] text-black font-['Arial:Regular']">{row.petName}</td>
                  <td className={`px-6 py-4 text-[14px] font-bold font-['Arial:Bold'] ${row.status === 'Released' ? 'text-emerald-600' : 'text-emerald-600'}`}>
                    {row.amount}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-gray-600 font-['Arial:Regular']">{row.completedDate}</td>
                  <td className={`px-6 py-4 text-[14px] font-['Arial:Regular'] ${row.releaseDate === 'Pending' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {row.releaseDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                        row.status === 'Released' ? 'bg-[#dcfce7] text-[#008236]' : 'bg-[#fef9c3] text-[#a16207]'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Timeline Card */}
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] shadow-sm w-full max-w-[1092px] p-8">
        <h2 className="text-[18px] font-bold text-[#101828] font-['Arial:Bold'] mb-8">Payment Timeline</h2>
        <div className="flex flex-col gap-0">
          {/* Step 1 */}
          <div className="flex gap-6 pb-12 relative">
            <div className="absolute left-[19px] top-[40px] bottom-0 w-[2px] bg-gray-100"></div>
            <div className="w-[40px] h-[40px] rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 z-10">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-bold text-[#101828] font-['Arial:Bold']">Booking Completed</h3>
              <p className="text-[14px] text-gray-500 font-['Arial:Regular']">Pet check-out and final inspection</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6 pb-12 relative">
             <div className="absolute left-[19px] top-[40px] bottom-0 w-[2px] bg-gray-100"></div>
            <div className="w-[40px] h-[40px] rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 z-10">
              <span className="text-blue-500 font-bold text-sm">$</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-bold text-[#101828] font-['Arial:Bold']">Super Admin Review</h3>
              <p className="text-[14px] text-gray-500 font-['Arial:Regular']">Admin verifies completion and customer satisfaction</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="w-[40px] h-[40px] rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100 z-10">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-bold text-[#101828] font-['Arial:Bold']">Payment Released</h3>
              <p className="text-[14px] text-gray-500 font-['Arial:Regular']">Funds transferred to your account (typically 2-3 business days)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
