"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronRight, LogOut, Settings } from "lucide-react";
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
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-[#D0D0D0]">
      <div className="flex items-center justify-between px-6 lg:px-[38px] h-[80px]">
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
              alt="Petzy"
              width={92}
              height={38}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right - Icons & Profile */}
        <div className="flex items-center gap-6 lg:gap-[32px]">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer group"
            >
              <Image 
                src="/assets/bell.svg" 
                alt="Notifications" 
                width={22} 
                height={22}
                className="group-hover:opacity-80 transition-opacity"
              />
              {totalUnreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-0.5 bg-[#FF7176] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown (Placeholder for clicked state) */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden font-plus-jakarta">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
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
              className="flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            >
              <div className="w-[32px] h-[32px] rounded-full overflow-hidden border border-gray-100">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FF7176]/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#FF7176]">
                      {userInitials}
                    </span>
                  </div>
                )}
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden font-plus-jakarta animate-fadeIn">
                <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                  <p className="font-bold text-gray-900 truncate">
                    {session?.user?.name || "Habib"}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {session?.user?.email}
                  </p>
                </div>
                <div className="py-2">
                  <Link
                    href={getRedirectSettingPath(userRole)}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FF7176]/5 group transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings size={16} className="mr-3 text-gray-400 group-hover:text-[#FF7176]" />
                    <span className="font-medium">Settings</span>
                    <ChevronRight size={14} className="ml-auto text-gray-300" />
                  </Link>
                  <button
                    className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 group transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-3 text-gray-400 group-hover:text-red-500" />
                    <span className="font-medium text-red-600">Log out</span>
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
