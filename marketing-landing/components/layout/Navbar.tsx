"use client";

import { Menu, X, User, LogOut, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { useSession, signOut } from "next-auth/react";
import { clearCredentials } from "@/redux/features/slice/authSlice";
import Image from "next/image";
import Button from "../ui/Button";
import { getRedirectPath } from "@/lib/roleRoutes";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { user: reduxUser, isAuthenticated: reduxIsAuthenticated } =
    useAppSelector((state) => state.auth);
  const { data: session, status } = useSession();

  // Use session as primary auth source, fallback to Redux
  const isAuthenticated = status === "authenticated" || reduxIsAuthenticated;
  const user = session?.user || reduxUser;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    // Clear Redux state first
    dispatch(clearCredentials());
    // Then sign out from NextAuth session
    await signOut({ callbackUrl: "/" });
    setIsAuthOpen(false);
  };

  // Close auth dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authDropdownRef.current &&
        !authDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAuthOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative w-full">

      <nav className="fixed top-0 right-0 left-0 z-50 px-4 py-8">
        <div className="relative mx-auto flex max-w-[1400px] h-[88px] items-center justify-between rounded-full bg-white/30 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-md px-8 transition-all duration-300">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <Image
              src="/assets/logo.svg"
              alt="Petzy"
              width={92}
              height={38}
              className="object-contain"
            />
          </Link>

          {/* Navigation Links - Centered */}
          <div className="hidden lg:flex items-center gap-[32px] font-montserrat px-[34px] py-[17px]">
            <Link
              href="#features"
              className="text-[18px] font-normal text-[#282828] transition-colors hover:text-primary"
            >
              App Features
            </Link>
            <Link
              href="#services"
              className="text-[18px] font-normal text-[#282828] transition-colors hover:text-primary tracking-[-0.18px]"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className="text-[18px] font-normal text-[#282828] transition-colors hover:text-primary"
            >
              How it Works
            </Link>
            <Link
              href="#testimonials"
              className="text-[18px] font-normal text-[#282828] transition-colors hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-[18px] font-normal text-[#282828] transition-colors hover:text-primary"
            >
              FAQ
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={authDropdownRef}>
                <button
                  onClick={() => setIsAuthOpen(!isAuthOpen)}
                  className="flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-md p-1 text-base focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-white/50"
                  aria-expanded={isAuthOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:block truncate max-w-25 text-[15px] font-medium text-[#282828] font-montserrat">
                    {user?.name || user?.email?.split("@")[0] || "User"}
                  </span>
                </button>

                {isAuthOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden backdrop-blur-xl border border-white/20">
                    <div className="py-1">
                      <div className="px-4 py-3 bg-gray-50/50">
                        <p className="text-[14px] font-bold text-gray-900 font-montserrat truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-[11px] text-gray-400 font-arimo truncate">
                          {user?.email || ""}
                        </p>
                      </div>

                      <div className="h-px bg-gray-100 mx-4 my-1"></div>

                      <Link
                        href={getRedirectPath(user?.role || null)}
                        className="flex items-center gap-2 px-4 py-2 text-[14px] text-gray-700 font-montserrat hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setIsAuthOpen(false)}
                      >
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span>Dashboard</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 cursor-pointer text-[14px] text-gray-700 font-montserrat hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/register"
                className="bg-[#ff7176] text-white px-[30px] py-[14px] rounded-full font-montserrat font-medium text-[18px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
              >
                join Us
              </Link>
            )}
          </div>

          {/* Hamburger Button for Mobile */}
          <button
            className="text-foreground focus:outline-none md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 cursor-pointer" />
            ) : (
              <Menu className="h-6 w-6 cursor-pointer" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-2 rounded-lg bg-muted px-4 py-4 shadow-sm backdrop-blur-sm md:hidden border">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-base font-medium text-foreground transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Home
              </Link>

              {/* <Link
                href="/about"
                className="text-base font-medium text-foreground transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-base font-medium text-foreground transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="text-base font-medium text-foreground transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Contact
              </Link> */}
              {isAuthenticated && user ? (
                <div className="pt-2 border-t border-border cursor-pointer">
                  <div className="px-2 py-3 cursor-pointer">
                    <p className="text-base font-medium text-foreground truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                  <div className="space-y-2 cursor-pointer">
                    <Link
                      href={getRedirectPath(user?.role || null)}
                      className="flex items-center gap-2 px-2 py-2 text-base text-foreground hover:bg-muted transition-colors rounded cursor-pointer"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthOpen(false);
                      }}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>

                    {/* <Link
                      href="/profile"
                      className="flex items-center gap-2 px-2 py-2 text-base text-foreground hover:bg-muted transition-colors rounded"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthOpen(false);
                      }}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-2 py-2 text-base text-foreground hover:bg-muted transition-colors rounded"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthOpen(false);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link> */}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center  gap-2 px-2 py-2 text-base text-foreground hover:bg-muted transition-colors rounded-lg"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-border flex flex-col gap-2">
                  <Button
                    text="Log in"
                    variant="outline"
                    href="/login"
                    className="rounded-lg"
                    // size="sm"
                    onClick={() => setIsMenuOpen(false)}
                  />

                  <Button
                    text="Get Started"
                    className="bg-white"
                    icon={<ChevronRight className="w-full" />}
                    href="/register"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
