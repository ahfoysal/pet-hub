"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { renderIcon } from "@/lib/iconUtils";
import { getVisibleMenuItems, UserRole, MenuItemConfig } from "@/lib/sidebarRoutes";
import { X, LogOut, Settings, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

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
          <nav className="flex-1 px-3 space-y-2 overflow-y-auto lg:pt-12">
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => {
                const isExpanded = expandedMenus[item.label];

                if (item.subItems) {
                  return (
                    <div key={item.label} className="flex flex-col space-y-1">
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-['Arial'] transition-colors ${
                          item.subItems.some((sub) => isActive(sub.href))
                            ? "bg-[#FF7176]/10 text-[#FF7176]"
                            : "text-[#282828] hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="shrink-0">{renderIcon(item)}</span>
                          <span className="whitespace-nowrap">{item.label}</span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      {isExpanded && (
                        <div className="flex flex-col space-y-1 pl-4 mt-1 border-l-2 border-gray-100 ml-5">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-['Arial'] transition-colors ${
                                isActive(subItem.href)
                                  ? "text-[#FF7176] font-medium bg-gray-50"
                                  : "text-[#282828] hover:bg-gray-100"
                              }`}
                            >
                              <span className="shrink-0 scale-90">{renderIcon(subItem as MenuItemConfig)}</span>
                              <span className="whitespace-nowrap">{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[16px] font-['Arial'] transition-colors ${
                      isActive(item.href)
                        ? "bg-[#FF7176] text-white"
                        : "text-[#282828] hover:bg-gray-100"
                    }`}
                  >
                    <span className="shrink-0">{renderIcon(item)}</span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })
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
              <span>Policies & Settings</span>
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
