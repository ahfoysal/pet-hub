"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import Link from "next/link";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import { ChevronLeft, CircleCheck } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { getRedirectProfilePath } from "@/lib/roleRoutes";

// Import role images properly (recommended way)
import dogIcon from "@/public/profile-setup/dog.png";
import hotelIcon from "@/public/profile-setup/hotel.png";
import schoolIcon from "@/public/profile-setup/school.png";
import vendorIcon from "@/public/profile-setup/vendor.png";
import { useSetRoleMutation } from "@/redux/features/api/auth/authManagementApi";

export default function RoleSelectionPage() {
  const [setRole] = useSetRoleMutation();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  });
  const router = useRouter();
  const { data: session } = useSession();

  // Effect to auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible]);

  // Admin Bypass
  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      const adminDest = getRedirectProfilePath("ADMIN");
      console.log("Admin detected on Select Role page, redirecting to:", adminDest);
      window.location.href = `/api/sync?callbackUrl=${encodeURIComponent(adminDest)}`;
    }
  }, [session, router]);

  const roles = [
    {
      id: "PET_SITTER",
      label: "Pet Sitter",
      image: dogIcon,
    },
    {
      id: "PET_HOTEL",
      label: "Pet Hotel",
      image: hotelIcon,
    },
    {
      id: "PET_SCHOOL",
      label: "Pet School",
      image: schoolIcon,
    },
    { id: "VENDOR", label: "Vendor", image: vendorIcon },
  ];

  const handleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = async () => {
    if (selectedRole) {
      setLoading(true);
      try {
        const result = await setRole({ role: selectedRole }).unwrap();
        const roleData = result;

        console.log("Role changed successfully, attempting re-signin");

        // Force NextAuth to re-authenticate with the fresh tokens containing the new role
        const signInResult = await signIn("credentials", {
          accessToken: roleData.data.accessToken,
          refreshToken: roleData.data.refreshToken,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Force a hard navigation to the sync endpoint to ensure cookies lock in
          // and we get properly redirected to KYC across subdomains
          const targetUrl = getRedirectProfilePath(selectedRole);
          window.location.href = `/api/sync?callbackUrl=${encodeURIComponent(targetUrl)}`;
        } else {
          throw new Error(
            signInResult?.error || "Failed to sign in after role update",
          );
        }
      } catch (error: unknown) {
        console.error("Error setting role:", error);

        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";

        if (
          errorMessage === "Role already set" ||
          errorMessage.includes("already")
        ) {
          setToast({
            isVisible: true,
            message: "Your role has already been selected.",
            type: "info",
          });

          // Even if role was set, force them through the sync flow to re-validate KYC
          window.location.href = `/api/sync?callbackUrl=${encodeURIComponent("/kyc-verification")}`;
        } else {
          setToast({
            isVisible: true,
            message:
              errorMessage || "An error occurred while setting your role",
            type: "error",
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8 ">
      <Link href="/">
        <Image src={petzyLogo} alt="Logo" />
      </Link>
      <Link
        href="/"
        className="w-full h-12 flex justify-center items-center text-primary font-medium hover:text-primary/90 mt-4"
      >
        {" "}
        <ChevronLeft className="w-5 h-5" /> Back to Sign In
      </Link>
      <div className="flex flex-1 items-center justify-center ">
        <div className="max-w-xl dm:px-24 w-full space-y-8 p-8 bg-card rounded-3xl border border-primary">
          <div>
            <h2 className="mt-6 text-center text-2xl font-bold text-foreground">
              Select Your Role
            </h2>
            <p className="text-center text-sm text-muted-foreground">
              Choose the role that best describes you.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleSelect(role.id)}
                className={`relative flex flex-col items-center justify-center px-4 py-4 md:py-8  border rounded-2xl cursor-pointer transition-all duration-200 ${
                  selectedRole === role.id
                    ? " border border-primary bg-primary/20  scale-105"
                    : "border-2 border-white bg-background hover:border-primary/50"
                }`}
              >
                <span
                  className={`text-3xl mb-2 ${
                    selectedRole === role.id ? "scale-110" : ""
                  } transition-transform duration-200`}
                >
                  <Image
                    src={role.image}
                    alt={role.label}
                    width={48}
                    height={48}
                  />
                </span>
                <span
                  className={`text-sm font-medium ${
                    selectedRole === role.id
                      ? "text-primary font-semibold"
                      : "text-foreground"
                  } transition-colors duration-200`}
                >
                  {role.label}
                </span>
                {selectedRole === role.id && (
                  <div className=" p-2 absolute top-2 right-2">
                    <CircleCheck className=" bg-[#FF7176] text-white border-none rounded-full" />
                  </div>
                  // <span ></span>
                )}
              </div>
            ))}
          </div>
          <div>
            <Button
              text={loading ? "Setting Role..." : "Continue"}
              variant="primary"
              className="w-full"
              disabled={!selectedRole || loading}
              onClick={handleContinue}
            />
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
