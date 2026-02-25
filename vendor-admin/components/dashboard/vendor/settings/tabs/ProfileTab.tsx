/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ProfileTabProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  isUpdating: boolean;
}

export default function ProfileTab({ formData, onChange, onSave, isUpdating }: ProfileTabProps) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[20px] p-10 shadow-sm animate-in fade-in duration-300">
      <h2 className="text-[20px] font-bold text-[#0a0a0a] mb-8">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <label className="text-[14px] text-[#4a5565]">Owner Name</label>
          <input 
            name="fullName" 
            value={formData.fullName} 
            onChange={onChange} 
            className="w-full px-4 py-3 border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[14px] text-[#4a5565]">Email</label>
          <input 
            name="email" 
            value={formData.email} 
            readOnly 
            className="w-full px-4 py-3 border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a]/60 bg-gray-50 outline-none" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[14px] text-[#4a5565]">Contact Number</label>
          <input 
            name="phone" 
            value={formData.phone} 
            onChange={onChange} 
            className="w-full px-4 py-3 border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[14px] text-[#4a5565]">Years of Experience</label>
          <input 
            name="yearsOfExperience" 
            type="number"
            value={formData.yearsOfExperience} 
            onChange={onChange} 
            className="w-full px-4 py-3 border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50" 
          />
        </div>
        <div className="md:col-span-2 pt-4">
          <button 
            onClick={onSave}
            disabled={isUpdating}
            className="px-[30px] py-[14px] bg-[#ff7176] text-white rounded-[10px] text-[16px] font-bold hover:bg-[#ff7176]/90 transition-all shadow-sm flex items-center gap-2"
          >
            {isUpdating && <Loader2 size={18} className="animate-spin" />}
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
