"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronRight, LogOut, Settings, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store/hooks";
import { clearCredentials } from "@/redux/features/slice/authSlice";
import { selectTotalUnreadCount } from "@/redux/features/slice/socketSlice";
import { getRedirectSettingPath } from "@/lib/roleRoutes";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import { Menu, X } from "lucide-react";

export function DashboardNavbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: session, status } = useSession();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();
  const dispatch = useAppDispatch();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const totalUnreadCount = useSelector(selectTotalUnreadCount);

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
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="absolute top-0 z-100 w-full bg-white border-b border-[#d0d0d0] h-20">
      <div className="flex items-center justify-between px-9.5 h-full">
        {/* Left - Logo Section */}
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
              src="/assets/logo.svg"
              alt="Logo"
              width={92}
              height={38}
              className="object-contain h-9.5 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-6">
          {/* Messages (Mail) Icon - Matching Figma fidelity */}
          <button className="relative flex items-center justify-center size-8 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
            <div className="relative">
              <Mail size={22.5} className="text-[#101828]" strokeWidth={1.5} />
              <span className="absolute -top-1.25 -right-3.75 min-w-[15.3px] h-[15.3px] px-[4.5px] bg-primary text-white text-[9.9px] font-bold font-plus-jakarta rounded-full flex items-center justify-center">
                2
              </span>
            </div>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center size-8 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
            >
              <Bell size={22.5} className="text-[#101828]" strokeWidth={1.5} />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-3.75 h-3.75 px-[4.5px] bg-primary text-white text-[9.9px] font-bold font-plus-jakarta rounded-full flex items-center justify-center">
                  {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden font-inter">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  <span className="text-xs text-[#FF7176] font-medium cursor-pointer">Mark all as read</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center cursor-pointer"
            >
              <div className="size-[32.4px] rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all bg-[#f2f4f7]">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    width={32}
                    height={32}
                    className="size-full object-cover rounded-full"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-primary">
                      {userInitials}
                    </span>
                  </div>
                )}
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden font-inter">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-900 truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate mt-0.5">
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
