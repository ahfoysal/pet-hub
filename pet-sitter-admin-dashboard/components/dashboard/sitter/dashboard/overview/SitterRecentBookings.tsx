"use client";

import { useGetSitterRecentBookingsQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Skeleton } from "@nextui-org/react";
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
    <div className="w-full bg-white rounded-xl border border-[#eaecf0] shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-6 py-5 border-b border-[#eaecf0]">
        <div>
          <h2 className="text-lg font-semibold text-[#101828] font-inter">Recent Bookings</h2>
          <p className="text-sm text-[#667085] font-inter">Your latest booking activity</p>
        </div>
        <button
          onClick={() => router.push('/sitter/bookings')}
          className="text-[#667085] hover:text-[#101828] transition-colors p-2"
        >
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        {!mounted || isLoading ? (
          <div className="p-6 flex flex-col gap-4">
             {[1,2,3].map(i => <Skeleton key={i} className="w-full h-16 rounded-lg" />)}
          </div>
        ) : bookings.length === 0 ? (
           <div className="text-center text-[#667085] py-12 font-inter">No recent bookings found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                <th className="px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider font-inter">Service/Package</th>
                <th className="px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider font-inter">Date & Time</th>
                <th className="px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider font-inter text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {bookings.slice(0, 5).map((booking: any) => (
                <tr 
                  key={booking.id}
                  className="hover:bg-[#f9fafb] transition-colors h-[72px]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f2f4f7] text-[#475467] flex items-center justify-center font-semibold text-sm">
                        {booking.pets?.[0]?.name?.[0]?.toUpperCase() || 'P'}
                      </div>
                      <span className="font-medium text-[#101828] font-inter text-sm">
                         {booking.package ? booking.package.name : booking.service?.name || "Custom Setup"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#667085] font-inter">
                       {format(new Date(booking.startingTime), "MMM dd, hh:mm a")} 
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-[#101828] font-inter text-sm">${booking.grandTotal}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
