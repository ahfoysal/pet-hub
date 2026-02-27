"use client";

import { useGetSitterRecentBookingsQuery } from "@/redux/features/api/dashboard/sitter/dashboard/sitterDashboardApi";
import { Skeleton } from "@nextui-org/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Pet {
  name: string;
  image?: string;
}

interface Booking {
  id: string;
  pets: Pet[];
  package?: { name: string };
  service?: { name: string };
  startingTime: string;
  grandTotal: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export default function SitterRecentBookings() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const { data, isLoading } = useGetSitterRecentBookingsQuery(undefined, {
    skip: sessionStatus === "loading"
  });
  const bookings: Booking[] = data?.data || [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full bg-white rounded-[8px] border border-[#eaecf0] shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-6 py-5 border-b border-[#eaecf0]">
        <div>
          <h2 className="text-[18px] font-medium text-[#101828] font-inter leading-[28px]">Recent Bookings</h2>
        </div>
      </div>
      
      <div className="overflow-x-auto text-inter">
        {!mounted || isLoading ? (
          <div className="p-6 flex flex-col gap-4">
             {[1,2,3].map(i => <Skeleton key={i} className="w-full h-16 rounded-lg" />)}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">Service Name</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#667085] font-inter">
                    No recent bookings found.
                  </td>
                </tr>
              ) : (
                bookings.slice(0, 5).map((booking) => (
                  <tr 
                    key={booking.id}
                    className="hover:bg-[#f9fafb] transition-colors h-[72px]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f2f4f7] overflow-hidden flex items-center justify-center shrink-0 relative">
                           {booking.pets?.[0]?.image ? (
                             <Image src={booking.pets[0].image} alt={booking.pets[0].name} fill className="object-cover" />
                           ) : (
                            <span className="font-semibold text-[#475467] text-sm">
                              {booking.pets?.[0]?.name?.[0]?.toUpperCase() || 'P'}
                            </span>
                           )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-[#101828] font-inter text-sm">
                             {booking.package ? booking.package.name : booking.service?.name || "Custom Setup"}
                          </span>
                          <span className="text-[#667085] text-sm font-inter uppercase">PRD-{booking.id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#667085] font-inter uppercase tracking-tight">
                         {booking.package ? "Package" : "Regular"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#101828] font-inter">
                      ${booking.grandTotal}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#667085] font-inter">
                       {format(new Date(booking.startingTime), "dd MMM, yyyy")} 
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium gap-1.5 ${
                        booking.status === 'COMPLETED' 
                          ? 'bg-[#ecfdf3] text-[#027a48]' 
                          : booking.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-[#fffaeb] text-[#b54708]'
                      }`}>
                        <div className={`size-1.5 rounded-full ${
                          booking.status === 'COMPLETED' ? 'bg-[#027a48]' : booking.status === 'CANCELLED' ? 'bg-red-500' : 'bg-[#f79009]'
                        }`} />
                        {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                         <button onClick={() => router.push(`/sitter/bookings/${booking.id}`)} className="p-2 border border-[#eaecf0] hover:bg-gray-50 rounded-lg text-[#667085] transition-colors" title="View Details">
                           <Eye className="size-5" />
                         </button>
                         <button className="p-2 border border-[#eaecf0] hover:bg-red-50 hover:text-red-600 rounded-lg text-[#667085] transition-colors" title="Delete">
                           <Trash2 className="size-5" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
