"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface AdminSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  email: string;
}

const AdminSuccessModal = ({
  isOpen,
  onClose,
  fullName,
  email,
}: AdminSuccessModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] w-[463px] p-[40px] relative flex flex-col items-center gap-[30px] shadow-lg border border-[#b8b8b8]/30">
        
        {/* Success Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-[87px] h-[68px] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M36.422 7.29297H7.27952C5.26766 7.29297 3.63672 8.92391 3.63672 10.9358V32.7926C3.63672 34.8045 5.26766 36.4354 7.27952 36.4354H36.422C38.4338 36.4354 40.0648 34.8045 40.0648 32.7926V10.9358C40.0648 8.92391 38.4338 7.29297 36.422 7.29297Z" stroke="#FF7176" strokeWidth="3.64281" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40.0648 12.7559L23.7268 23.1379C23.1645 23.4902 22.5143 23.677 21.8507 23.677C21.1872 23.677 20.537 23.4902 19.9747 23.1379L3.63672 12.7559" stroke="#FF7176" strokeWidth="3.64281" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="font-['Inter'] font-bold text-[22px] leading-[38px] text-[#ff7176] text-center">
            Admin Account Created!
          </h2>
        </div>

        <div className="flex flex-col gap-1 text-center font-['Nunito'] text-[14px] leading-[22px] text-[#45556c]">
          <p>
            Admin account for <span className="font-semibold text-[#0f172b]">{fullName}</span> has been successfully created.
          </p>
          <p>
            Login credentials have been sent to <span className="font-semibold text-[#0f172b]">{email}</span>
          </p>
        </div>

        <div className="flex items-center gap-[32px] w-full">
          <Button
            onClick={() => {
              onClose();
              router.push("/admin/manage-admins");
            }}
            className="flex-1 h-[48px] rounded-[7px] bg-[#ff7176] hover:bg-[#ff5c62] text-white font-['Nunito'] font-medium text-[14px]"
          >
            View All Admins
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-[48px] rounded-[7px] border-[#ff7176] text-[#ff7176] hover:bg-[#ff7176]/5 font-['Nunito'] font-medium text-[14px]"
          >
            Add Another
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSuccessModal;
