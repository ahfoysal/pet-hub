"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import { Button } from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useSession } from "next-auth/react";
import AlreadyLoggedIn from "@/components/auth/AlreadyLoggedIn";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import { z } from "zod";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data: session } = useSession();
  const [phone, setPhone] = useState<string | undefined>();

  // State for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation error states
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // Validation schema
  const registerSchema = z
    .object({
      fullName: z.string().min(1, "Full name is required"),
      email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z
        .string()
        .min(6, "Confirm password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Clear previous errors
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneError("");

    // Validate inputs using Zod
    try {
      registerSchema.parse({ fullName, email, password, confirmPassword });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        validationError.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });

        if (fieldErrors["fullName"]) setFullNameError(fieldErrors["fullName"]);
        if (fieldErrors["email"]) setEmailError(fieldErrors["email"]);
        if (fieldErrors["password"]) setPasswordError(fieldErrors["password"]);
        if (fieldErrors["confirmPassword"])
          setConfirmPasswordError(fieldErrors["confirmPassword"]);

        const firstError = validationError.issues[0];
        setError(firstError?.message || "Validation error");
        showToast(firstError?.message || "Validation error", "error");
        setLoading(false);
        return;
      }
    }

    // Check if phone is provided
    if (!phone) {
      setPhoneError("Phone number is required");
      setError("Phone number is required");
      showToast("Phone number is required", "error");
      setLoading(false);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Update form data with current state values
    formData.set("fullName", fullName);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("phone", phone);
    if (profilePicture) {
      formData.set("file", profilePicture);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      // Store email and flow for verify-otp page
      localStorage.setItem("verification_email", email);
      localStorage.setItem("auth_flow", "register");

      setSuccess("Registration successful! Please sign in with your account.");
      showToast("Registration successful! Please sign in.", "success");

      // redirect after success
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f2f4f8] flex items-start justify-center font-['Nunito',sans-serif] overflow-y-auto pt-[180px] pb-12">
      {/* Absolute Logo Top Left */}
      <div className="absolute top-[72px] left-[66px] w-[91px] h-[38px] cursor-pointer z-10 hidden sm:block">
        <Link href="/">
          <Image
            src={petzyLogo}
            alt="Petzy Logo"
            fill
            className="object-contain"
          />
        </Link>
      </div>

      <div className="absolute top-[134px] left-[60px] cursor-pointer z-10 hidden sm:flex items-center gap-2">
        <Link
          href="/"
          className="font-semibold text-[#828282] text-[16px] hover:text-[#ff868a] transition-colors flex items-center gap-2"
        >
          <span className="text-[20px] mb-0.5">‹</span> Back to Login
        </Link>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="relative w-full max-w-[648px] bg-white/50 backdrop-blur-sm border-[3px] border-white px-8 py-10 sm:px-[112px] sm:py-[64px] rounded-[32px] shadow-[0_0_75px_0_rgba(255,113,118,0.15)] mx-4 z-20 my-auto">
        <div className="flex flex-col gap-8 sm:gap-[40px] items-center text-center">
          {/* Header */}
          <div className="flex flex-col gap-[12px] items-center justify-center w-full whitespace-pre-wrap">
            <h1 className="font-semibold text-[#0f0f0f] text-[32px] leading-none text-center">
              Welcome back!
            </h1>
            <p className="font-medium text-[#282828] text-[18px] leading-[normal]">
              We missed you! please enter your details.
            </p>
          </div>

          {/* Form */}
          <form
            className="w-full flex flex-col gap-[40px]"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200 w-full text-left">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4 border border-green-200 w-full text-left">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* Inputs Container */}
            <div className="flex flex-col gap-[12px] w-full text-left">
              {/* Full Name Input */}
              <div className="relative pt-[15px]">
                <div className="absolute left-[14px] top-[5px] bg-[#f9fafc] px-[10px] py-[1px] z-10">
                  <span className="font-['Montserrat',sans-serif] font-medium text-[#828282] text-[16px] tracking-[-0.16px]">
                    Full Name
                  </span>
                </div>
                <div
                  className={`h-[52px] w-full rounded-[7px] border ${fullNameError ? "border-red-500" : "border-[#e9e9e9]"} bg-[#f9fafc] flex items-center px-[15px] transition-all focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]`}
                >
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-[#282828] text-[14px] focus:outline-none outline-none border-none ring-0 focus:ring-0 placeholder:text-[#c3c3c3] tracking-[-0.14px]"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {fullNameError && (
                  <p className="text-[12px] text-red-500 mt-1 ml-2">
                    {fullNameError}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative pt-[15px]">
                <div className="absolute left-[14px] top-[5px] bg-[#f9fafc] px-[10px] py-[1px] z-10">
                  <span className="font-['Montserrat',sans-serif] font-medium text-[#828282] text-[16px] tracking-[-0.16px]">
                    Email address
                  </span>
                </div>
                <div
                  className={`h-[52px] w-full rounded-[7px] border ${emailError ? "border-red-500" : "border-[#e9e9e9]"} bg-[#f9fafc] flex items-center px-[15px] transition-all focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]`}
                >
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-[#282828] text-[14px] focus:outline-none outline-none border-none ring-0 focus:ring-0 placeholder:text-[#c3c3c3] tracking-[-0.14px]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {emailError && (
                  <p className="text-[12px] text-red-500 mt-1 ml-2">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Phone Input */}
              <div className="relative pt-[15px]">
                <div className="absolute left-[14px] top-[5px] bg-[#f9fafc] px-[10px] py-[1px] z-10">
                  <span className="font-['Montserrat',sans-serif] font-medium text-[#828282] text-[16px] tracking-[-0.16px]">
                    Phone Number
                  </span>
                </div>
                <div
                  className={`h-[52px] w-full rounded-[7px] border ${phoneError ? "border-red-500" : "border-[#e9e9e9]"} bg-[#f9fafc] flex items-center px-[15px] transition-all focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]`}
                >
                  <input
                    id="phone"
                    type="text"
                    placeholder="Enter your phone number"
                    className="w-full bg-transparent text-[#282828] text-[14px] focus:outline-none outline-none border-none ring-0 focus:ring-0 placeholder:text-[#c3c3c3] tracking-[-0.14px]"
                    value={phone || ""}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {phoneError && (
                  <p className="text-[12px] text-red-500 mt-1 ml-2">
                    {phoneError}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative pt-[15px]">
                <div className="absolute left-[14px] top-[5px] bg-[#f9fafc] px-[10px] py-[1px] z-10">
                  <span className="font-['Montserrat',sans-serif] font-medium text-[#828282] text-[16px] tracking-[-0.16px]">
                    Password
                  </span>
                </div>
                <div
                  className={`h-[52px] w-full rounded-[7px] border ${passwordError ? "border-red-500" : "border-[#e9e9e9]"} bg-[#f9fafc] flex items-center px-[15px] transition-all focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]`}
                >
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-[#282828] text-[14px] focus:outline-none outline-none border-none ring-0 focus:ring-0 placeholder:text-[#c3c3c3] tracking-[-0.14px]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {passwordError && (
                  <p className="text-[12px] text-red-500 mt-1 ml-2">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative pt-[15px]">
                <div className="absolute left-[14px] top-[5px] bg-[#f9fafc] px-[10px] py-[1px] z-10">
                  <span className="font-['Montserrat',sans-serif] font-medium text-[#828282] text-[16px] tracking-[-0.16px]">
                    Confirm Password
                  </span>
                </div>
                <div
                  className={`h-[52px] w-full rounded-[7px] border ${confirmPasswordError ? "border-red-500" : "border-[#e9e9e9]"} bg-[#f9fafc] flex items-center px-[15px] transition-all focus-within:border-[#ff868a] focus-within:ring-1 focus-within:ring-[#ff868a]`}
                >
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter your confirm password"
                    className="w-full bg-transparent text-[#282828] text-[14px] focus:outline-none outline-none border-none ring-0 focus:ring-0 placeholder:text-[#c3c3c3] tracking-[-0.14px]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {confirmPasswordError && (
                  <p className="text-[12px] text-red-500 mt-1 ml-2">
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              {/* Profile picture input - Re-added as it was in the original code, but not in the provided snippet */}
              <div className="pt-2">
                <FileUpload
                  label="Profile Picture"
                  description="Upload a profile picture (PNG, JPG up to 5MB)"
                  acceptedTypes="image/png, image/jpeg"
                  maxSizeMB={5}
                  onFileSelect={setProfilePicture}
                  initialFile={profilePicture}
                  preview={true}
                />
              </div>

              {/* Remember me row */}
              <div className="flex items-center justify-between w-full pt-2">
                <div className="flex gap-[6px] items-center">
                  <div className="border border-[#828282] border-solid h-[13px] w-[14px] rounded-[3px]" />
                  <span className="text-[12px] text-[#828282] tracking-[-0.12px]">
                    Remember me
                  </span>
                </div>
                <span className="text-[12px] text-[#828282] tracking-[-0.12px]">
                  Forgot Password
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-start w-full">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-[12px] bg-[#ff868a] hover:bg-[#ff7176] transition-colors flex items-center justify-center text-white font-semibold text-[18px] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Footer link */}
          <div className="w-full text-center whitespace-pre-wrap">
            <span className="text-[#828282] text-[18px] font-semibold leading-[normal]">
              Don’t Have an account ?{" "}
            </span>
            <Link
              href="/"
              className="text-[#6653ff] text-[18px] font-semibold hover:underline leading-[normal]"
            >
              Sign In
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
