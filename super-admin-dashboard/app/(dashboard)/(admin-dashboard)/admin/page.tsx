"use client";

import React from "react";
import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { StatsCard } from "@/components/dashboard/admin/home/StatsCard";
import { BookingTrendsChart } from "@/components/dashboard/admin/home/BookingTrendsChart";
import { RevenueFlowChart } from "@/components/dashboard/admin/home/RevenueFlowChart";
import { RecentActivity } from "@/components/dashboard/admin/home/RecentActivity";
import { ProviderDistributionChart } from "@/components/dashboard/admin/home/ProviderDistributionChart";
import { useGetRolesCountQuery, useGetRecentKycQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";

export default function AdminDashboardPage() {
  const { data: rolesCount, isLoading: isRolesLoading } = useGetRolesCountQuery();
  const { data: recentKyc, isLoading: isKycLoading } = useGetRecentKycQuery();

  const providersCount = (rolesCount?.data?.PET_SITTER || 0) + 
                       (rolesCount?.data?.VENDOR || 0) + 
                       (rolesCount?.data?.PET_HOTEL || 0) + 
                       (rolesCount?.data?.PET_SCHOOL || 0);

  const stats = [
    {
      title: "Active Providers",
      value: isRolesLoading ? "..." : providersCount.toLocaleString(),
      trend: "12.5%",
      trendType: "up" as const,
      valueColor: "text-[#4a5565]",
    },
    {
      title: "Pet Owners",
      value: isRolesLoading ? "..." : (rolesCount?.data?.PET_OWNER || 0).toLocaleString(),
      trend: "12.5%",
      trendType: "up" as const,
      valueColor: "text-[#008236]",
    },
    {
      title: "KYC Pending",
      value: isKycLoading ? "..." : "71", // Placeholder until verified backend count exists
      trend: "12.5%",
      trendType: "up" as const,
      valueColor: "text-[#e7000b]",
    },
    {
      title: "Payout Pending",
      value: "6,371",
      trend: "12.5%",
      trendType: "up" as const,
      valueColor: "text-[#155dfc]",
    },
    {
      title: "Open Reports",
      value: "12",
      trend: "12.5%",
      trendType: "up" as const,
      valueColor: "text-[#155dfc]",
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[23px]">
        <ProviderDistributionChart />
        <RecentActivity />
      </div>
    </div>
  );
}
