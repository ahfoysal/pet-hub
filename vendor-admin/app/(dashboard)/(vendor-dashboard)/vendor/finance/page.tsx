"use client";

import React, { useState } from "react";
import FinanceStats from "@/components/dashboard/vendor/finance/FinanceStats";
import FinanceHistoryTable from "@/components/dashboard/vendor/finance/FinanceHistoryTable";
import PaymentTimeline from "@/components/dashboard/vendor/finance/PaymentTimeline";
import PaymentFlowAlert from "@/components/dashboard/vendor/finance/PaymentFlowAlert";
import { 
  useGetFinanceOverviewQuery, 
  useGetFinanceHistoryQuery, 
  useGetFinanceTimelineQuery 
} from "@/redux/features/api/dashboard/vendor/finance/vendorFinanceApi";

export default function VendorFinancePage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState("");

  const { data: overview, isLoading: isOverviewLoading } = useGetFinanceOverviewQuery();
  const { data: history, isLoading: isHistoryLoading } = useGetFinanceHistoryQuery({
    page,
    limit,
    status,
  });
  const { data: timeline, isLoading: isTimelineLoading } = useGetFinanceTimelineQuery();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#f2f4f8] min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#0a0a0a]">Finance & Payments</h1>
        <p className="text-gray-500">View your payment history and pending payouts</p>
      </div>

      <PaymentFlowAlert />

      <FinanceStats data={overview?.data} isLoading={isOverviewLoading} />

      <div className="flex flex-col gap-8">
        <FinanceHistoryTable 
          data={history?.data} 
          isLoading={isHistoryLoading} 
          onPageChange={handlePageChange}
          onStatusChange={handleStatusChange}
          currentStatus={status}
        />
        <div>
          <PaymentTimeline data={timeline?.data} isLoading={isTimelineLoading} />
        </div>
      </div>
    </div>
  );
}
