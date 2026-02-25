"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f4f8]">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 font-medium">Logging you out...</p>
      </div>
    </div>
  );
}
