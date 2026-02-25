"use client";

import { Bell, Mail, LogOut, Settings, ChevronRight, Menu, X, User } from "lucide-react";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAppDispatch } from "@/redux/store/hooks";
import { clearCredentials } from "@/redux/features/slice/authSlice";
import petzyLogo from "@/public/images/logo.png";
import { getRedirectSettingPath } from "@/lib/roleRoutes";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { selectTotalUnreadCount } from "@/redux/features/slice/socketSlice";

export function DashboardNavbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { data: session, status } = useSession();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();
  const dispatch = useAppDispatch();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const totalUnreadCount = useSelector(selectTotalUnreadCount);

  // Get user role from session
  const userRole = status === "authenticated" ? session?.user?.role : null;
  const userImage = session?.user?.image;
  const userName = session?.user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    // Clear Redux state first
    dispatch(clearCredentials());

    // Clear local NextAuth session
    await signOut({ redirect: false });

    // Then redirect to central logout page to clear auth session
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000";
    window.location.href = `${authUrl}/logout`;
    setShowProfileMenu(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="absolute top-0 z-100 w-full bg-white border-b border-[#d0d0d0]">
      <div className="flex items-center justify-between px-[38px] h-[80px]">
        {/* Left - Greeting Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src={petzyLogo}
              alt="Logo"
              width={80}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-[12px]">
          {/* Mail */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <Mail size={22.5} className="text-[#282828]" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1 min-w-[15px] h-[15px] px-1 bg-[#FF7176] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white leading-none">
              2
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer mr-2">
            <Bell size={22.5} className="text-[#282828]" strokeWidth={1.5} />
            {totalUnreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white leading-none">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center cursor-pointer"
            >
              <div className="w-[32.4px] h-[32.4px] rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {userInitials}
                    </span>
                  </div>
                )}
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-900">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {session?.user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href={getRedirectSettingPath(userRole)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings size={16} className="mr-3" />
                    Settings
                    <ChevronRight size={16} className="ml-auto" />
                  </Link>
                  <button
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-3" />
                    Log out
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
