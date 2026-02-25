"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { renderIcon } from "@/lib/iconUtils";
import { getVisibleMenuItems, UserRole } from "@/lib/sidebarRoutes";
import { X, LogOut, Settings } from "lucide-react";
import { useAppDispatch } from "@/redux/store/hooks";
import { clearCredentials } from "@/redux/features/slice/authSlice";
import Button from "@/components/ui/Button";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import { getRedirectSettingPath } from "@/lib/roleRoutes";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();

  const userRole: UserRole | null =
    status === "authenticated" ? (session?.user?.role as UserRole) : null;

  const visibleItems = getVisibleMenuItems(userRole);

  const isActive = (href: string) => {
    if (href.match(/\/(admin|vendor|sitter|hotel|school|owner)$/)) {
      return pathname === href;
    }

    if (href === "/settings") {
      const userRole = status === "authenticated" ? session?.user?.role : null;
      const roleSpecificSettings = userRole
        ? `/${userRole.toLowerCase()}/settings`
        : "/settings";
      return (
        pathname === "/settings" ||
        pathname === roleSpecificSettings ||
        pathname.startsWith(roleSpecificSettings + "/")
      );
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    dispatch(clearCredentials());
    
    // Clear local NextAuth session
    await signOut({ redirect: false });

    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000";
    window.location.href = `${authUrl}/logout`;
  };

  return (
    <div className="z-100 relative">
      {/* Sidebar */}
      <aside
        className={`bg-white h-screen flex flex-col pt-16 lg:pt-0
    fixed inset-y-0 left-0 z-50 w-64 sm:w-72
    transition-transform duration-300 ease-in-out
    lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
    lg:relative`}
      >
        <div className="flex flex-col h-full mt-6">
          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto lg:pt-12">
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-[#FF7176] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="shrink-0">{renderIcon(item)}</span>
                  <span>{item.label}</span>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 px-3 text-sm">
                No menu items available
              </p>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="px-3 py-4 mt-auto border-t border-primary   ">
            <Link
              href={getRedirectSettingPath(userRole)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(getRedirectSettingPath(userRole))
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>

            <Button
              variant="outline"
              className="w-full flex items-center gap-3 px-3 py-3 c rounded-lg text-sm text-foreground bg-white text-[#FF7176]  border border-[#FF7176]! font-bold!   hover:bg-[#FF7176] hover:text-white!  transition-colors mt-1"
              onClick={async () => {
                await handleLogout();
              }}
            >
              <LogOut size={20} />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute top-4 left-4 p-3 bg-white rounded-lg shadow-lg">
            <X size={28} className="text-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
}
