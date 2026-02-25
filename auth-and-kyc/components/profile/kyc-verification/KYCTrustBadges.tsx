"use client";

import { Shield, Lock, CheckCircle } from "lucide-react";

export default function KYCTrustBadges() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-[10px] bg-[#dbeafe] flex items-center justify-center">
          <Shield size={20} className="text-blue-600" />
        </div>
        <div>
          <p className="text-[14px] font-normal text-[#101828]">Secure Verification</p>
          <p className="text-[12px] text-[#6a7282]">Bank-level encryption</p>
        </div>
      </div>
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-[10px] bg-[#dcfce7] flex items-center justify-center">
          <Lock size={20} className="text-green-600" />
        </div>
        <div>
          <p className="text-[14px] font-normal text-[#101828]">Data Protected</p>
          <p className="text-[12px] text-[#6a7282]">Privacy guaranteed</p>
        </div>
      </div>
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-[10px] bg-[#f3e8ff] flex items-center justify-center">
          <CheckCircle size={20} className="text-purple-600" />
        </div>
        <div>
          <p className="text-[14px] font-normal text-[#101828]">Fast Approval</p>
          <p className="text-[12px] text-[#6a7282]">2-3 business days</p>
        </div>
      </div>
    </div>
  );
}
