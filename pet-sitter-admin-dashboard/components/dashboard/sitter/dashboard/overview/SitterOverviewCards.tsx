"use client";

import { useGetSitterStatsQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/react";
import { Layers, CheckCircle, Clock, Shield } from "lucide-react";

export default function SitterOverviewCards() {
  const { status } = useSession();
  const { data, isLoading } = useGetSitterStatsQuery(undefined, {
    skip: status === "loading",
  });
  const stats = data?.data;

  const summary = [
    {
      title: "Total Bookings",
      value: stats?.bookings?.total || 0,
      icon: Layers,
      period: "This Month",
    },
    {
      title: "NEW BOOKINGS",
      value: stats?.bookings?.new || 0,
      icon: CheckCircle,
      period: "This Week",
    },
    {
      title: "Pending Confirmation",
      value: stats?.bookings?.pending || 0,
      icon: Clock,
      period: "Today",
    },
    {
      title: "ACTIVE PACKAGES",
      value: stats?.packages?.active || 0,
      icon: Shield,
      period: "This month",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="rounded-[12px]">
            <div className="h-[120px] rounded-[12px] bg-default-200"></div>
          </Skeleton>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summary.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="p-5 bg-white rounded-[12px] border border-[#e9eaeb] flex items-start gap-5 transition-all shadow-sm"
          >
            <div className="bg-[#f5f5f5] rounded-full flex items-center justify-center size-[54px] shrink-0">
              <Icon className="w-6 h-6 text-[#101828]" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex flex-col gap-1">
                <p className="text-[#101828] text-sm font-medium font-inter uppercase tracking-tight opacity-80">{stat.title}</p>
                <h3 className="text-[22px] font-bold text-[#101828] font-nunito tracking-[-0.44px]">
                  {stat.value.toLocaleString()}
                </h3>
              </div>
              <p className="text-[#667085] text-sm font-normal font-inter">{stat.period}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
