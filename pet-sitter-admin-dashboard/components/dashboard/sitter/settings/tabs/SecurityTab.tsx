"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SecurityTab() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => setIsUpdating(false), 2000);
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[20px] p-10 shadow-sm animate-in fade-in duration-300">
      <h2 className="text-[20px] font-bold text-[#0a0a0a] mb-8">Security Settings</h2>
      
      {/* Update Password Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[14px] text-[#4a5565]">Current Password</label>
          <input 
            type="password"
            className="w-full px-4 py-3 border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50" 
            placeholder="••••••••"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[14px] text-[#4a5565]">New Password</label>
          <input 
            type="password"
            className="w-full px-4 py-3 border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50" 
            placeholder="••••••••"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[14px] text-[#4a5565]">Confirm New Password</label>
          <input 
            type="password"
            className="w-full px-4 py-3 border border-[#d1d5dc] rounded-[10px] text-[16px] text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50" 
            placeholder="••••••••"
          />
        </div>

        <button 
          onClick={handleUpdatePassword}
          disabled={isUpdating}
          className="px-[30px] py-[14px] bg-[#ff7176] text-white rounded-[10px] text-[16px] font-bold hover:bg-[#ff7176]/90 transition-all shadow-sm flex items-center gap-2"
        >
          {isUpdating && <Loader2 size={18} className="animate-spin" />}
          Update Password
        </button>
      </div>

      <div className="my-10 border-t border-[#f2f4f8]"></div>

      {/* 2FA Section */}
      <div className="space-y-6">
        <h2 className="text-[20px] font-bold text-[#0a0a0a]">Two-Factor Authentication</h2>
        
        <div className="flex items-center justify-between p-6 bg-[#f8f9fa] rounded-[16px] border border-[#e5e7eb]">
          <div className="space-y-1">
            <p className="text-[16px] font-bold text-[#0a0a0a]">Enable 2FA for additional security</p>
            <p className="text-[14px] text-[#667085]">Protect your account with an extra layer of security</p>
          </div>
          <button className="px-6 py-2 bg-[#ff7176] text-white rounded-[10px] font-bold text-[14px] hover:bg-[#ff7176]/90 transition-all shadow-sm">
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}
