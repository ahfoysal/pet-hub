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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summary.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="p-6 bg-white dark:bg-default-50 rounded-2xl border border-default-100 flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`p-4 rounded-xl ${stat.bgColor} ${stat.color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-default-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-default-900">
                {stat.value}
              </h3>
              {stat.subValue && (
                <p className="text-xs text-default-400 mt-1">{stat.subValue}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
