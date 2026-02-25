import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { X } from "lucide-react";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any; // We'll replace this with a proper type later
  onTakeAction: () => void;
}

export default function ReportDetailsModal({ isOpen, onClose, report, onTakeAction }: ReportDetailsModalProps) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/50">
      <div className="bg-white rounded-[24px] w-[560px] p-[24px] shadow-[0px_4px_20px_0px_#0000000a] flex flex-col gap-[20px]">
        
        {/* Header */}
        <div className="flex justify-between items-center w-full relative">
          <h2 className="font-['Nunito',sans-serif] font-bold text-[24px] leading-[31.2px] text-[#0a0a0a] m-0">
            Report Details
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-[#555555]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[20px]">
          
          {/* Header Info */}
          <div className="flex gap-[20px]">
            <div className="flex-1 border border-[#e2e8f0] rounded-[16px] p-[16px] flex flex-col gap-[4px]">
              <span className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[20px] text-[#555555]">Report ID</span>
              <span className="font-['Arimo',sans-serif] font-bold text-[16px] leading-[24px] text-[#0a0a0a]">#{report.complainId || "12341"}</span>
            </div>
            <div className="flex-1 border border-[#e2e8f0] rounded-[16px] p-[16px] flex flex-col gap-[4px]">
              <span className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[20px] text-[#555555]">Date Submitted</span>
              <span className="font-['Arimo',sans-serif] font-bold text-[16px] leading-[24px] text-[#0a0a0a]">
                {report.createdAt ? format(new Date(report.createdAt), "MMM dd, yyyy") : "N/A"}
              </span>
            </div>
          </div>

          {/* Users Info */}
          <div className="border border-[#e2e8f0] rounded-[16px] p-[16px] flex flex-col gap-[16px]">
            
            {/* Reported By */}
            <div className="flex justify-between items-center w-full">
              <span className="font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#555555] shrink-0 w-[100px]">Reported By</span>
              <div className="flex items-center gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {report.reporter?.image ? (
                    <Image src={report.reporter.image} alt={report.reporter.fullName} width={32} height={32} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-[12px]">
                      {report.reporter?.fullName?.[0] || "?"}
                    </div>
                  )}
                </div>
                <span className="font-['Arimo',sans-serif] font-medium text-[16px] leading-[24px] text-[#0a0a0a]">
                  {report.reporter?.fullName || "Unknown User"}
                </span>
                <span className="px-[12px] py-[4px] rounded-[24px] bg-[#f1f5f9] font-['Nunito',sans-serif] font-medium text-[12px] leading-[15px] text-[#64748b]">
                  {report.reporter?.role || "Pet Owner"}
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#e2e8f0]" />

            {/* Reported Against */}
            <div className="flex justify-between items-center w-full">
              <span className="font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#555555] shrink-0 w-[120px]">Reported Against</span>
              <div className="flex items-center gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-[8px] overflow-hidden bg-gray-200 shrink-0">
                  {report.reportedAgainst?.image ? (
                    <Image src={report.reportedAgainst.image} alt={report.reportedAgainst.fullName} width={32} height={32} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-[12px]">
                      {report.reportedAgainst?.fullName?.[0] || "?"}
                    </div>
                  )}
                </div>
                <span className="font-['Arimo',sans-serif] font-medium text-[16px] leading-[24px] text-[#0a0a0a]">
                  {report.reportedAgainst?.fullName || "Unknown Sitter"}
                </span>
                <span className="px-[12px] py-[4px] rounded-[24px] bg-[#f1f5f9] font-['Nunito',sans-serif] font-medium text-[12px] leading-[15px] text-[#64748b]">
                  {report.reportedAgainst?.role || "Pet Sitter"}
                </span>
              </div>
            </div>

          </div>

          {/* Details */}
          <div className="border border-[#e2e8f0] rounded-[16px] p-[16px] flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[4px]">
              <span className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[20px] text-[#555555]">Subject</span>
              <span className="font-['Arimo',sans-serif] font-bold text-[16px] leading-[24px] text-[#0a0a0a]">
                {report.subject || "No Subject"}
              </span>
            </div>
            <div className="w-full h-[1px] bg-[#e2e8f0]" />
            <div className="flex flex-col gap-[4px]">
              <span className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[20px] text-[#555555]">Description</span>
              <p className="font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#0a0a0a] m-0">
                {report.description || "No description provided."}
              </p>
            </div>
            
            {/* Attachment - Only show if it exists */}
            {report.attachment && (
              <>
                <div className="w-full h-[1px] bg-[#e2e8f0]" />
                <div className="flex flex-col gap-[8px]">
                  <span className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[20px] text-[#555555]">Attachment</span>
                  <div className="flex items-center gap-[12px] p-[12px] border border-[#e2e8f0] rounded-[12px] bg-[#f8fafc]">
                    <div className="w-[40px] h-[40px] rounded-[8px] overflow-hidden bg-gray-200">
                      <Image src={report.attachment} alt="Attachment" width={40} height={40} className="object-cover" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-['Arimo',sans-serif] font-medium text-[14px] leading-[20px] text-[#0a0a0a] truncate w-[200px]">Screenshot.png</span>
                      <span className="font-['Arimo',sans-serif] font-normal text-[12px] leading-[18px] text-[#555555]">1.2 MB</span>
                    </div>
                    <button className="flex items-center justify-center w-[32px] h-[32px] bg-white border border-[#e2e8f0] rounded-[8px] hover:bg-gray-50 transition-colors">
                      <Image src="/assets/icons/document-download.svg" alt="Download" width={16} height={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-[16px] w-full mt-[10px]">
          <button 
            onClick={onClose}
            className="flex-1 h-[52px] border border-[#e2e8f0] rounded-[16px] font-['Nunito',sans-serif] font-bold text-[18px] leading-[24px] text-[#0a0a0a] hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {report.status !== "RESOLVED" && (
            <button 
              onClick={() => {
                onClose();
                onTakeAction();
              }}
              className="flex-1 h-[52px] bg-[#0a0a0a] rounded-[16px] font-['Nunito',sans-serif] font-bold text-[18px] leading-[24px] text-[#ffffff] hover:bg-gray-800 transition-colors"
            >
              Take Action
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
