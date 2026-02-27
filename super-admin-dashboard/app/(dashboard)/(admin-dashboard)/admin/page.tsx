// Figma Node: Admin Dashboard Overview Page
// Architectural Intent: Main dashboard page displaying dynamic overview stats, charts, and recent KYC

"use client";

import React, { useState } from "react";
import { StatsCard } from "@/components/dashboard/admin/home/StatsCard";
import { BookingTrendsChart } from "@/components/dashboard/admin/home/BookingTrendsChart";
import { RevenueFlowChart } from "@/components/dashboard/admin/home/RevenueFlowChart";
import { RecentKycTable } from "@/components/dashboard/admin/home/RecentKycTable";
import { KycDetailModal } from "@/components/dashboard/admin/home/KycDetailModal";
import {
  useGetOverviewStatsQuery,
  useGetRecentKycQuery,
} from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";
import type { RecentKycItem } from "@/types/dashboard/admin/dashboard/adminDashboardType";

export default function AdminDashboardPage() {
  const { data: overviewStats, isLoading: isStatsLoading } = useGetOverviewStatsQuery();
  const { data: recentKyc, isLoading: isKycLoading } = useGetRecentKycQuery();
  const [selectedKyc, setSelectedKyc] = useState<RecentKycItem | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return String(num);
  };

  const statsData = overviewStats?.data;

  const stats = [
    {
      title: "Active Providers",
      value: isStatsLoading ? "..." : formatNumber(statsData?.activeProviders?.count ?? 0),
      trend: `${Math.abs(statsData?.activeProviders?.trend ?? 0)}%`,
      trendType: (statsData?.activeProviders?.trend ?? 0) >= 0 ? "up" as const : "down" as const,
      valueColor: "text-[#282828]",
    },
    {
      title: "Pet Owners",
      value: isStatsLoading ? "..." : formatNumber(statsData?.petOwners?.count ?? 0),
      trend: `${Math.abs(statsData?.petOwners?.trend ?? 0)}%`,
      trendType: (statsData?.petOwners?.trend ?? 0) >= 0 ? "up" as const : "down" as const,
      valueColor: "text-[#282828]",
    },
    {
      title: "KYC Pending",
      value: isStatsLoading ? "..." : formatNumber(statsData?.kycPending?.count ?? 0),
      trend: `${Math.abs(statsData?.kycPending?.trend ?? 0)}%`,
      trendType: (statsData?.kycPending?.trend ?? 0) >= 0 ? "up" as const : "down" as const,
      valueColor: "text-[#282828]",
    },
    {
      title: "Payout Pending",
      value: isStatsLoading ? "..." : formatNumber(statsData?.payoutPending?.count ?? 0),
      trend: `${Math.abs(statsData?.payoutPending?.trend ?? 0)}%`,
      trendType: (statsData?.payoutPending?.trend ?? 0) >= 0 ? "up" as const : "down" as const,
      valueColor: "text-[#282828]",
    },
    {
      title: "Open Reports",
      value: isStatsLoading ? "..." : formatNumber(statsData?.openReports?.count ?? 0),
      trend: `${Math.abs(statsData?.openReports?.trend ?? 0)}%`,
      trendType: (statsData?.openReports?.trend ?? 0) >= 0 ? "up" as const : "down" as const,
      valueColor: "text-[#282828]",
    },
  ];

  return (
    <div className="flex flex-col gap-[25px] p-[20px] lg:p-[40px]">
      <div className="flex flex-col gap-[8px]">
        <h1 className="font-['Nunito',sans-serif] font-medium text-[30px] leading-[36px] text-[#282828]">
          Dashboard Overview
        </h1>
        <p className="font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#4a5565]">
          Monitor your entire Pet Care SaaS ecosystem
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[12px]">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[23px]">
        <BookingTrendsChart />
        <RevenueFlowChart />
      </div>

      <RecentKycTable onViewKyc={(kyc) => setSelectedKyc(kyc)} />

      {selectedKyc && (
        <KycDetailModal
          kyc={selectedKyc}
          onClose={() => setSelectedKyc(null)}
        />
      )}
    </div>
  );
}
