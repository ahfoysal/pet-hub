"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateAdminMutation } from "@/redux/features/api/dashboard/admin/manageAdmins/manageAdminsApi";
import { toast } from "react-toastify";
import AdminSuccessModal from "@/components/dashboard/admin/manage-admins/AdminSuccessModal";

const AddNewAdmin = () => {
  const router = useRouter();
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    accessLevel: "FULL",
    passwordSetup: "AUTO",
    temporaryPassword: "",
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdAdminInfo, setCreatedAdminInfo] = useState({ email: "", fullName: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For now the API only supports fullName and email
      // We'll send these and let the backend ignore others if not supported yet
      const res = await createAdmin({ 
        fullName: formData.fullName, 
        email: formData.email 
      }).unwrap();
      
      if (res.success) {
        setCreatedAdminInfo({ 
          email: res.data?.email || formData.email, 
          fullName: formData.fullName 
        });
        setIsSuccessModalOpen(true);
      } else {
        toast.error(res.message || "Failed to create admin");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create admin");
    }
  };

  return (
    <div className="flex flex-col gap-[36px] w-[1116px] mx-auto min-h-screen pb-[100px] pt-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-start gap-3">
          <button 
            onClick={() => router.back()}
            className="mt-1 p-2 bg-white border border-[#e2e8f0] rounded-[10px] hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#282828]" />
          </button>
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-['Nunito'] font-semibold text-[30px] leading-[36px] text-[#282828] m-0">
              Add New Admin
            </h1>
            <p className="font-['Arimo'] font-normal text-[16px] leading-[24px] text-[#4a5565] m-0">
              Create a new administrator account with custom permissions
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[768px] mx-auto">
        <form onSubmit={handleSubmit} className="bg-white border border-[#e2e8f0] rounded-[14px] p-[32px] flex flex-col gap-[32px]">
          {/* Section 1: Personal Information */}
          <div className="flex flex-col gap-[24px]">
            <h2 className="text-[20px] font-['Inter'] font-semibold text-[#0f172b] leading-[28px]">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-2 gap-[24px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-['Inter'] font-medium text-[#314158] leading-[20px]">
                  Full Name <span className="text-[#fb2c36]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full h-[42px] px-[16px] py-[8px] bg-white border border-[#cad5e2] rounded-[10px] outline-none font-['Inter'] text-[16px] text-[#0a0a0a]"
                />
              </div>
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-['Inter'] font-medium text-[#314158] leading-[20px]">
                  Email Address <span className="text-[#fb2c36]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@petcare.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-[42px] px-[16px] py-[8px] bg-white border border-[#cad5e2] rounded-[10px] outline-none font-['Inter'] text-[16px] text-[#0a0a0a]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-['Inter'] font-medium text-[#314158] leading-[20px]">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 555-0100"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-[42px] px-[16px] py-[8px] bg-white border border-[#cad5e2] rounded-[10px] outline-none font-['Inter'] text-[16px] text-[#0a0a0a]"
              />
            </div>
          </div>

          <hr className="border-[#e2e8f0]" />

          {/* Section 2: Role & Access Level */}
          <div className="flex flex-col gap-[24px]">
            <h2 className="text-[20px] font-['Inter'] font-semibold text-[#0f172b] leading-[28px]">
              Role & Access Level
            </h2>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-['Inter'] font-medium text-[#314158] leading-[20px]">
                Role Selection <span className="text-[#fb2c36]">*</span>
              </label>
              <div className="relative border border-[#cad5e2] rounded-[10px] w-full flex items-center pr-4 bg-gray-50">
                <select 
                  name="role"
                  value="ADMIN"
                  disabled
                  className="appearance-none w-full h-[42px] bg-transparent outline-none font-['Inter'] text-[14px] text-[#282828] pl-[14px] cursor-not-allowed"
                >
                  <option value="ADMIN">Super Administrator</option>
                </select>
                <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[12px]">
              <label className="text-[14px] font-['Inter'] font-medium text-[#314158] leading-[20px]">
                Access Level <span className="text-[#fb2c36]">*</span>
              </label>
              
              <div className="flex flex-col gap-[12px]">
                {/* Option 1: Full Access Only */}
                <label className="flex items-start gap-3 p-4 border rounded-[10px] cursor-default bg-[#ff7176]/5 border-[#ff7176]">
                  <input
                    type="radio"
                    name="accessLevel"
                    value="FULL"
                    checked={true}
                    readOnly
                    className="mt-1 accent-[#ff7176]"
                  />
                  <div className="flex flex-col">
                    <span className="text-[16px] font-['Inter'] font-medium text-[#0f172b]">Full Access</span>
                    <span className="text-[14px] font-['Inter'] text-[#45556c]">Can access all system modules and manage providers, users, payments, and reports</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <hr className="border-[#e2e8f0]" />

          {/* Section 3: Password Setup */}
          <div className="flex flex-col gap-[24px]">
            <h2 className="text-[20px] font-['Inter'] font-semibold text-[#0f172b] leading-[28px]">
              Password Setup
            </h2>

            <div className="flex flex-col gap-[12px]">
              {/* Option 1 */}
              <label className={`flex items-start gap-3 p-4 border rounded-[10px] cursor-pointer transition-colors ${formData.passwordSetup === 'AUTO' ? 'bg-[#ff7176]/5 border-[#ff7176]' : 'border-[#e2e8f0] hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="passwordSetup"
                  value="AUTO"
                  checked={formData.passwordSetup === 'AUTO'}
                  onChange={handleChange}
                  className="mt-1 accent-[#ff7176]"
                />
                <div className="flex flex-col">
                  <span className="text-[16px] font-['Inter'] font-medium text-[#0f172b]">Auto-generate Password (Recommended)</span>
                  <span className="text-[14px] font-['Inter'] text-[#45556c]">System will generate a secure password and send it via email. Admin must reset on first login.</span>
                </div>
              </label>

              {/* Option 2 */}
              <label className={`flex items-start gap-3 p-4 border rounded-[10px] cursor-pointer transition-colors ${formData.passwordSetup === 'MANUAL' ? 'bg-[#ff7176]/5 border-[#ff7176]' : 'border-[#e2e8f0] hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="passwordSetup"
                  value="MANUAL"
                  checked={formData.passwordSetup === 'MANUAL'}
                  onChange={handleChange}
                  className="mt-1 accent-[#ff7176]"
                />
                <div className="flex flex-col">
                  <span className="text-[16px] font-['Inter'] font-medium text-[#0f172b]">Set Temporary Password</span>
                  <span className="text-[14px] font-['Inter'] text-[#45556c]">You set a temporary password that admin must change on first login</span>
                </div>
              </label>
            </div>

            {formData.passwordSetup === 'MANUAL' && (
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-['Inter'] font-medium text-[#314158] leading-[20px]">
                  Temporary Password <span className="text-[#fb2c36]">*</span>
                </label>
                <input
                  type="password"
                  name="temporaryPassword"
                  placeholder="Enter temporary password"
                  value={formData.temporaryPassword}
                  onChange={handleChange}
                  required={formData.passwordSetup === 'MANUAL'}
                  className="w-full h-[42px] px-[16px] py-[8px] bg-white border border-[#cad5e2] rounded-[10px] outline-none font-['Inter'] text-[16px] text-[#0a0a0a]"
                />
              </div>
            )}
          </div>

          <hr className="border-[#e2e8f0]" />

          <div className="flex items-center gap-[12px]">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#ff7176] hover:bg-[#ff5c62] text-white px-[24px] py-[12px] h-auto rounded-[10px] font-['Inter'] font-medium text-[16px] gap-2"
            >
              <Plus className="w-5 h-5" />
              {isLoading ? "Creating..." : "Create Admin Account"}
            </Button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-[#314158] font-['Inter'] font-medium text-[16px] px-6 py-3 hover:bg-gray-50 rounded-[10px] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <AdminSuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/admin/manage-admins");
        }}
        fullName={createdAdminInfo.fullName}
        email={createdAdminInfo.email}
      />
    </div>
  );
};

export default AddNewAdmin;
