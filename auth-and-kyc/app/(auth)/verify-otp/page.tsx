"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import { useSession, signIn } from "next-auth/react";
import AlreadyLoggedIn from "@/components/auth/AlreadyLoggedIn";

export default function VerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(58);
  const [canResend, setCanResend] = useState(false);

  const verifySchema = z.object({
    code: z.string().length(6, "Verification code must be 6 digits"),
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialCanResendSet = useRef(false);
  const { data: session, status } = useSession();
  const [authFlow, setAuthFlow] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthFlow(localStorage.getItem("auth_flow"));
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(
        () => setResendTimer((prev) => prev - 1),
        1000,
      );

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [resendTimer]);

  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
    } else {
      setCanResend(false);
    }
  }, [resendTimer]);

  // Reset the flag when timer is reset
  useEffect(() => {
    if (resendTimer > 0) {
      initialCanResendSet.current = false;
    }
  }, [resendTimer]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success",
  ) => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast({
      ...toast,
      isVisible: false,
    });
  };

  // Redirect if already authenticated
  if (session) {
    return <AlreadyLoggedIn session={session} />;
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1 || isNaN(Number(value))) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("Text").trim();
    if (pasted.length !== 6 || isNaN(Number(pasted))) return;
    setCode(pasted.split(""));
    inputRefs.current[5]?.focus();
  };

  const handleResend = async () => {
    if (!canResend) return;

    setResendLoading(true);

    try {
      // Assuming you have an email from somewhere, perhaps from localStorage or a previous step
      // Here we'll use a placeholder email - in a real app, this should come from context
      const email =
        localStorage.getItem("verification_email") || "user@example.com";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to resend verification code");
      }

      setResendTimer(58);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      showToast(data?.message || "Verification code resent!", "success");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to resend verification code";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fullCode = code.join("");

    // Validate inputs using Zod
    try {
      verifySchema.parse({ code: fullCode });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const firstError = validationError.issues[0];
        setError(firstError?.message || "Validation error");
        showToast(firstError?.message || "Validation error", "error");
        setLoading(false);
        return;
      }
    }

    try {
      const signInResult = await signIn("credentials", {
        code: fullCode,
        redirect: false,
      });

      if (signInResult?.ok) {
        showToast("Verification successful!", "success");
        // Force a page turn to the index so proxy.ts and page.tsx's useEffect can route user
        window.location.href = "/";
      } else {
        const errMsg = signInResult?.error !== "CredentialsSignin" && signInResult?.error 
          ? signInResult.error 
          : "Invalid verification code.";
          
        setError(errMsg);
        showToast(errMsg, "error");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = authFlow === "login";

  return (
    <div className="relative min-h-screen w-full bg-[#f2f4f8] flex items-start justify-center font-['Nunito',sans-serif] pt-[180px] pb-12">
      {/* Absolute Logo Top Left */}
      <div className="absolute top-[72px] left-[66px] w-[91px] h-[38px] cursor-pointer z-10 hidden sm:block">
        <Image src={petzyLogo} alt="Petzy Logo" fill className="object-contain" />
      </div>

      <div className="absolute top-[134px] left-[60px] cursor-pointer z-10 hidden sm:flex items-center gap-2">
        <Link href="/" className="font-semibold text-[#828282] text-[16px] hover:text-[#ff868a] transition-colors flex items-center gap-2">
          &lt; Back to login
        </Link>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-[648px] bg-white/50 backdrop-blur-sm border-[3px] border-white px-8 py-10 sm:px-[112px] sm:py-[64px] rounded-[32px] shadow-[0_0_75px_0_rgba(255,113,118,0.15)] mx-4 z-20 my-auto">
        
        <div className="flex flex-col gap-8 sm:gap-[40px] items-center text-center">
          
          {/* Header */}
          <div className="flex flex-col gap-[12px] items-center justify-center w-full">
            <h1 className="font-semibold text-[#0f0f0f] text-[28px] sm:text-[32px] leading-tight">
              Verify Your Account
            </h1>
            <p className="font-normal text-[#282828] text-[16px] sm:text-[18px]">
              We&apos;ve sent a verification code to{" "}
              <span className="font-semibold">
                {typeof window !== "undefined" ? localStorage.getItem("verification_email") || "your email" : "your email"}
              </span>
            </p>
          </div>

          {/* Form */}
          <form className="w-full flex flex-col gap-[32px] sm:gap-[40px]" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200 w-full text-left">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* OTP Boxes */}
            <div className="flex justify-center gap-[8px] sm:gap-[16px]">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-[45px] h-[45px] sm:w-[56px] sm:h-[56px] text-center text-[24px] font-semibold bg-[#f9fafc] border border-[#e9e9e9] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#ff868a] focus:border-transparent transition-all"
                />
              ))}
            </div>

            {/* Resend Logic */}
            <div className="text-center w-full">
              <p className="text-[14px] text-[#828282]">
                Didn&apos;t receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="font-semibold text-[#828282] hover:text-[#ff868a] transition-colors"
                  >
                    Resend
                  </button>
                ) : (
                  <span className="font-semibold text-[#828282]">Resend in {resendTimer}s</span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col w-full items-start">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-[12px] bg-[#ff868a] hover:bg-[#ff7176] transition-colors flex items-center justify-center text-white font-semibold text-[18px] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
              >
                {loading 
                  ? (isLogin ? "Signing In..." : "Verifying...") 
                  : (isLogin ? "Sign In" : "Create Account")}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
