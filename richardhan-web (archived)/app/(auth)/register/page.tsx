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

  // Validation error states
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // Validation schema
  const registerSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
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
    setPhoneError("");

    // Validate inputs using Zod
    try {
      registerSchema.parse({ fullName, email, password });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        validationError.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });

        if (fieldErrors["fullName"]) setFullNameError(fieldErrors["fullName"]);
        if (fieldErrors["email"]) setEmailError(fieldErrors["email"]);
        if (fieldErrors["password"]) setPasswordError(fieldErrors["password"]);

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

      setSuccess(data?.message || "Registration successful");
      showToast(data?.message || "Registration successful", "success");

      // redirect after success
      setTimeout(() => {
        router.push("/verify-otp");
      }, 1500);
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
    <div className="min-h-screen bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8  ">
      <Link href="/">
        <Image src={petzyLogo} alt="Logo" />
      </Link>
      {/* <Link
        href="/select-role"
        className="text-sm text-primary hover:text-primary/90 my-2 "
      >
        &lt; Back to Role Selection
      </Link> */}
      <div className="flex flex-1 items-center justify-center pt-4 ">
        <div className="max-w-xl md:px-24 w-full space-y-8 p-4 md:p-8 bg-card rounded-3xl border border-border">
          <div>
            <h2 className="mt-6 text-center text-2xl md:text-3xl font-bold text-foreground">
              Create your account
            </h2>
            <p className="text-center text-sm text-muted-foreground">
              Join us by filling in the information below.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              <Input
                id="fullName"
                name="fullName"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={fullNameError}
              />

              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />

              <input type="hidden" name="phone" value={phone || ""} />
              <PhoneNumberInput
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                error={phoneError}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                showPasswordToggle
              />

              <FileUpload
                label="Profile Picture"
                description="Upload a profile picture (PNG, JPG up to 5MB)"
                acceptedTypes="image/png, image/jpeg"
                maxSizeMB={5}
                onFileSelect={setProfilePicture}
                preview={true}
              />
            </div>

            <div>
              <Button
                type="submit"
                text={loading ? "Creating Account..." : "Create Account"}
                variant="primary"
                className="w-full"
                disabled={loading}
              />
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account ?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign In
              </a>
            </p>
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
