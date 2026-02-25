"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import { useSession } from "next-auth/react";
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: fullCode }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Verification failed");
      }

      sessionStorage.setItem("accessToken", result.data);

      // Show success toast
      showToast(result.message, "success");

      // Redirect to login page after successful verification
      router.push("/select-role");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8 ">
      <div>
        <Image src={petzyLogo} alt="Logo" />
      </div>
      <Link
        href="/select-role"
        className="text-sm text-primary hover:text-primary/90 mt-2"
      >
        &lt; Back to Role Selection
      </Link>
      <div className="flex flex-1 items-center justify-center ">
        <div className="max-w-xl px-24 w-full space-y-8 p-8 bg-card rounded-3xl border border-border">
          <div>
            <h2 className="mt-6 text-center text-2xl font-bold text-foreground">
              Verify Your Account
            </h2>
            <p className="text-center text-sm text-muted-foreground">
              We&apos;ve sent a verification code to your email.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex justify-center space-x-4">
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
                  className="w-12 h-12 text-center text-2xl font-bold bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?{" "}
                {canResend ? (
                  <a
                    href="#"
                    onClick={handleResend}
                    className="font-medium text-primary hover:text-primary/90"
                  >
                    Resend
                  </a>
                ) : (
                  `Resend in ${resendTimer}s`
                )}
              </p>
            </div>

            <div>
              <Button
                text={loading ? "Verifying..." : "Verify Account"}
                variant="primary"
                className="w-full"
                onClick={handleSubmit}
              />
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
