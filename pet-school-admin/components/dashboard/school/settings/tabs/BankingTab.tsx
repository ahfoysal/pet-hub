/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface BankingTabProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export default function BankingTab({ formData, onChange, onSave, isUpdating }: BankingTabProps) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[14px] p-[25px] shadow-sm animate-in fade-in duration-300">
      <div className="space-y-6">
        <h2 className="text-[20px] font-normal text-[#0a0a0a] font-arimo">Banking Information</h2>
        
        {/* Security Banner */}
        <div className="bg-[#fefce8] border border-[#fff085] rounded-[10px] p-4 flex items-center gap-3">
          <span className="text-[14px] leading-[20px] text-[#894b00] font-arimo">
            🔒 Your banking information is encrypted and secure. This is where payments will be transferred.
          </span>
        </div>

        {/* Banking Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[14px] text-[#0a0a0a] font-arimo">Bank Name</label>
            <input 
              name="bankName" 
              value={formData.bankName} 
              onChange={onChange}
              placeholder="First National Bank"
              className="w-full px-4 py-[8px] h-[42px] border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 font-arimo" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] text-[#0a0a0a] font-arimo">Account Holder Name</label>
            <input 
              name="accountHolderName" 
              value={formData.accountHolderName} 
              onChange={onChange}
              placeholder="Full Name / LLC Name"
              className="w-full px-4 py-[8px] h-[42px] border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 font-arimo" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[14px] text-[#0a0a0a] font-arimo">Account Number</label>
              <input 
                name="accountNumber" 
                value={formData.accountNumber} 
                onChange={onChange}
                placeholder="****1234"
                className="w-full px-4 py-[8px] h-[42px] border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 font-arimo" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[14px] text-[#0a0a0a] font-arimo">Routing Number</label>
              <input 
                name="routingNumber" 
                value={formData.routingNumber} 
                onChange={onChange}
                placeholder="****5678"
                className="w-full px-4 py-[8px] h-[42px] border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 font-arimo" 
              />
            </div>
          </div>
        </div>

        <button 
          onClick={onSave}
          disabled={isUpdating}
          className="w-[193px] h-[40px] bg-[#ff7176] text-white rounded-[10px] text-[16px] font-normal hover:bg-[#ff7176]/90 transition-all shadow-sm flex items-center justify-center gap-2 font-arimo"
        >
          {isUpdating && <Loader2 size={18} className="animate-spin" />}
          Update Banking Info
        </button>
      </div>
    </div>
  );
}
