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
import { getRedirectPath, getRedirectProfilePath } from "@/lib/roleRoutes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetKycStatusQuery } from "@/redux/features/api/profile/kycSubmitApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  const { data: kycData } = useGetKycStatusQuery(undefined, {
    skip: status !== "authenticated",
  });

  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as ToastType,
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session User:", session?.user);

    if (status === "authenticated" && session?.user) {
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");
      
      // Better loop detection
      const isTopLevelLoop = searchParams.get("loop") === "1";
      const isCallbackLoop = callbackUrl?.includes("loop=1");
      const isLoop = isTopLevelLoop || isCallbackLoop;

      if (isLoop && session.user.role !== "ADMIN") {
        console.warn("Redirect loop detected. Stopping auto-redirect for non-admin.");
        return;
      }

      console.log("✅ LOGIN READY: Session is authenticated and valid.");

      const appendLoopParams = (url: string) => {
        if (url.includes("loop=1")) return url;
        return url.includes("?") ? `${url}&loop=1` : `${url}?loop=1`;
      };

      // 1. Specialized Bypass (Admin, Vendor, Hotel) - Auto-redirects to dashboard
      const isBypassRole = ["ADMIN", "VENDOR", "HOTEL", "PET_HOTEL"].includes(session.user.role || "");
      const isKycSubmitted = kycData?.data?.status === "PENDING" || kycData?.data?.status === "APPROVED";
      
      // Auto-bypass ONLY for Admins, OR for other roles IF they already submitted KYC
      const shouldAutoBypass = session.user.role === "ADMIN" || (isBypassRole && isKycSubmitted);

      if (shouldAutoBypass) {
        const dest = (callbackUrl && !callbackUrl.includes("/select-role") && callbackUrl !== "/") 
          ? callbackUrl 
          : getRedirectPath(session.user.role);
        
        const finalUrl = `/api/sync?callbackUrl=${encodeURIComponent(appendLoopParams(dest))}`;
        console.log(`🚀 ${session.user.role} REDIRECT: Auto-redirecting to dashboard panel...`);
        console.log("   Destination:", dest);
        console.log("   Sync URL:", finalUrl);
        
        window.location.href = finalUrl;
        return;
      }

      // 2. Handle explicit callbackUrl (often from other domains)
      if (
        callbackUrl &&
        callbackUrl !== "/select-role" &&
        callbackUrl !== "/"
      ) {
        try {
          // If it's a relative path or same origin, just go there locally
          if (callbackUrl.startsWith("/") || callbackUrl.startsWith(window.location.origin)) {
             console.log("Local callbackUrl detected, redirecting locally:", callbackUrl);
             router.push(appendLoopParams(callbackUrl));
             return;
          }
          
          // Otherwise, it's cross-domain, use sync
          console.log("Cross-domain callbackUrl detected, via sync:", callbackUrl);
          const redirectUrl = appendLoopParams(callbackUrl);
          window.location.href = `/api/sync?callbackUrl=${encodeURIComponent(redirectUrl)}`;
          return;
        } catch {
          console.error("Invalid callbackUrl:", callbackUrl);
        }
      }

      // 3. Default flow based on user state
      if (!session.user.role || session.user.role === "") {
        console.log("No role found. Redirecting to /select-role locally.");
        router.push(appendLoopParams("/select-role"));
        return;
      }

      const dest = session.user.isProfileCompleted
        ? getRedirectPath(session.user.role)
        : getRedirectProfilePath(session.user.role);

      console.log("Determined destination:", dest);

      // If dest is local (starts with /), push locally
      if (dest.startsWith("/")) {
        router.push(appendLoopParams(dest));
      } else {
        // Cross-domain redirect via sync
        window.location.href = `/api/sync?callbackUrl=${encodeURIComponent(appendLoopParams(dest))}`;
      }
    }
  }, [status, session, router]);

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const isLoopDetected = status === "authenticated" && (
    searchParams?.get("loop") === "1" || 
    searchParams?.get("callbackUrl")?.includes("loop=1")
  );

  if (status === "loading" || (status === "authenticated" && !isLoopDetected)) {
    return <LoadingSpinner />;
  }

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  const handleDashboardRedirect = () => {
    if (!session?.user) return;
    const searchParams = new URLSearchParams(window.location.search);
    const callbackUrl = searchParams.get("callbackUrl");
    const role = session.user.role || "";
    const isBypassRole = ["ADMIN", "VENDOR", "HOTEL", "PET_HOTEL"].includes(role);
    
    let dest = isBypassRole
      ? (callbackUrl && !callbackUrl.includes("/select-role") && callbackUrl !== "/" ? callbackUrl : getRedirectPath(role))
      : (session.user.isProfileCompleted ? getRedirectPath(role) : getRedirectProfilePath(role));
    
    // Safety check for sitter dashboard in loop mode
    if (role === "PET_SITTER" && dest.includes("sitter") && !dest.includes("loop=1")) {
       dest = dest.includes("?") ? `${dest}&loop=1` : `${dest}?loop=1`;
    }

    if (dest.startsWith("/") && !dest.startsWith("http")) {
       router.push(dest);
    } else {
       window.location.href = `/api/sync?callbackUrl=${encodeURIComponent(dest)}`;
    }
  };

  const handleKycRedirect = () => {
    if (kycData?.data?.status === "PENDING" || kycData?.data?.status === "APPROVED") {
      return; // Do nothing if already submitted or approved
    }
    router.push("/kyc-verification");
  };

  const showToast = (message: string, type: ToastType = "success") => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate inputs using Zod
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
      // status/session useEffect will handle redirection
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f2f4f8] flex items-start justify-center font-['Nunito',sans-serif] pt-[200px] pb-12">
      {/* Absolute Logo Top Left */}
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

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-[648px] bg-white/50 backdrop-blur-sm border-[3px] border-white px-8 py-10 sm:px-[112px] sm:py-[64px] rounded-[32px] shadow-[0_0_75px_0_rgba(255,113,118,0.15)] mx-4 z-20">
        <div className="flex flex-col gap-8 sm:gap-[48px] items-center text-center">
          {/* Header */}
          <div className="flex flex-col gap-[12px] items-center justify-center w-full">
            <h1 className="font-semibold text-[#0f0f0f] text-[28px] sm:text-[32px] leading-none">
              {status === "authenticated" ? "Already Signed In" : "Welcome back!"}
            </h1>
            <p className="font-medium text-[#282828] text-[16px] sm:text-[18px]">
              {status === "authenticated" 
                ? `You are logged in as ${session?.user?.name || session?.user?.email}`
                : "We missed you! please enter your details."}
            </p>
          </div>

          {status === "authenticated" ? (
            <div className="w-full flex flex-col gap-[32px] items-center">
               <div className="flex flex-col items-center gap-4">
                  {session?.user?.image && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#ff868a]">
                      <Image src={session.user.image} alt="User" fill className="object-cover" />
                    </div>
                  )}
                  <div className="text-center">
                     <p className="font-bold text-lg text-[#0f0f0f]">{session?.user?.name}</p>
                     <p className="text-[#828282]">{session?.user?.email}</p>
                     <p className="inline-block mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider border border-gray-200">
                        {session?.user?.role || "No Role Assigned"}
                     </p>
                  </div>
               </div>

               {isLoopDetected && (
                 <div className="w-full p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-sm">
                   <p className="font-semibold mb-1">Redirection Loop Detected</p>
                   <p>The dashboard is having trouble picking up your session. You can try to proceed manually using the button below.</p>
                 </div>
               )}

                <div className="w-full flex flex-col gap-4">
                  <button
                    onClick={handleDashboardRedirect}
                    className="w-full h-[56px] rounded-[12px] bg-[#ff868a] hover:bg-[#ff7176] transition-colors flex items-center justify-center text-white font-semibold text-[18px] focus:outline-none shadow-md"
                  >
                    Proceed to Dashboard
                  </button>
                  <button
                    onClick={handleKycRedirect}
                    disabled={kycData?.data?.status === "PENDING" || kycData?.data?.status === "APPROVED"}
                    className={`w-full h-[56px] rounded-[12px] flex items-center justify-center font-semibold text-[18px] focus:outline-none shadow-md transition-colors ${
                      kycData?.data?.status === "PENDING" 
                        ? "bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed" 
                        : kycData?.data?.status === "APPROVED"
                        ? "bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
                        : "bg-[#6653ff] hover:bg-[#5241e0] text-white"
                    }`}
                  >
                    {kycData?.data?.status === "PENDING" 
                      ? "KYC Verification Pending" 
                      : kycData?.data?.status === "APPROVED"
                      ? "KYC Verification Completed"
                      : "Complete KYC Verification"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full h-[56px] rounded-[12px] bg-white border border-[#e9e9e9] hover:bg-gray-50 transition-colors flex items-center justify-center text-[#828282] font-semibold text-[18px] focus:outline-none"
                  >
                    Sign Out / Switch Account
                  </button>
               </div>
            </div>
          ) : (
            <>
              {/* Form */}
              <form
                className="w-full flex flex-col gap-[40px]"
                onSubmit={handleSubmit}
              >
                {/* Inputs Container */}
                <div className="flex flex-col gap-[12px] w-full">
                  <div className="relative pt-[15px] pb-5">
                    {/* Floating Label / Background cut */}
                    <div className="absolute left-[14px] top-[5px] bg-white px-1 z-10 transition-all">
                      <span className="font-['Montserrat',sans-serif] font-medium text-[#828282] text-[15px] tracking-[-0.16px] bg-white">
                        Email
                      </span>
                    </div>
                    {/* Input Field Border Container */}
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

                    {/* Password Input */}
                    <div className="relative pt-[15px]">
                      <div className="absolute left-[14px] top-[5px] bg-white px-1 z-10 transition-all">
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

                    {/* Forgot Password Link */}
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
                  Don&apos;t Have an account ?{" "}
                </span>
                <Link
                  href="/register"
                  className="text-[#6653ff] text-[16px] font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
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
