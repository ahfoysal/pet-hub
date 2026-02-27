import React from "react";
import { DollarSign, Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FinanceStatsProps {
  data?: {
    releasedPayments: number;
    pendingPayout: number;
    totalCompletedOrders: number;
  };
  isLoading: boolean;
}

export default function FinanceStats({ data, isLoading }: FinanceStatsProps) {
  const stats = [
    {
      label: "Released Payments",
      value: `$${data?.releasedPayments ?? 0}`,
      description: "Total received amount",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Payout",
      value: `$${data?.pendingPayout ?? 0}`,
      description: "Awaiting release",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Completed",
      value: `${data?.totalCompletedOrders ?? 0}`,
      description: "Orders completed",
      icon: CheckCircle,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[132px] w-full rounded-[14px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white border border-[#e5e7eb] p-6 rounded-[14px] shadow-sm flex flex-col gap-2"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#0a0a0a]">{stat.value}</h3>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}
