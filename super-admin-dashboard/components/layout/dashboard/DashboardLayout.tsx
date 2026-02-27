"use client";

import type React from "react";
import { DashboardNavbar } from "@/components/layout/dashboard/DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { MobileMenuProvider } from "@/contexts/MobileMenuContext";
import KycGate from "./KycGate";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileMenuProvider>
      <div className="flex h-screen bg-gray-50 relative">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <header className="fixed top-0 left-0 w-full z-100 bg-white border-b border-[#D0D0D0]">
            <DashboardNavbar />
          </header>

          {/* The main area */}
          <main className="relative mt-16 p-6 lg:p-8  bg-gray-100 overflow-auto h-screen ">
            <KycGate>{children}</KycGate>
          </main>
        </div>
      </div>
    </MobileMenuProvider>
  );
}

export default DashboardLayout;
