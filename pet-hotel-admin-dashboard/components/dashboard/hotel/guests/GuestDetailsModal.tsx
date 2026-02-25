"use client";

import React from "react";
import Image from "next/image";
import { X, Users, PawPrint } from "lucide-react";
import { useGetHotelBookingByIdQuery } from "@/redux/features/api/dashboard/hotel/booking/hotelBookingApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { format, differenceInDays } from "date-fns";

interface GuestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
}

export default function GuestDetailsModal({
  isOpen,
  onClose,
  bookingId,
}: GuestDetailsModalProps) {
  const { data, isLoading, isError } = useGetHotelBookingByIdQuery(bookingId ?? "", {
    skip: !isOpen || !bookingId,
  });

  if (!isOpen || !bookingId) return null;

  const booking = data?.data;

  // Calculate duration
  const duration = booking 
    ? differenceInDays(new Date(booking.checkOutDate), new Date(booking.checkInDate))
    : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center font-arimo">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#f2f4f8] rounded-[20px] shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-[#e5e7eb]">
          <h2 className="text-[20px] font-bold text-[#0a0a0a]">Booking Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-[#667085]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
          ) : isError || !booking ? (
            <div className="py-20 text-center text-gray-500">Failed to load booking details</div>
          ) : (
            <>
              {/* Guest Information Card */}
              <div className="bg-white rounded-[14px] border border-[#e5e7eb] p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-[16px] font-bold text-[#0a0a0a]">Guest Information</h3>
                  <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                    booking.status === "CONFIRMED" || booking.status === "COMPLETED" || booking.status === "CHECKED_IN"
                      ? "bg-[#dcfce7] text-[#008236]"
                      : "bg-[#fff5e5] text-[#fe9a00]"
                  }`}>
                    {booking.status === "CONFIRMED" ? "Approved" : booking.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="space-y-1">
                    <p className="text-[14px] text-[#4a5565]">Name:</p>
                    <p className="text-[16px] font-normal text-[#0a0a0a]">{booking.user?.fullName || "Guest"}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[14px] text-[#4a5565]">Phone:</p>
                    <p className="text-[16px] font-normal text-[#0a0a0a]">{booking.user?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Room & Stay Details Card */}
              <div className="bg-white rounded-[14px] border border-[#e5e7eb] p-5 space-y-4 shadow-sm">
                <h3 className="text-[16px] font-bold text-[#0a0a0a]">Room & Stay Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-[#4a5565]">Room Type:</p>
                    <p className="text-[14px] font-normal text-[#0a0a0a] capitalize">
                        {booking.room?.category?.toLowerCase() || "Single"} Room
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-[#4a5565]">Capacity:</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[14px] text-[#0a0a0a]">
                        <Users size={14} className="text-[#667085]" />
                        <span>{booking.room?.humanCapacity || 1} Humans</span>
                      </div>
                      <div className="flex items-center gap-1 text-[14px] text-[#0a0a0a]">
                        <PawPrint size={14} className="text-[#667085]" />
                        <span>{booking.room?.petCapacity || 1} Pet</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-[#4a5565]">Check-in:</p>
                    <p className="text-[14px] font-normal text-[#0a0a0a]">
                        {format(new Date(booking.checkInDate), "d MMM yyyy")}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[14px] text-[#4a5565]">Duration:</p>
                    <p className="text-[14px] font-normal text-[#0a0a0a]">{duration} Nights</p>
                  </div>

                  <div className="pt-2 border-t border-[#f2f4f8] flex justify-between items-center">
                    <p className="text-[14px] text-[#4a5565]">Total Amount:</p>
                    <p className="text-[18px] font-bold text-[#ff7176]">${booking.totalPrice}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer Action */}
        <div className="px-6 py-4 bg-white border-t border-[#e5e7eb] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#ff7176] text-white rounded-[10px] font-medium hover:bg-[#ff7176]/90 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
