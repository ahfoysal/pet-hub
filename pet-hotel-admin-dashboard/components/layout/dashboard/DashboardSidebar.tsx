"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { getVisibleMenuItems, UserRole } from "@/lib/sidebarRoutes";
import { X } from "lucide-react";
import { useAppDispatch } from "@/redux/store/hooks";
import { clearCredentials } from "@/redux/features/slice/authSlice";
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
    await signOut({ redirect: false });
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000";
    window.location.href = `${authUrl}/logout`;
  };

  return (
    <div className="z-[60] relative">
      {/* Sidebar */}
      <aside
        className={`bg-white h-screen flex flex-col pt-[80px]
    fixed inset-y-0 left-0 z-50 w-[276px]
    transition-transform duration-300 ease-in-out border-r border-[#D0D0D0]
    lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
    lg:relative font-montserrat`}
      >
        <div className="flex flex-col h-full py-[38px]">
          {/* Navigation */}
          <nav className="flex-1 px-[24px] space-y-[8px] overflow-y-auto">
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-[12px] px-[16px] py-[14px] rounded-[10px] text-[15px] font-medium transition-all group ${
                    isActive(item.href)
                      ? "bg-[#FF7176] text-white shadow-sm"
                      : "text-[#282828] hover:bg-gray-50"
                  }`}
                >
                  <div className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
                    {item.imageSrc ? (
                      <Image
                        src={item.imageSrc}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={`object-contain transition-all ${
                          isActive(item.href) ? "brightness-0 invert" : "opacity-80 group-hover:opacity-100"
                        }`}
                      />
                    ) : (
                      <span className="text-gray-400">?</span>
                    )}
                  </div>
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
          <div className="px-[24px] mt-auto space-y-[8px]">
            <Link
              href={getRedirectSettingPath(userRole)}
              className={`flex items-center gap-[12px] px-[16px] py-[14px] rounded-[10px] text-[15px] font-medium transition-all group ${
                isActive(getRedirectSettingPath(userRole))
                  ? "bg-[#FF7176] text-white"
                  : "text-[#282828] hover:bg-gray-50"
              }`}
            >
              <div className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
                <Image
                  src="/assets/settings.svg"
                  alt="Settings"
                  width={20}
                  height={20}
                  className={`object-contain transition-all ${
                    isActive(getRedirectSettingPath(userRole)) ? "brightness-0 invert" : "opacity-80 group-hover:opacity-100"
                  }`}
                />
              </div>
              <span>Settings</span>
            </Link>

            <button
              className="w-full flex items-center gap-[12px] px-[16px] py-[14px] rounded-[10px] text-[15px] font-medium text-[#FF7176] hover:bg-red-50 transition-all group"
              onClick={handleLogout}
            >
              <div className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
                <Image
                  src="/assets/logout.svg"
                  alt="Log out"
                  width={20}
                  height={20}
                  className="object-contain opacity-80 group-hover:opacity-100"
                />
              </div>
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[55] lg:hidden backdrop-blur-sm"
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
