"use client";

import { Bell, LogOut, Settings, ChevronRight, Menu, X, Mail } from "lucide-react";
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
    dispatch(clearCredentials());
    await signOut({ redirect: false });
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000";
    window.location.href = `${authUrl}/logout`;
    setShowProfileMenu(false);
  };

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
    <nav className="fixed top-0 z-[110] w-full bg-white border-b border-[#d0d0d0] h-[80px]">
      <div className="flex items-center justify-between px-[38px] h-full">
        {/* Left - Greeting Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex items-center">
            <Image
              src={petzyLogo}
              alt="Petzy"
              width={92}
              height={38}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-[24px]">
          {/* Mail */}
          <div className="relative group cursor-pointer hidden sm:block">
            <div className="relative">
              <Mail size={22} className="text-[#282828] group-hover:text-primary transition-colors" strokeWidth={1.5} />
              <div className="absolute -top-1 -right-2 bg-[#ff7176] text-white text-[10px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center border border-white">
                2
              </div>
            </div>
          </div>

          {/* Notifications/Bell */}
          <button className="relative group cursor-pointer">
            <Bell size={22} className="text-[#282828] group-hover:text-primary transition-colors" strokeWidth={1.5} />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#ff7176] text-white text-[10px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center border border-white">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            >
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f6f3eb] flex items-center justify-center">
                    <span className="text-[12px] font-semibold text-primary">
                      {userInitials}
                    </span>
                  </div>
                )}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 z-[120] overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="font-bold text-[#101828] font-arimo">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-[13px] text-[#6a7282] truncate font-arimo">
                    {session?.user?.email}
                  </p>
                </div>
                <div className="py-2">
                  <Link
                    href={getRedirectSettingPath(userRole)}
                    className="flex items-center px-4 py-2.5 text-[14px] text-[#282828] hover:bg-gray-50 transition-colors font-arimo"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings size={16} className="mr-3 text-[#6a7282]" />
                    Settings
                    <ChevronRight size={14} className="ml-auto text-gray-300" />
                  </Link>
                  <button
                    className="w-full flex items-center px-4 py-2.5 text-[14px] text-[#282828] hover:bg-red-50 hover:text-red-500 transition-colors font-arimo cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-3 text-[#6a7282] group-hover:text-red-500" />
                    Log out
                    <ChevronRight size={14} className="ml-auto text-gray-300" />
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
