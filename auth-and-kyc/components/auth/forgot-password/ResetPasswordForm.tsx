// components/auth/forgot-password/ResetPasswordForm.tsx
// Figma Node: N/A — Auth infrastructure
// Purpose: Reset password form with OTP verification

"use client";

import { useResetPasswordMutation } from "@/redux/features/api/auth/authManagementApi";
import { Button } from "@nextui-org/react";
import { KeyRound, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}

const FIELDS: FormField[] = [
  { name: "email", type: "email", label: "Email Address", placeholder: "Confirm your email", icon: <Mail className="w-4 h-4 text-[#828282]" /> },
  { name: "code", type: "text", label: "Verification Code (OTP)", placeholder: "Enter the 4-6 digit code", icon: <KeyRound className="w-4 h-4 text-[#828282]" /> },
  { name: "newPassword", type: "password", label: "New Password", placeholder: "Enter new password", icon: <Lock className="w-4 h-4 text-[#828282]" /> },
  { name: "confirmPassword", type: "password", label: "Confirm Password", placeholder: "Repeat new password", icon: <Lock className="w-4 h-4 text-[#828282]" /> },
];

export default function ResetPasswordForm() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        code: String(formData.code),
        password: String(formData.newPassword),
      }).unwrap();

      toast.success("Password reset successful!");
      router.push("/");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === "object" && "data" in error
        ? (error as { data?: { message?: string } }).data?.message || "Failed to reset password"
        : "Failed to reset password";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-default-50 rounded-2xl shadow-sm border border-default-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-default-900 mb-2">
          Reset Password
        </h2>
        <p className="text-default-500 text-sm">
          Enter the OTP sent to your email and choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {FIELDS.map((field) => (
          <div key={field.name} className="relative pt-[15px]">
            <div className="absolute left-[14px] top-[5px] bg-white px-1 z-10">
              <span className="font-medium text-[#828282] text-[14px]">
                {field.label}
              </span>
            </div>
            <div className="relative h-[56px] w-full rounded-[12px] border border-[#e9e9e9] bg-[#f9fafc] flex items-center px-[16px] overflow-hidden transition-colors focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]">
              <span className="mr-3 flex-shrink-0">{field.icon}</span>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full h-full bg-transparent text-[#282828] text-[16px] placeholder:text-[#c3c3c3] focus:outline-none border-none ring-0 focus:ring-0 px-0"
                required
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
              />
            </div>
          </div>
        ))}

        <Button
          type="submit"
          color="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Update Password
        </Button>
      </form>
    </div>
  );
}
