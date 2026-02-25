import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useCreateAdminMutation } from "@/redux/features/api/dashboard/admin/manageAdmins/manageAdminsApi";
import { toast } from "react-toastify";
import AdminCreatedModal from "./AdminCreatedModal";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddAdminModal = ({ isOpen, onClose, onSuccess }: AddAdminModalProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const [createdAdminData, setCreatedAdminData] = useState<{
    email: string;
    temporaryPassword?: string;
  } | null>(null);

  if (!isOpen && !createdAdminData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createAdmin({ fullName, email }).unwrap();
      if (res.success) {
        toast.success(res.message || "Admin created successfully");
        setCreatedAdminData({
          email: res.data?.email || email,
          temporaryPassword: res.data?.temporaryPassword,
        });
        if (onSuccess) onSuccess();
        // Don't close immediately, wait for the user to see the success modal
      } else {
        toast.error(res.message || "Failed to create admin");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create admin");
    }
  };

  const handleCloseAll = () => {
    setCreatedAdminData(null);
    setFullName("");
    setEmail("");
    onClose();
  };

  if (createdAdminData) {
    return (
      <AdminCreatedModal
        isOpen={true}
        onClose={handleCloseAll}
        email={createdAdminData.email}
        password={createdAdminData.temporaryPassword || "Sent to email"}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[34px] w-[660px] p-[32px] relative flex flex-col gap-[32px]">
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="font-['Montserrat:Bold'] font-bold text-[32px] leading-[39.01px] text-[#282828]">
            Add New Admin
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
              Full Name <span className="text-[#e50914]">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full h-[52px] px-6 bg-[#f2f4f8] rounded-[12px] font-['Arial:Regular'] text-[16px] text-[#282828] outline-none"
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="font-['Arial:Regular'] text-[18px] leading-[26px] text-[#4f4f4f]">
              Email Address <span className="text-[#e50914]">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[52px] px-6 bg-[#f2f4f8] rounded-[12px] font-['Arial:Regular'] text-[16px] text-[#282828] outline-none"
            />
          </div>

          <p className="font-['Arial:Regular'] text-[16px] leading-[24px] text-[#8e8e93] mt-2">
            A temporary password will be generated and sent to this email address. The new admin will be required to change it upon first login.
          </p>

          <Button
            type="submit"
            disabled={isLoading || !fullName || !email}
            className="w-full h-[54px] rounded-[12px] bg-[#e50914] hover:bg-[#e50914]/90 text-white font-['Montserrat:SemiBold'] font-semibold text-[18px] mt-[12px]"
          >
            {isLoading ? "Creating..." : "Create Admin Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
