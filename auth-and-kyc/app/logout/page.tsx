// app/logout/page.tsx — Central SSO Logout
// Purpose: Clears the shared `.lvh.me` session cookie.
// This is the ONLY logout endpoint. All dashboards redirect here.

"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LogoutPage() {
  useEffect(() => {
    // signOut() will clear the next-auth.session-token cookie
    // Since the cookie is set on .lvh.me domain, clearing it here
    // means ALL subdomains lose the session (Google/YouTube model)
    console.log("🚪 SSO LOGOUT: Clearing shared session cookie...");
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f4f8]">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 font-medium">Logging you out everywhere...</p>
      </div>
    </div>
  );
}
