"use client";

import { useGetSitterStatsQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Skeleton } from "@nextui-org/react";
import { PackageSearch, Briefcase, CalendarCheck, CircleAlert } from "lucide-react";
import { useSession } from "next-auth/react";

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
      icon: CalendarCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-500/20",
    },
    {
      title: "Active Bookings",
      value: stats?.bookings?.active || 0,
      icon: Briefcase,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-500/20",
    },
    {
      title: "Action Required",
      value: stats?.bookings?.actionRequired || 0,
      icon: CircleAlert,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-500/20",
    },
    {
      title: "Total Packages",
      value: stats?.packages?.total || 0,
      subValue: `${stats?.packages?.available || 0} Available`,
      icon: PackageSearch,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="rounded-xl">
            <div className="h-32 rounded-xl bg-default-300"></div>
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
            className="p-5 bg-white rounded-xl border border-[#e9eaeb] flex items-start gap-5 transition-all"
          >
            <div className="p-2 rounded-full bg-[#f5f5f5] flex items-center justify-center size-[54px] shrink-0">
              <Icon className="w-6 h-6 text-[#101828]" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex flex-col gap-1">
                <p className="text-[#101828] text-sm font-medium font-inter">{stat.title}</p>
                <h3 className="text-[22px] font-semibold text-[#101828] font-nunito tracking-[-0.44px]">
                  {stat.value.toLocaleString()}
                </h3>
              </div>
              <p className="text-[#667085] text-sm font-normal font-inter">This Month</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
