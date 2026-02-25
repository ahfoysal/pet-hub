"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Toast, { ToastType } from "@/components/ui/Toast";
import Input from "@/components/ui/Input";
import { z } from "zod";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import Link from "next/link";
import googleLogo from "@/public/auth/google.png";
import { getRedirectPath, getRedirectProfilePath } from "@/lib/roleRoutes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { status } = useSession();

  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as ToastType,
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

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
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Sign in result:", signInResult);
      if (signInResult?.ok) {
        // Wait a moment for session to be established and check role
        setTimeout(async () => {
          try {
            const sessionResponse = await fetch(
              `${window.location.origin}/api/auth/session`,
              {
                credentials: "include",
                cache: "no-cache",
              },
            );

            if (!sessionResponse.ok) {
              // If session endpoint returns error, redirect to select-role
              router.push("/select-role");
              return;
            }

            const responseBody = await sessionResponse.text();

            if (!responseBody.trim()) {
              // If no response body, redirect to select-role
              router.push("/select-role");
              return;
            }

            try {
              const sessionData = JSON.parse(responseBody);

              if (sessionData?.user?.role) {
                if (sessionData.user.role === "ADMIN") {
                  // If user is admin, redirect to admin dashboard
                  router.push("/admin");
                  return;
                }
                // Check if profile is completed
                if (sessionData.user.isProfileCompleted) {
                  // Profile completed - redirect to role-specific dashboard
                  router.push(getRedirectPath(sessionData.user.role));
                } else {
                  // Profile not completed - redirect to profile settings
                  router.push(getRedirectProfilePath(sessionData.user.role));
                }
              } else {
                // User has no role, redirect to select-role page
                router.push("/select-role");
              }
            } catch (parseError) {
              console.error("Error parsing session JSON:", parseError);
              // On JSON parsing error, redirect to select-role
              router.push("/select-role");
            }
          } catch (error) {
            console.error("Error during post-login role check:", error);
            // On error, redirect to select-role page
            router.push("/select-role");
          }
        }, 500);

        // Show success toast
        showToast("Login successful!", "success");
      } else {
        setError(signInResult?.error || "Login failed");
        showToast(signInResult?.error || "Login failed", "error");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8 ">
      <Link href="/">
        <Image src={petzyLogo} alt="Logo" />
      </Link>

      <div className="flex flex-1 items-center justify-center ">
        <div className="max-w-xl md:px-24 w-full space-y-8 p-4 md:p-8 bg-card rounded-3xl border border-border">
          <div>
            <h2 className="mt-6 text-center text-2xl md:text-3xl font-semibold text-foreground">
              Welcome back!
            </h2>
            <p className="text-center md:text-xl text-muted-foreground pt-1">
              We missed you please enter your details.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="Enter Your Email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error && email ? error : ""}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Enter Your Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPasswordToggle
                error={error && password ? error : ""}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-secondary cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm font-medium cursor-pointer text-primary hover:text-primary/90"
              >
                Forgot Password?
              </a>
            </div>

            <div>
              <Button
                text={loading ? "Signing In..." : "Sign In"}
                variant="primary"
                className="w-full rounded-xl"
                onClick={handleSubmit}
              />
            </div>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card backdrop-blur-2xl text-muted-foreground rounded">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-6 flex gap-2 text-secondary rounded-xl text-lg md:text-xl"
            onClick={() => signIn("google")}
          >
            <Image src={googleLogo} alt="Google Logo" />
            Sign in with Google
          </Button>

          <div className="text-center mt-4">
            <p className="text-base text-[#828282] ">
              Don&apos;t have an account ?{" "}
              <a
                href="/register"
                className="font-medium text-primary hover:text-primary/90"
              >
                {" "}
                Sign Up
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
