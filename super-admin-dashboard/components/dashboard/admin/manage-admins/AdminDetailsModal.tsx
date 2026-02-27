"use client";

import React, { useState } from "react";
import { X, Copy, Check, RefreshCw } from "lucide-react";
import { AdminUser } from "@/types/dashboard/admin/manageAdmins/manageAdminsType";
import { useResetAdminPasswordMutation } from "@/redux/features/api/dashboard/admin/manageAdmins/manageAdminsApi";
import { toast } from "react-toastify";

interface AdminDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
}

const AdminDetailsModal = ({ isOpen, onClose, admin }: AdminDetailsModalProps) => {
  const [resetPassword, { isLoading: isResetting }] = useResetAdminPasswordMutation();
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !admin) return null;

  const handleResetPassword = async () => {
    try {
      const res = await resetPassword(admin.id).unwrap();
      if (res.success) {
        setTempPassword(res.data.temporaryPassword);
        toast.success("Password reset successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[34px] w-[560px] p-[32px] relative flex flex-col gap-[32px]">
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="font-nunito font-bold text-[32px] leading-[39px] text-[#282828]">
            Admin Details
          </h2>
          <button
            onClick={onClose}
            className="w-[42px] h-[42px] rounded-full bg-[#f2f4f8] flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-[#282828]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 font-inter text-[16px]">
          <div className="grid grid-cols-2 gap-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-[#314158] text-[12px] font-semibold uppercase tracking-[0.6px]">Full Name</span>
              <span className="text-[#1e293b] font-medium">{admin.fullName}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#314158] text-[12px] font-semibold uppercase tracking-[0.6px]">Account Status</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${admin.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`font-semibold ${admin.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                  {admin.status}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#314158] text-[12px] font-semibold uppercase tracking-[0.6px]">Email Address</span>
              <span className="text-[#1e293b] font-medium">{admin.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#314158] text-[12px] font-semibold uppercase tracking-[0.6px]">Access Level</span>
              <span className="text-[#1e293b] font-medium">
                {!admin.role || admin.role.toUpperCase() === "ADMIN" || admin.role.toUpperCase() === "SUPER_ADMIN" ? "Full Access" : "Limited Access"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#314158] text-[12px] font-semibold uppercase tracking-[0.6px]">Role</span>
              <span className="text-[#1e293b] font-medium">
                {!admin.role || admin.role.toUpperCase() === "ADMIN" || admin.role.toUpperCase() === "SUPER_ADMIN" ? "Super Administrator" : "Admin"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#314158] text-[12px] font-semibold uppercase tracking-[0.6px]">Joined Date</span>
              <span className="text-[#1e293b] font-medium">{formatDate(admin.createdAt)}</span>
            </div>
          </div>

          <hr className="border-[#e2e8f0] my-2" />

          {/* Actions */}
          <div className="flex flex-col gap-4">
             <h3 className="font-nunito text-[#282828] text-[20px] font-bold">Security Actions</h3>
             
             {tempPassword ? (
               <div className="bg-[#fff1f2] border border-[#fecaca] p-4 rounded-xl flex flex-col gap-2">
                 <p className="text-[#e11d48] text-[14px] font-medium">New Temporary Password:</p>
                 <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-[#e2e8f0]">
                   <code className="text-[#ff7176] font-bold text-[18px]">{tempPassword}</code>
                   <button 
                    onClick={() => copyToClipboard(tempPassword)}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                   >
                     {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-[#64748b]" />}
                   </button>
                 </div>
                 <p className="text-[#e11d48] text-[12px]">Please copy and share this password securely. It will disappear when you close this window.</p>
               </div>
             ) : (
               <button
                disabled={isResetting}
                onClick={handleResetPassword}
                className="flex items-center justify-center gap-2 bg-[#ff7176] hover:bg-[#ff5c62] text-white font-inter font-semibold py-3 px-4 rounded-xl transition-colors w-full"
               >
                 <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                 {isResetting ? "Resetting..." : "Reset Account Password"}
               </button>
             )}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full h-[54px] rounded-[12px] bg-[#282828] hover:bg-[#282828]/90 text-white font-inter font-semibold text-[18px]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminDetailsModal;
