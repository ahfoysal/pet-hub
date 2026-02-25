"use client";

import { useGetSitterRecentBookingsQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Card, CardBody, CardHeader, Skeleton, User } from "@nextui-org/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SitterRecentBookings() {
  const router = useRouter();
  const { status } = useSession();
  const { data, isLoading } = useGetSitterRecentBookingsQuery(undefined, {
    skip: status === "loading"
  });
  const bookings = data?.data || [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card shadow="sm" className="w-full h-full bg-white dark:bg-default-50 border-none">
      <CardHeader className="flex justify-between items-center px-6 pt-6">
        <div>
          <h2 className="text-xl font-bold text-default-900">Recent Bookings</h2>
          <p className="text-sm text-default-500">Your latest booking activity</p>
        </div>
        <button
          onClick={() => router.push('/sitter/bookings')}
          className="text-primary-500 bg-primary-50 p-2 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardBody className="px-6 pb-6 pt-2">
        {!mounted || isLoading ? (
          <div className="flex flex-col gap-4 mt-4">
             {[1,2,3].map(i => <Skeleton key={i} className="w-full h-16 rounded-xl" />)}
          </div>
        ) : bookings.length === 0 ? (
           <div className="text-center text-default-500 py-8">No recent bookings found.</div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {bookings.slice(0, 5).map((booking: any) => (
              <div 
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-xl border border-default-100 bg-default-50/50 hover:bg-default-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      {booking.pets?.[0]?.name?.[0]?.toUpperCase() || 'P'}
                   </div>
                   <div>
                     <p className="font-semibold text-default-900 line-clamp-1">
                        {booking.package ? booking.package.name : booking.service?.name || "Custom Setup"}
                     </p>
                     <p className="text-xs text-default-500">
                        {format(new Date(booking.startingTime), "MMM dd, hh:mm a")} 
                     </p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-bold text-default-900">${booking.grandTotal}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
