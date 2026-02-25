"use client";

import { useGetSitterBookingRatioQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Skeleton } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function SitterBookingRatio() {
  const { status } = useSession();
  const { data, isLoading } = useGetSitterBookingRatioQuery(undefined, {
    skip: status === "loading"
  });
  
  // Custom colors for packages vs services
  const COLORS = ["#8b5cf6", "#10b981"];

  return (
    <div className="w-full bg-white rounded-xl border border-[#eaecf0] shadow-sm h-full flex flex-col">
      <div className="flex flex-col items-start px-6 py-5 border-b border-[#eaecf0]">
        <h2 className="text-lg font-semibold text-[#101828] font-inter">Booking Ratio</h2>
        <p className="text-sm text-[#667085] font-inter">Packages vs Services breakdown</p>
      </div>
      <div className="px-6 pb-6 flex-1 flex flex-col justify-center items-center">
        {isLoading ? (
          <Skeleton className="w-[200px] h-[200px] rounded-full mt-8" />
        ) : (
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.data || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="type"
                >
                  {(data?.data || []).map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} Bookings`, 'Total']}
                  contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)" }}
                />
                <Legend 
                   verticalAlign="bottom" 
                   height={36} 
                   iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
