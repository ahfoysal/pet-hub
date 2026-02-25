import React, { useEffect } from "react";
import Image from "next/image";
import { X, Award, CalendarDays, DollarSign } from "lucide-react";

interface AdmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admission: {
    petName: string;
    ownerName: string;
    courseName: string;
    status: "Pending" | "Approved" | "Rejected";
    courseType: string;
    duration: string;
    price: string;
  } | null;
}

export default function AdmissionDetailsModal({
  isOpen,
  onClose,
  admission,
}: AdmissionDetailsModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !admission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#efefef] bg-opacity-80" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border border-[#f4f4f4] rounded-[34px] p-6 w-[530px] flex flex-col gap-6 shadow-xl z-10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Hero Image Area */}
        <div className="h-[326px] w-full rounded-[24px] overflow-hidden relative bg-gradient-to-br from-[#f3e8ff] to-[#e9d4ff]">
          {/* Replace with actual pet image when available */}
          <div className="absolute inset-0 flex items-center justify-center text-purple-800/20 font-bold text-4xl">
            Pet Image
          </div>
        </div>

        {/* Title and Status */}
        <div className="flex items-center justify-between w-full pr-10">
          <h2 className="text-[32px] font-bold text-[#101828] font-['Arial:Bold'] leading-[1.2]">
            {admission.petName} <span className="text-[20px] text-gray-500 font-normal">({admission.ownerName})</span>
          </h2>
          <div className={`px-3 py-1 rounded-full text-[12px] font-['Arial:Regular'] ${
            admission.status === 'Approved' ? 'bg-[#dcfce7] text-[#00a63e]' :
            admission.status === 'Rejected' ? 'bg-[#ffe2e3] text-[#c10007]' :
            'bg-[#ffdecd] text-[#ff6900]'
          }`}>
            {admission.status}
          </div>
        </div>

        {/* Course Details Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-[20px] font-bold text-[#101828] font-['Arial:Bold']">
              Course
            </h3>
            <p className="text-[16px] text-[#4a5565] font-['Arial:Regular']">
              {admission.courseName}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-[16px] h-[16px] text-[#4a5565]" />
              <span className="text-[14px] text-[#4a5565] font-['Arial:Regular']">{admission.courseType}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarDays className="w-[16px] h-[16px] text-[#4a5565]" />
              <span className="text-[14px] text-[#4a5565] font-['Arial:Regular']">{admission.duration}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="w-[16px] h-[16px] text-[#101828]" />
              <span className="text-[14px] font-bold text-[#101828] font-['Arial:Bold']">{admission.price}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons for Pending Status */}
        {admission.status === 'Pending' && (
          <div className="flex gap-6 mt-2">
            <button 
              className="flex-1 h-[48px] bg-[#f8f2f2] text-[#282828] text-[16px] font-['Arial:Regular'] rounded-[10px] hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
            <button 
              className="flex-1 h-[48px] bg-[#ff7176] text-white text-[16px] font-['Arial:Regular'] rounded-[10px] hover:bg-[#ff5c62] transition-colors"
            >
              Approve
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
