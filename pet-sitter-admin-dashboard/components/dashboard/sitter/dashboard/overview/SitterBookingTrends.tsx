"use client";

import { useGetSitterBookingTrendsQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Select, SelectItem, Skeleton } from "@nextui-org/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SitterBookingTrends() {
  const { status } = useSession();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const { data, isLoading } = useGetSitterBookingTrendsQuery(year, {
    skip: status === "loading",
  });

  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="w-full bg-white rounded-xl border border-[#eaecf0] shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-5 border-b border-[#eaecf0]">
        <div>
          <h2 className="text-lg font-semibold text-[#101828] font-inter">Booking Trends</h2>
          <p className="text-sm text-[#667085] font-inter">
            Monthly history of your total bookings
          </p>
        </div>
        <div className="w-32 mt-4 md:mt-0">
          <Select
            label="Year"
            size="sm"
            defaultSelectedKeys={[currentYear.toString()]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <SelectItem key={y.toString()} value={y.toString()}>
                {y.toString()}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="px-6 pb-6 pt-4">
        {isLoading ? (
          <Skeleton className="w-full h-[300px] rounded-xl" />
        ) : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.data?.data || []}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7176" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff7176" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#667085"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#667085"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f4f7" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#eaecf0]">
                          <p className="font-medium text-[#101828]">{payload[0].payload.month}</p>
                          <p className="text-[#ff7176] font-bold">
                            {payload[0].value} Bookings
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalBookings"
                  stroke="#ff7176"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
