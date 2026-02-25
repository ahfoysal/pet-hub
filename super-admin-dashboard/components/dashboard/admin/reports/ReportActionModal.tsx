import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ReportActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any; // We'll replace this with a proper type later
  onSubmit: (actionType: "WARN" | "SUSPEND", note: string) => void;
  isSubmitting: boolean;
}

export default function ReportActionModal({ isOpen, onClose, report, onSubmit, isSubmitting }: ReportActionModalProps) {
  const [actionType, setActionType] = useState<"WARN" | "SUSPEND">("WARN");
  const [note, setNote] = useState("");

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/50">
      <div className="bg-white rounded-[24px] w-[560px] p-[24px] shadow-[0px_4px_20px_0px_#0000000a] flex flex-col gap-[20px]">
        
        {/* Header */}
        <div className="flex justify-between items-center w-full relative">
          <h2 className="font-['Nunito',sans-serif] font-bold text-[24px] leading-[31.2px] text-[#0a0a0a] m-0">
            Take Action
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-[#555555]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[20px]">
          
          <p className="font-['Arimo',sans-serif] font-normal text-[16px] leading-[22.4px] text-[#555555] m-0">
            Select an action to take against <span className="font-bold text-[#0a0a0a]">{report.reportedAgainst?.fullName || "the user"}</span>. This action will be recorded and the user will be notified.
          </p>

          <div className="flex flex-col gap-[12px]">
            {/* Warning Option */}
            <label className={`flex items-start gap-[12px] p-[16px] border rounded-[16px] cursor-pointer transition-colors ${actionType === "WARN" ? "border-[#ff7176] bg-[#fff5f5]" : "border-[#e2e8f0] bg-white hover:bg-gray-50"}`}>
              <div className="relative flex items-center justify-center w-[20px] h-[20px] shrink-0 mt-[2px]">
                <input 
                  type="radio" 
                  name="actionType" 
                  value="WARN" 
                  checked={actionType === "WARN"} 
                  onChange={() => setActionType("WARN")}
                  className="peer appearance-none w-[20px] h-[20px] border-2 border-[#ff7176] rounded-full checked:bg-white transition-all cursor-pointer m-0"
                />
                <div className="absolute w-[10px] h-[10px] bg-[#ff7176] rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <div className="flex flex-col gap-[4px] -mt-[2px]">
                <span className="font-['Nunito',sans-serif] font-bold text-[18px] leading-[24px] text-[#0a0a0a]">Send Warning</span>
                <span className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[20px] text-[#555555]">
                  Issue a formal warning to the user. Their account will remain active.
                </span>
              </div>
            </label>

            {/* Suspend Option */}
            <label className={`flex items-start gap-[12px] p-[16px] border rounded-[16px] cursor-pointer transition-colors ${actionType === "SUSPEND" ? "border-[#ff7176] bg-[#fff5f5]" : "border-[#e2e8f0] bg-white hover:bg-gray-50"}`}>
              <div className="relative flex items-center justify-center w-[20px] h-[20px] shrink-0 mt-[2px]">
                <input 
                  type="radio" 
                  name="actionType" 
                  value="SUSPEND" 
                  checked={actionType === "SUSPEND"} 
                  onChange={() => setActionType("SUSPEND")}
                  className="peer appearance-none w-[20px] h-[20px] border-2 border-[#ff7176] rounded-full checked:bg-white transition-all cursor-pointer m-0"
                />
                <div className="absolute w-[10px] h-[10px] bg-[#ff7176] rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <div className="flex flex-col gap-[4px] -mt-[2px]">
                <span className="font-['Nunito',sans-serif] font-bold text-[18px] leading-[24px] text-[#0a0a0a]">Suspend Account</span>
                <span className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[20px] text-[#555555]">
                  Temporarily suspend the user's account. They will not be able to access the platform.
                </span>
              </div>
            </label>
          </div>

          <div className="flex flex-col gap-[8px]">
            <span className="font-['Arimo',sans-serif] font-medium text-[16px] leading-[20px] text-[#0a0a0a]">Admin Note (Internal)</span>
            <textarea
              className="w-full min-h-[120px] p-[16px] border border-[#e2e8f0] rounded-[16px] font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#0a0a0a] bg-[#f8fafc] placeholder:text-[#9ca3af] focus:ring-1 focus:ring-[#ff7176] outline-none resize-none"
              placeholder="Add details about this action..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-[16px] w-full mt-[10px]">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 h-[52px] border border-[#e2e8f0] rounded-[16px] font-['Nunito',sans-serif] font-bold text-[18px] leading-[24px] text-[#0a0a0a] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSubmit(actionType, note)}
            disabled={isSubmitting || !note.trim()}
            className="flex-1 h-[52px] bg-[#ff7176] rounded-[16px] font-['Nunito',sans-serif] font-bold text-[18px] leading-[24px] text-white hover:bg-[#ff5a60] transition-colors disabled:opacity-50 disabled:bg-[#fca5a5] flex justify-center items-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              "Confirm & Notify"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
