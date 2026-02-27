// app/page.tsx — Central SSO Login Page
// Figma Node: N/A — Infrastructure
// Purpose: The ONLY login entry point for all roles.
// Implements role-based redirect logic (console-only in Phase 1).

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Toast, { ToastType } from "@/components/ui/Toast";
import { z } from "zod";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import Link from "next/link";
import googleLogo from "@/public/auth/google.png";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// ─── Dashboard URL Map ─────────────────────────────────────
const DASHBOARD_URLS: Record<string, string> = {
  ADMIN: process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || "http://admin.lvh.me:3001",
  VENDOR: process.env.NEXT_PUBLIC_VENDOR_DASHBOARD_URL || "http://vendor.lvh.me:3003",
  PET_SITTER: process.env.NEXT_PUBLIC_SITTER_DASHBOARD_URL || "http://sitter.lvh.me:3004",
  PET_HOTEL: process.env.NEXT_PUBLIC_HOTEL_DASHBOARD_URL || "http://hotel.lvh.me:3002",
  PET_SCHOOL: process.env.NEXT_PUBLIC_SCHOOL_DASHBOARD_URL || "http://school.lvh.me:3005",
  PET_OWNER: process.env.NEXT_PUBLIC_OWNER_DASHBOARD_URL || "http://owner.lvh.me:3006",
};

// ─── Role → Dashboard path suffix ────────────────────────
const ROLE_PATHS: Record<string, string> = {
  ADMIN: "/admin",
  VENDOR: "/vendor",
  PET_SITTER: "/sitter",
  PET_HOTEL: "/hotel",
  PET_SCHOOL: "/school",
  PET_OWNER: "/owner",
};

// ─── Compute redirect destination ────────────────────────
interface RedirectDecision {
  destination: string;
  reason: string;
}

function computeRedirect(
  role: string | undefined,
  isProfileCompleted: boolean | undefined,
): RedirectDecision {
  // No role → select role page
  if (!role || role === "") {
    return {
      destination: "/select-role",
      reason: "No role assigned — need to select role first",
    };
  }

  const normalizedRole = role.toUpperCase();

  // ADMIN → straight to dashboard (no KYC)
  if (normalizedRole === "ADMIN") {
    const baseUrl = DASHBOARD_URLS["ADMIN"] || "";
    return {
      destination: `${baseUrl}${ROLE_PATHS["ADMIN"]}`,
      reason: "ADMIN role — skip KYC, direct to dashboard",
    };
  }

  // Non-admin roles: check profile/KYC status
  const baseUrl = DASHBOARD_URLS[normalizedRole] || "";
  const rolePath = ROLE_PATHS[normalizedRole] || "";

  if (!baseUrl) {
    return {
      destination: "/select-role",
      reason: `Unknown role ${normalizedRole} — no dashboard URL configured`,
    };
  }

  // Profile complete (KYC submitted) → go to dashboard
  if (isProfileCompleted) {
    return {
      destination: `${baseUrl}${rolePath}`,
      reason: `${normalizedRole} with completed profile — direct to dashboard`,
    };
  }

  // Profile NOT complete → also go to dashboard
  // Dashboard will show "Complete KYC" prompt that links back to /kyc-verification
  return {
    destination: `${baseUrl}${rolePath}`,
    reason: `${normalizedRole} with incomplete profile — dashboard will prompt for KYC`,
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as ToastType,
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  });

  // ─── Session-based redirect logic ──────────────────────
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const { role, isProfileCompleted } = session.user;
    const decision = computeRedirect(role, isProfileCompleted);

    console.log("═══════════════════════════════════════════════");
    console.log("✅ SSO SESSION ACTIVE — Redirect Decision");
    console.log(`   User:        ${session.user.email}`);
    console.log(`   Name:        ${session.user.name}`);
    console.log(`   Role:        ${role || "NONE"}`);
    console.log(`   Profile OK:  ${isProfileCompleted}`);
    console.log(`   Destination: ${decision.destination}`);
    console.log(`   Reason:      ${decision.reason}`);
    console.log("═══════════════════════════════════════════════");

    // PHASE 1: Actually redirect (cookie is shared, no sync needed)
    if (decision.destination.startsWith("http")) {
      // Cross-domain redirect (to a dashboard)
      window.location.href = decision.destination;
    } else {
      // Local redirect (to /select-role, /kyc-verification, etc.)
      router.push(decision.destination);
    }
  }, [status, session, router]);

  // Show loading while session is resolving or user is being redirected
  if (status === "loading" || status === "authenticated") {
    return <LoadingSpinner />;
  }

  // ─── Handlers ──────────────────────────────────────────
  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      loginSchema.parse({ email, password });
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
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      showToast("Signed in successfully!", "success");
      // useEffect will handle redirect once session updates
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full bg-[#f2f4f8] flex items-start justify-center font-['Nunito',sans-serif] pt-[200px] pb-12">
      {/* Logo */}
      <div className="absolute top-[72px] left-[66px] w-[91px] h-[38px] cursor-pointer z-10">
        <Link href="/">
          <Image
            src={petzyLogo}
            alt="Petzy Logo"
            fill
            className="object-contain"
          />
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-[648px] bg-white/50 backdrop-blur-sm border-[3px] border-white px-8 py-10 sm:px-[112px] sm:py-[64px] rounded-[32px] shadow-[0_0_75px_0_rgba(255,113,118,0.15)] mx-4 z-20">
        <div className="flex flex-col gap-8 sm:gap-[48px] items-center text-center">
          {/* Header */}
          <div className="flex flex-col gap-[12px] items-center justify-center w-full">
            <h1 className="font-semibold text-[#0f0f0f] text-[28px] sm:text-[32px] leading-none">
              Welcome back!
            </h1>
            <p className="font-medium text-[#282828] text-[16px] sm:text-[18px]">
              We missed you! please enter your details.
            </p>
          </div>

          {/* Form */}
          <form
            className="w-full flex flex-col gap-[40px]"
            onSubmit={handleSubmit}
          >
            {/* Inputs */}
            <div className="flex flex-col gap-[12px] w-full">
              {/* Email */}
              <div className="relative pt-[15px] pb-5">
                <div className="absolute left-[14px] top-[5px] bg-white px-1 z-10">
                  <span className="font-['Montserrat',sans-serif] font-medium text-[#828282] text-[15px] tracking-[-0.16px] bg-white">
                    Email
                  </span>
                </div>
                <div
                  className={`relative h-[56px] w-full rounded-[12px] border ${error && email ? "border-red-500" : "border-[#e9e9e9]"} bg-[#f9fafc] flex items-center px-[16px] overflow-hidden transition-colors focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]`}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className="w-full h-full bg-transparent text-[#282828] text-[16px] placeholder:text-[#c3c3c3] focus:outline-none outline-none border-none ring-0 focus:ring-0 px-0"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && email && (
                  <p className="text-[13px] text-red-500 mt-1 absolute bottom-0 left-2">
                    {error}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative pt-[15px]">
                <div className="absolute left-[14px] top-[5px] bg-white px-1 z-10">
                  <span className="font-['Montserrat',sans-serif] font-medium text-[#828282] text-[15px] tracking-[-0.16px] bg-white">
                    Password
                  </span>
                </div>
                <div
                  className={`relative h-[56px] w-full rounded-[12px] border ${error && password ? "border-red-500" : "border-[#e9e9e9]"} bg-[#f9fafc] flex items-center px-[16px] overflow-hidden transition-colors focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]`}
                >
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full h-full bg-transparent text-[#282828] text-[16px] placeholder:text-[#c3c3c3] focus:outline-none outline-none border-none ring-0 focus:ring-0 px-0"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && password && (
                  <p className="text-[13px] text-red-500 mt-1 absolute bottom-[-20px] left-2">
                    {error}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end w-full">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-[14px] sm:text-[16px] text-[#828282] hover:text-[#ff868a] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-[20px] w-full items-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-[12px] bg-[#ff868a] hover:bg-[#ff7176] transition-colors flex items-center justify-center text-white font-semibold text-[18px] focus:outline-none"
              >
                {loading ? "Signing In..." : "Sign in"}
              </button>

              <span className="font-semibold text-[18px] text-[#828282]">
                Or
              </span>

              <button
                type="button"
                onClick={() => signIn("google")}
                className="w-full h-[56px] rounded-[12px] bg-transparent border border-[#e9e9e9] hover:bg-white/50 transition-colors flex items-center justify-center gap-2 text-[#828282] font-semibold text-[18px] focus:outline-none"
              >
                <Image
                  src={googleLogo}
                  alt="Google"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                Sign in with Google
              </button>
            </div>
          </form>

          {/* Footer link */}
          <div className="w-full text-center">
            <span className="text-[#828282] text-[16px] font-semibold">
              Don&apos;t Have an account?{" "}
            </span>
            <Link
              href="/register"
              className="text-[#6653ff] text-[16px] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>
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
