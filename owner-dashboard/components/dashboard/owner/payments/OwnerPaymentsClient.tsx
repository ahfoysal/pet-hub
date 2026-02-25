/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetOwnerBookingHistoryQuery } from "@/redux/features/api/dashboard/owner/summary/ownerSummaryApi";
import {
  Search,
  Loader2,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function OwnerPaymentsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetOwnerBookingHistoryQuery({ limit: 50 });

  const bookings = data?.data?.items || [];

  // Filter bookings based on search term
  const filteredPayments = bookings.filter(
    (booking: any) =>
      booking.petSitter?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
            Payments & Transactions
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Track all your service bookings and payment history in one place.
          </p>
        </div>

        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by ID or provider..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-arimo text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-arimo">
              Total Spent
            </p>
            <h3 className="text-2xl font-black text-gray-900 font-nunito mt-1">
              $2,450.80
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-arimo">
              Pending Payments
            </p>
            <h3 className="text-2xl font-black text-gray-900 font-nunito mt-1">
              $120.00
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
            <ArrowDownLeft className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-arimo">
              Wallet Balance
            </p>
            <h3 className="text-2xl font-black text-gray-900 font-nunito mt-1">
              $0.00
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 font-nunito">
            Transaction History
          </h3>
          <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
            Download Statements
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Reference
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Service Provider
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Type
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Date
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Amount
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-arimo">
                  Status
                </th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-400 font-arimo italic">
                      Compiling your financial history...
                    </p>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-8 py-20 text-center text-gray-400 font-arimo"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment: any) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 font-arimo uppercase tracking-wider">
                            #{payment.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-[10px] text-gray-400 font-arimo mt-0.5">
                            Booking Ref
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-gray-900 font-nunito">
                          {payment.petSitter?.fullName || "Service Provider"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-gray-500 font-arimo">
                        Pet Sitting
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-gray-600 font-arimo">
                        {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-sm font-black text-gray-900 font-nunito">
                          -${payment.totalPrice || "45.00"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          payment.status === "COMPLETED"
                            ? "bg-green-50 text-green-600"
                            : payment.status === "PENDING"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600">
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
