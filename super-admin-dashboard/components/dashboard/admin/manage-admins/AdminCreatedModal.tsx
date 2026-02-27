import React, { useState } from "react";
import { X, Eye, EyeOff, Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";

interface AdminCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  password?: string;
}

const AdminCreatedModal = ({
  isOpen,
  onClose,
  email,
  password,
}: AdminCreatedModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[34px] w-[660px] p-[32px] relative flex flex-col items-center gap-[24px]">
        <button
          onClick={onClose}
          className="absolute top-[32px] right-[32px] w-[42px] h-[42px] rounded-full bg-[#f2f4f8] flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-[#282828]" />
        </button>

        {/* Success Icon */}
        <div className="w-[120px] h-[120px] rounded-full bg-[#e8f5e9] flex items-center justify-center mt-4">
          <Image
            src="/assets/8fd0809b0f758ec85f82f3a42e30f702f0467e50.svg" // Check icon
            alt="Success"
            width={60}
            height={60}
          />
        </div>

        <h2 className="font-['Montserrat:Bold'] font-bold text-[32px] leading-[39.01px] text-[#282828] mt-2">
          Admin Account Created!
        </h2>

        <p className="font-['Arial:Regular'] text-[18px] leading-[26px] text-center text-[#4f4f4f] max-w-[480px]">
          The new admin account has been successfully created. Please find the login credentials below. An email has also been sent to the user.
        </p>

        <div className="w-full flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="font-['Arial:Regular'] text-[16px] text-[#8e8e93]">
              Email Address
            </label>
            <div className="w-full h-[52px] px-6 bg-[#f2f4f8] rounded-[12px] flex items-center font-['Arial:Regular'] text-[18px] text-[#282828]">
              {email}
            </div>
          </div>

          {password && (
            <div className="flex flex-col gap-2">
              <label className="font-['Arial:Regular'] text-[16px] text-[#8e8e93]">
                Temporary Password
              </label>
              <div className="w-full h-[52px] pl-6 pr-4 bg-[#f2f4f8] rounded-[12px] flex items-center justify-between">
                <span className="font-['Arial:Regular'] text-[18px] text-[#282828] font-mono tracking-widest">
                  {showPassword ? password : "••••••••"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button
                    onClick={handleCopyPassword}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Copy Password"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={onClose}
          className="w-full h-[54px] rounded-[12px] bg-[#e50914] hover:bg-[#e50914]/90 text-white font-['Montserrat:SemiBold'] font-semibold text-[18px] mt-4"
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default AdminCreatedModal;
