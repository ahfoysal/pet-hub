"use client";

import { useResetPasswordMutation } from "@/redux/features/api/auth/authManagementApi";
import { Button, Input } from "@nextui-org/react";
import { KeyRound, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword,
      }).unwrap();

      toast.success("Password reset successful!");
      router.push("/login"); // Immediately redirect to let them log in
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
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
        <Input
          name="email"
          type="email"
          label="Email Address"
          placeholder="Confirm your email"
          variant="bordered"
          value={formData.email}
          onChange={handleChange}
          startContent={<Mail className="w-4 h-4 text-default-400" />}
          isRequired
        />
        <Input
          name="code"
          type="text"
          label="Verification Code (OTP)"
          placeholder="Enter the 4-6 digit code"
          variant="bordered"
          value={formData.code}
          onChange={handleChange}
          startContent={<KeyRound className="w-4 h-4 text-default-400" />}
          isRequired
        />
        <Input
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter new password"
          variant="bordered"
          value={formData.newPassword}
          onChange={handleChange}
          startContent={<Lock className="w-4 h-4 text-default-400" />}
          isRequired
        />
        <Input
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Repeat new password"
          variant="bordered"
          value={formData.confirmPassword}
          onChange={handleChange}
          startContent={<Lock className="w-4 h-4 text-default-400" />}
          isRequired
        />

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
