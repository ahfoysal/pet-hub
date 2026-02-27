"use client";

import { useForgotPasswordMutation } from "@/redux/features/api/auth/authManagementApi";
import { Button } from "@nextui-org/react";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to process request");
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-default-50 rounded-2xl shadow-sm border border-default-100 text-center">
        <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-default-900 mb-2">
          Check your email
        </h2>
        <p className="text-default-500 mb-6">
          We have sent a verification code (OTP) to <strong>{email}</strong>. Use it on the next page to reset your password.
        </p>
        <div className="flex flex-col gap-3">
          <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
            <Button color="primary" className="w-full">
              Enter OTP &amp; Reset Password
            </Button>
          </Link>
          <Link href="/">
            <Button color="primary" variant="flat" className="w-full">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-default-50 rounded-2xl shadow-sm border border-default-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-default-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-default-500 text-sm">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative pt-[15px]">
          <div className="absolute left-[14px] top-[5px] bg-white px-1 z-10">
            <span className="font-medium text-[#828282] text-[14px]">
              Email Address
            </span>
          </div>
          <div className="relative h-[56px] w-full rounded-[12px] border border-[#e9e9e9] bg-[#f9fafc] flex items-center px-[16px] overflow-hidden transition-colors focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]">
            <Mail className="w-4 h-4 text-[#828282] mr-3 flex-shrink-0" />
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full h-full bg-transparent text-[#282828] text-[16px] placeholder:text-[#c3c3c3] focus:outline-none border-none ring-0 focus:ring-0 px-0"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          color="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
