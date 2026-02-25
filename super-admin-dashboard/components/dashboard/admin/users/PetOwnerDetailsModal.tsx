import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, X, CreditCard } from "lucide-react";

interface PetOwnerItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  totalBookings: number;
  reportsFiled: number;
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
  createdAt: string;
}

interface PetOwnerDetailsModalProps {
  user: PetOwnerItem;
  onClose: () => void;
}

export default function PetOwnerDetailsModal({ user, onClose }: PetOwnerDetailsModalProps) {
  const isSuspended = user.status === "SUSPENDED" || user.status === "BANNED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(196,196,196,0.8)]">
      {/* Node: 13210:9178 (Pet owner profile Action) */}
      <div className="bg-white flex flex-col gap-[40px] items-center justify-center p-[20px] rounded-[32px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.1)] relative w-[774px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[24px] top-[24px] p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-[14px] items-start w-full mt-4">
          <div className="flex gap-[14px] items-start w-full">
            {/* User Profile Card */}
            <div className="bg-white border-[1.108px] border-[rgba(0,0,0,0.1)] border-solid flex flex-col h-[210px] items-start p-[21.108px] rounded-[12px] w-[360px]">
              <div className="flex flex-col gap-[20px] items-start w-full">
                <div className="flex gap-[20px] items-center">
                  <div className="overflow-clip rounded-full size-[79.984px] bg-gray-200">
                    <img
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.fullName}&backgroundColor=f2f4f8`}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start w-[222px]">
                    <p className="font-['Nunito',sans-serif] font-semibold h-[23px] text-[#0a0a0a] text-[15px] tracking-[-0.3px] whitespace-pre-wrap">
                      {user.fullName}
                    </p>
                    <p className="font-['Nunito',sans-serif] font-normal leading-[1.2] text-[#4a5565] text-[14px] tracking-[-0.14px]">
                      @{user.fullName.toLowerCase().replace(/\s+/g, "")}
                      {user.id.slice(0, 4)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-[8px] h-[75.968px] items-start w-full">
                  <div className="flex gap-[6px] items-center">
                    <Mail className="w-[16px] h-[16px] text-[#4a5565]" />
                    <p className="font-['Nunito',sans-serif] font-normal leading-[1.2] text-[#4a5565] text-[14px] tracking-[-0.14px]">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <Phone className="w-[16px] h-[16px] text-[#4a5565]" />
                    <p className="font-['Nunito',sans-serif] font-normal leading-[1.2] text-[#4a5565] text-[14px] tracking-[-0.14px]">
                      {user.phone || "+1 (555) 123-4567"}
                    </p>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <MapPin className="w-[16px] h-[16px] text-[#4a5565]" />
                    <p className="font-['Nunito',sans-serif] font-normal leading-[1.2] text-[#4a5565] text-[14px] tracking-[-0.14px]">
                      San Francisco, CA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods Card */}
            <div className="bg-white border-[1.108px] border-[rgba(0,0,0,0.1)] border-solid flex flex-col gap-[8px] h-[210px] items-start justify-center p-[21.108px] rounded-[12px] w-[360px]">
              <div className="h-[32px] w-full flex items-center gap-2">
			  	<CreditCard className="w-[16px] h-[16px] text-[#0a0a0a]" />
                <p className="font-['Nunito',sans-serif] font-semibold text-[#0a0a0a] text-[15px] tracking-[-0.3px]">
                  Payment Methods
                </p>
              </div>
              <div className="bg-[#f9fafb] h-[64px] rounded-[10px] w-full flex gap-[19px] items-center px-[11.995px]">
                <div className="bg-[#155dfc] h-[23.99px] rounded-[4px] w-[39.983px] flex items-center justify-center">
                  <span className="font-['Nunito',sans-serif] font-bold text-[12px] text-white">
                    V
                  </span>
                </div>
                <p className="font-['Nunito',sans-serif] font-normal leading-[24px] text-[#0a0a0a] text-[16px]">
                  1234•••••••• 4242
                </p>
              </div>
              <div className="bg-[#f9fafb] h-[64px] rounded-[10px] w-full flex gap-[19px] items-center px-[11.995px]">
                <div className="bg-[#00a63e] h-[23.99px] rounded-[4px] w-[39.983px] flex items-center justify-center">
                  <span className="font-['Nunito',sans-serif] font-bold text-[12px] text-white">
                    MC
                  </span>
                </div>
                <p className="font-['Nunito',sans-serif] font-normal leading-[24px] text-[#0a0a0a] text-[16px]">
                  1234•••••••• 1324
                </p>
              </div>
            </div>
          </div>

          {/* My Pets Table Card */}
          <div className="bg-white border-[1.108px] border-[rgba(0,0,0,0.1)] border-solid flex flex-col items-start p-[20px] rounded-[12px] w-[734px] h-[142px]">
            <div className="flex flex-col gap-[12px] items-start w-full">
              <div className="flex h-[32px] items-center justify-between w-full">
                <p className="font-['Nunito',sans-serif] font-semibold text-[#0a0a0a] text-[18px] tracking-[-0.36px]">
                  My Pets
                </p>
              </div>
              <div className="flex gap-[12px] items-start w-full">
                <div className="bg-[#f9fafb] flex flex-1 gap-[11.995px] h-[72px] items-center px-[11.995px] rounded-[8px]">
                  <div className="rounded-[37170400px] size-[47.997px] bg-gray-200 overflow-clip">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=f2f4f8"
                      alt="Max"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col font-['Nunito',sans-serif] font-normal gap-[2px] items-start justify-center">
                    <p className="leading-[24px] text-[#282828] text-[16px]">
                      Max
                    </p>
                    <p className="leading-[20px] text-[#828282] text-[14px]">
                      Golden Retriever • 3 years
                    </p>
                  </div>
                </div>
                <div className="bg-[#f9fafb] flex flex-1 gap-[11.995px] h-[72px] items-center px-[11.995px] rounded-[8px]">
                  <div className="rounded-[37170400px] size-[47.997px] bg-gray-200 overflow-clip">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=f2f4f8"
                      alt="Luna"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col font-['Nunito',sans-serif] font-normal gap-[2px] items-start justify-center">
                    <p className="leading-[24px] text-[#282828] text-[16px]">
                      Luna
                    </p>
                    <p className="leading-[20px] text-[#828282] text-[14px]">
                      Persian Cat • 2 years
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={
            isSuspended
              ? "bg-[#ff7176] flex flex-col items-center px-[60px] py-[16px] rounded-[14px] hover:bg-[#ff5a60] transition-colors"
              : "bg-[#ffe2e5] border border-[#ffcdcd] flex flex-col items-center px-[60px] py-[16px] rounded-[14px] hover:bg-[#fed5d9] transition-colors"
          }
        >
          <div className="flex items-center justify-center w-full">
            <p
              className={
                isSuspended
                  ? "font-['Arimo',sans-serif] font-normal leading-[24px] text-[16px] text-center text-white"
                  : "font-['Arimo',sans-serif] font-normal leading-[24px] text-[16px] text-center text-[#ff4848]"
              }
            >
              {isSuspended ? "Resume" : "Suspend Account"}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
