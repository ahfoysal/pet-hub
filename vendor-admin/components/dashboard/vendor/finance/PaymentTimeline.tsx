import React from "react";
import { Check, Clock, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentTimelineProps {
  data?: any[];
  isLoading: boolean;
}

export default function PaymentTimeline({ data, isLoading }: PaymentTimelineProps) {
  if (isLoading) {
    return <Skeleton className="h-[322px] w-full rounded-[14px]" />;
  }

  const steps = data || [
    {
      id: 1,
      title: "Order Completed",
      description: "Product delivered and received by customer",
      status: "COMPLETED",
      icon: Check,
      color: "bg-green-100 text-green-600",
    },
    {
      id: 2,
      title: "Super Admin Review",
      description: "Admin verifies order fulfillment and period for returns",
      status: "IN_PROGRESS",
      icon: ShieldCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 3,
      title: "Payment Released",
      description: "Funds transferred to your vendor wallet",
      status: "PENDING",
      icon: Clock,
      color: "bg-gray-100 text-gray-400",
    },
  ];

  return (
    <div className="bg-white border border-[#e5e7eb] p-6 rounded-[14px] shadow-sm">
      <h2 className="text-xl font-semibold text-[#0a0a0a] mb-6">Payment Timeline</h2>
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4 relative">
            {/* Connector Line */}
            {idx !== steps.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-10 bg-gray-100"></div>
            )}
            
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-sm ${step.color || "bg-gray-100 text-gray-400"}`}>
              {idx + 1}
            </div>
            
            <div className="flex flex-col gap-1 pb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0a0a0a]">{step.title}</h3>
                {step.status === "COMPLETED" && <Check className="h-4 w-4 text-green-600" />}
              </div>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
