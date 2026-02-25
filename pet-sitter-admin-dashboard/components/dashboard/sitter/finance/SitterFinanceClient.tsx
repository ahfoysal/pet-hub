/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetSitterRecentBookingsQuery,
  useGetSitterStatsQuery,
} from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import {
  Search,
  Loader2,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function SitterFinanceClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: recentBookings, isLoading: isBookingsLoading } =
    useGetSitterRecentBookingsQuery();
  const { data: stats, isLoading: isStatsLoading } = useGetSitterStatsQuery();

  const transactions = recentBookings?.data || [];
  const earnings = stats?.data?.totalEarnings || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
          Finance & Earnings
        </h1>
        <p className="text-gray-500 font-arimo mt-2">
          Monitor your revenue, pending payouts, and transaction history.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" />
              +12%
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-arimo">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-gray-900 font-nunito mt-1">
              ${earnings.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-arimo">
              Available Balance
            </p>
            <h3 className="text-3xl font-black text-gray-900 font-nunito mt-1">
              $1,240.50
            </h3>
            <button className="mt-4 w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg shadow-gray-200">
              Request Payout
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-arimo">
              Next Payout
            </p>
            <h3 className="text-3xl font-black text-gray-900 font-nunito mt-1">
              Feb 28
            </h3>
            <p className="text-[10px] text-gray-400 font-arimo mt-1">
              Automatic transfer to ending *4092
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-900 font-nunito">
            Recent Transactions
          </h3>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-arimo text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Transaction
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Type
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Date
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
            <tbody className="divide-y divide-gray-50">
              {isBookingsLoading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-400 font-arimo italic">
                      Synchronizing transactions...
                    </p>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-10 py-20 text-center text-gray-400 font-arimo"
                  >
                    No recent transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50/30 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                          <DollarSign className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 font-nunito">
                            {tx.petOwner?.fullName || "Booking Payout"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-arimo uppercase tracking-widest mt-0.5">
                            #{tx.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-xs font-bold text-gray-500 font-arimo uppercase tracking-wider">
                        Service Fee
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm text-gray-600 font-arimo">
                        {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                      </p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-1.5 text-green-600 font-black font-nunito">
                        <ArrowDownLeft className="w-4 h-4" />
                        <span>+${tx.totalPrice || "0.00"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          tx.status === "COMPLETED"
                            ? "bg-green-50 text-green-600"
                            : tx.status === "PENDING"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100">
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
