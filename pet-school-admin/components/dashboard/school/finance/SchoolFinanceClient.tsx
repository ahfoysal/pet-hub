/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAllAdmissionRequestQuery } from "@/redux/features/api/dashboard/school/admission/SchoolAdmissionApi";
import { useGetSchoolDashboardResponseQuery } from "@/redux/features/api/dashboard/school/dashboard/SchoolDashboardApi";
import {
  Search,
  Loader2,
  DollarSign,
  Calendar,
  GraduationCap,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function SchoolFinanceClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: admissionData, isLoading: isAdmissionLoading } =
    useGetAllAdmissionRequestQuery();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useGetSchoolDashboardResponseQuery();

  const admissions = admissionData?.data || [];

  // Filter admissions based on search term
  const filteredTransactions = admissions.filter(
    (adm: any) =>
      adm.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
            Financial Overview
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Manage course revenue, enrollment fees, and banking details.
          </p>
        </div>

        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student, course, or ID..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-arimo text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
              Revenue
            </p>
            <h3 className="text-3xl font-black text-gray-900 font-nunito mt-1">
              $12,850
            </h3>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-indigo-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>+15% this month</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
            <DollarSign className="w-32 h-32" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
              Pending Fees
            </p>
            <h3 className="text-3xl font-black text-gray-900 font-nunito mt-1">
              $2,400
            </h3>
            <p className="text-[10px] text-gray-400 font-arimo mt-1">
              From 8 pending admissions
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
              Next Payout
            </p>
            <h3 className="text-3xl font-black text-gray-900 font-nunito mt-1">
              Mar 05
            </h3>
            <button className="text-[10px] font-bold text-orange-400 hover:text-orange-500 transition-colors uppercase mt-1">
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-xl font-bold text-gray-900 font-nunito">
            Revenue History
          </h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-arimo shadow-sm">
              Filter
            </button>
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-primary transition-all font-arimo shadow-lg shadow-gray-200 uppercase tracking-wider">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/20">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Student / Pet
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Course
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Reference
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Amount
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Status
                </th>
                <th className="px-10 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {isAdmissionLoading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-24 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-400 font-arimo italic text-lg tracking-tight">
                      Gathering financial data...
                    </p>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-10 py-24 text-center text-gray-400 font-arimo"
                  >
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((adm: any) => (
                  <tr
                    key={adm.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 font-bold group-hover:bg-white transition-colors">
                          {adm.pet?.name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 font-nunito">
                            {adm.pet?.name || "Student Pet"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-arimo uppercase tracking-widest mt-0.5">
                            Owner ID: {adm.userId.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        <p className="text-sm font-bold text-gray-700 font-nunito">
                          {adm.course?.name || "Premium Course"}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-xs font-bold text-gray-400 font-arimo tracking-[0.1em]">
                        #{adm.id.slice(-10).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-gray-300 font-arimo mt-0.5">
                        {format(new Date(adm.createdAt), "MMM dd, yyyy")}
                      </p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-black font-nunito">
                        <ArrowDownLeft className="w-4 h-4" />
                        <span className="text-lg">
                          +${adm.course?.price || "150"}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span
                        className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] ${
                          adm.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : adm.status === "PENDING"
                              ? "bg-orange-50 text-orange-600 border border-orange-100"
                              : "bg-gray-50 text-gray-400 border border-gray-100"
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all text-gray-300 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
