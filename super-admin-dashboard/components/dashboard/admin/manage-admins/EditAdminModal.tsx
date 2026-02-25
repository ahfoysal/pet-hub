import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateAdminMutation } from "@/redux/features/api/dashboard/admin/manageAdmins/manageAdminsApi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { AdminUser } from "@/types/dashboard/admin/manageAdmins/manageAdminsType";

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
  onSuccess?: () => void;
}

const EditAdminModal = ({ isOpen, onClose, admin, onSuccess }: EditAdminModalProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();

  useEffect(() => {
    if (admin) {
      setFullName(admin.fullName);
      setEmail(admin.email);
    }
  }, [admin]);

  if (!isOpen || !admin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateAdmin({
        adminId: admin.id,
        fullName: fullName !== admin.fullName ? fullName : undefined,
        email: email !== admin.email ? email : undefined,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Admin updated successfully");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Failed to update admin");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update admin");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[34px] w-[660px] p-[32px] relative flex flex-col gap-[32px]">
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="font-['Montserrat:Bold'] font-bold text-[32px] leading-[39.01px] text-[#282828]">
            Edit Admin
          </h2>
          <button
            onClick={onClose}
            className="w-[42px] h-[42px] rounded-full bg-[#f2f4f8] flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-[#282828]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[10px]">
            <label className="font-['Arial:Regular'] text-[18px] leading-[26px] text-[#4f4f4f]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-[52px] px-6 bg-[#f2f4f8] rounded-[12px] font-['Arial:Regular'] text-[16px] text-[#282828] outline-none"
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="font-['Arial:Regular'] text-[18px] leading-[26px] text-[#4f4f4f]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] px-6 bg-[#f2f4f8] rounded-[12px] font-['Arial:Regular'] text-[16px] text-[#282828] outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || (fullName === admin.fullName && email === admin.email)}
            className="w-full h-[54px] rounded-[12px] bg-[#e50914] hover:bg-[#e50914]/90 text-white font-['Montserrat:SemiBold'] font-semibold text-[18px] mt-[12px]"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;
