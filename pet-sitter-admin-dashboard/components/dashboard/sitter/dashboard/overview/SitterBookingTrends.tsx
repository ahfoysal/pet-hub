"use client";

import { useGetSitterBookingTrendsQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Card, CardBody, CardHeader, Select, SelectItem, Skeleton } from "@nextui-org/react";
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
    <Card shadow="sm" className="w-full bg-white dark:bg-default-50 border-none">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 pt-6">
        <div>
          <h2 className="text-xl font-bold text-default-900">Booking Trends</h2>
          <p className="text-sm text-default-500">
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
      </CardHeader>
      <CardBody className="px-6 pb-6 pt-4">
        {isLoading ? (
          <Skeleton className="w-full h-[300px] rounded-xl" />
        ) : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.data?.data || []}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-default-100 p-3 rounded-lg shadow-lg border border-default-200">
                          <p className="font-medium">{payload[0].payload.month}</p>
                          <p className="text-blue-500 font-bold">
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
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
