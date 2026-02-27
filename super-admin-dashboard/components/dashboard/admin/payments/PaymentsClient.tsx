"use client";

import React, { useState } from "react";
import { useGetFinanceStatsQuery, useGetRecentTransactionsQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";
import { Loader2 } from "lucide-react";
import { TransactionItem } from "@/types/dashboard/admin/dashboard/adminDashboardType";

export default function PaymentsClient() {
  const [activeTab, setActiveTab] = useState<"All Payouts" | "Pending" | "On Hold" | "Released">("All Payouts");
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  const { data: statsData, isLoading: isLoadingStats } = useGetFinanceStatsQuery();
  const { data: transactionsData, isLoading: isLoadingTransactions, isFetching: isFetchingTransactions } = useGetRecentTransactionsQuery({
    limit: 10,
    cursor: currentCursor,
  });

  const stats = statsData?.data;
  const transactions = transactionsData?.data?.items || [];
  const nextCursor = transactionsData?.data?.nextCursor;

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor || ""]);
      setCurrentCursor(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const prevHistory = [...cursorHistory];
      const prevCursor = prevHistory.pop();
      setCursorHistory(prevHistory);
      setCurrentCursor(prevCursor === "" ? undefined : prevCursor);
    }
  };

  const filteredTransactions = transactions.filter((t: TransactionItem) => {
    if (activeTab === "All Payouts") return true;
    if (activeTab === "Pending") return t.status === "PENDING";
    if (activeTab === "On Hold") return t.status === "ON_HOLD";
    if (activeTab === "Released") return t.status === "RELEASED";
    return true;
  });

  return (
    <div className="size-full bg-[#f2f4f8] -m-6 p-6 min-h-[calc(100vh-80px)]" data-name="Payments & Payouts">
      <div className="flex flex-col gap-[25px] w-[1090px] mx-auto mt-[26px]">
        
        {/* Header Text */}
        <div className="flex flex-col gap-[8px] h-[68px] w-full">
          <div className="h-[36px] w-[355px]">
            <h1 className="font-['Arimo',sans-serif] font-normal leading-[36px] text-[#0a0a0a] text-[30px] m-0">
               Payments & Payouts
            </h1>
          </div>
          <div className="h-[24px] w-full">
            <p className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#4a5565] text-[16px] m-0">
               Control provider payments and payout releases
            </p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="flex gap-[12px] items-center w-[1090px] h-[119px]">
           <div className="bg-white border border-[rgba(197,197,197,0.2)] flex flex-col justify-between p-[14px] rounded-[7.7px] flex-1 h-full">
               <span className="font-['Arimo',sans-serif] font-semibold text-[#252323] text-[20px]">Pending Payouts</span>
               <span className="font-['Arimo',sans-serif] font-normal text-[#4a5565] text-[23.246px]">
                 {isLoadingStats ? <span className="animate-pulse bg-gray-200 h-6 w-24 rounded inline-block"></span> : `$${(stats?.pendingPayoutsAmount || 0).toFixed(2)}`}
               </span>
           </div>
           <div className="bg-white border border-[rgba(197,197,197,0.2)] flex flex-col justify-between p-[14px] rounded-[7.7px] flex-1 h-full">
               <span className="font-['Arimo',sans-serif] font-semibold text-[#252323] text-[20px]">Released This Month</span>
               <span className="font-['Arimo',sans-serif] font-normal text-[#008236] text-[23.246px]">
                 {isLoadingStats ? <span className="animate-pulse bg-gray-200 h-6 w-24 rounded inline-block"></span> : `$${(stats?.releasedThisMonth || 0).toFixed(2)}`}
               </span>
           </div>
           <div className="bg-white border border-[rgba(197,197,197,0.2)] flex flex-col justify-between p-[14px] rounded-[7.7px] flex-1 h-full">
               <span className="font-['Arimo',sans-serif] font-semibold text-[#252323] text-[20px]">On Hold</span>
               <span className="font-['Arimo',sans-serif] font-normal text-[#e7000b] text-[23.246px]">
                 {isLoadingStats ? <span className="animate-pulse bg-gray-200 h-6 w-12 rounded inline-block"></span> : String(stats?.onHold || 0)}
               </span>
           </div>
           <div className="bg-white border border-[rgba(197,197,197,0.2)] flex flex-col justify-between p-[14px] rounded-[7.7px] flex-1 h-full">
               <span className="font-['Arimo',sans-serif] font-semibold text-[#252323] text-[20px]">Total Transactions</span>
               <span className="font-['Arimo',sans-serif] font-normal text-[#155dfc] text-[23.246px]">
                 {isLoadingStats ? <span className="animate-pulse bg-gray-200 h-6 w-12 rounded inline-block"></span> : String(stats?.totalTransactions || 0)}
               </span>
           </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-[#e2e8f0] flex h-[76px] items-center px-[20px] rounded-[14px] w-full gap-[8px]">
           {["All Payouts", "Pending", "On Hold", "Released"].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as typeof activeTab)}
               className={`px-[16px] py-[8px] rounded-[10px] text-[14px] font-['Inter',sans-serif] font-medium leading-[20px] transition-colors ${
                 activeTab === tab
                   ? "bg-[#ff7176] text-white"
                   : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* Table Container */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1090px]">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] h-[60px]">
                  <th className="font-['Inter',sans-serif] font-bold leading-[16px] px-[24px] text-[#4a5565] text-[14px] tracking-[0.6px] align-middle">
                    Provider
                  </th>
                  <th className="font-['Inter',sans-serif] font-bold leading-[16px] px-[24px] text-[#4a5565] text-[14px] tracking-[0.6px] align-middle">
                    Service Type
                  </th>
                  <th className="font-['Inter',sans-serif] font-bold leading-[16px] px-[24px] text-[#4a5565] text-[14px] tracking-[0.6px] align-middle text-center">
                    Booking ID
                  </th>
                  <th className="font-['Inter',sans-serif] font-bold leading-[16px] px-[24px] text-[#4a5565] text-[14px] tracking-[0.6px] align-middle text-center">
                    Completion Date
                  </th>
                  <th className="font-['Inter',sans-serif] font-bold leading-[16px] px-[24px] text-[#4a5565] text-[14px] tracking-[0.6px] align-middle text-center">
                    Amount
                  </th>
                  <th className="font-['Inter',sans-serif] font-bold leading-[16px] px-[24px] text-[#4a5565] text-[14px] tracking-[0.6px] align-middle text-center">
                    Platform Fee
                  </th>
                  <th className="font-['Inter',sans-serif] font-bold leading-[16px] px-[24px] text-[#4a5565] text-[14px] tracking-[0.6px] align-middle text-center">
                    Status
                  </th>
                  <th className="font-['Inter',sans-serif] font-bold leading-[16px] px-[24px] text-[#4a5565] text-[14px] tracking-[0.6px] align-middle text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {isLoadingTransactions || isFetchingTransactions ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#62748e]">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                      </div>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#62748e]">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx: TransactionItem) => (
                    <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors h-[86px]">
                        <td className="px-[24px] align-middle">
                            <div className="flex flex-col gap-[5px] w-[142px]">
                                <span className="font-['Arial',sans-serif] font-normal leading-[24px] text-[#101828] text-[16px]">
                                    {trx.provider.name}
                                </span>
                                 <div className={`border flex h-[22px] items-center justify-center px-[11px] py-[3px] rounded-[30px] w-fit ${
                                    trx.provider.type === 'Pet School' ? 'bg-[#dbeafe] text-[#1447e6] border-[#bedbff]' :
                                    trx.provider.type === 'Pet Hotel' ? 'bg-[#e0e7ff] text-[#432dd7] border-[#c6d2ff]' :
                                    trx.provider.type === 'Vendor' ? 'bg-[#d0fae5] text-[#007a55] border-[#a4f4cf]' :
                                    'bg-[#f3e8ff] text-[#8200db] border-[#e9d4ff]'
                                 }`}>
                                    <span className="font-['Arimo',sans-serif] font-normal leading-[16px] text-[12px]">
                                        {trx.provider.type}
                                    </span>
                                </div>
                            </div>
                        </td>
                        <td className="px-[24px] align-middle">
                            <span className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#0a0a0a] text-[16px] w-[140px] whitespace-pre-wrap flex">
                               {trx.serviceType}
                            </span>
                        </td>
                        <td className="px-[24px] align-middle text-center">
                            <span className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#0a0a0a] text-[16px]">
                               {trx.bookingId}
                            </span>
                        </td>
                        <td className="px-[24px] align-middle text-center">
                             <span className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#0a0a0a] text-[16px]">
                               {trx.completionDate}
                            </span>
                        </td>
                        <td className="px-[24px] align-middle text-center">
                            <span className="font-['Arimo',sans-serif] font-bold leading-[24px] text-[#0a0a0a] text-[16px]">
                               {trx.amount < 0 ? `-$${Math.abs(trx.amount).toFixed(2)}` : `$${trx.amount.toFixed(2)}`}
                            </span>
                        </td>
                        <td className="px-[24px] align-middle text-center">
                            <span className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#ff4848] text-[16px]">
                               {trx.platformFee < 0 ? `-$${Math.abs(trx.platformFee).toFixed(2)}` : `$${trx.platformFee.toFixed(2)}`}
                            </span>
                        </td>
                        <td className="px-[24px] align-middle text-center flex justify-center items-center h-[86px]">
                             <div className={`border flex h-[22px] items-center justify-center px-[11px] py-[3px] rounded-[30px] w-fit ${
                               trx.status === 'PENDING' ? 'bg-[#fef3c6] border-[#fee685] text-[#bb4d00]' :
                               trx.status === 'RELEASED' ? 'bg-[#dcfce7] border-[#b9f8cf] text-[#008236]' :
                               'bg-[#fee2e2] border-[#fecaca] text-[#ef4444]'
                             }`}>
                                <span className="font-['Arimo',sans-serif] font-normal leading-[16px] text-[12px]">
                                    {trx.status === 'PENDING' ? 'Pending' :
                                     trx.status === 'RELEASED' ? 'Released' : 'On Hold'}
                                </span>
                            </div>
                        </td>
                        <td className="px-[24px] align-middle text-center">
                            <button className="bg-[rgba(255,255,255,0.5)] border border-[#cad5e2] rounded-[30px] px-[11px] py-[3px] h-[22px] w-[84px] text-[12px] text-[#6a7282] font-['Arimo',sans-serif] font-normal leading-[16px] hover:bg-gray-50 transition-colors flex items-center justify-center mx-auto">
                                View
                            </button>
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-[24px] py-[16px] border-t border-[#e2e8f0]">
            <span className="text-[14px] text-[#4a5565] font-['Arimo',sans-serif]">
              Showing {transactions.length} transactions
            </span>
            <div className="flex gap-[8px]">
              <button
                onClick={handlePrevPage}
                disabled={cursorHistory.length === 0 || isFetchingTransactions}
                className="px-[16px] py-[8px] border border-[#e2e8f0] rounded-[6px] text-[14px] font-['Arimo',sans-serif] text-[#4a5565] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!nextCursor || isFetchingTransactions}
                className="px-[16px] py-[8px] border border-[#e2e8f0] rounded-[6px] text-[14px] font-['Arimo',sans-serif] text-[#4a5565] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
