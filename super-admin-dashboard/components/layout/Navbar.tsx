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
import logoImg from "@/public/images/Petzy.png";

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

  // Client‑side callback URL for auth redirects (avoid SSR mismatch)
  const [callbackUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  });
  const authBase = process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000";
  const loginHref = `${authBase}/?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const registerHref = `${authBase}/register?callbackUrl=${encodeURIComponent(callbackUrl)}`;


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
    <section className="bg-background">
      <nav className="fixed top-0 right-0 left-0 z-50 px-4 py-4 sm:px-6">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white/10 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-8 sm:py-4 border ">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <div className="w-12  h-10 md:w-18 md:h-12 flex items-center justify-center">
              <Image
                src={logoImg}
                alt="Petzy"
                className="w-full h-full object-contain text-foreground "
              />
            </div>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="hidden sm:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            <Link
              href="/"
              className="relative text-base font-medium text-foreground transition-colors hover:text-primary after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full hover:after:-translate-1/2
              "
            >
              Home
            </Link>

            {/* <Link
              href="/about"
              className="text-base font-medium text-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-base font-medium text-foreground transition-colors hover:text-primary"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-base font-medium text-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link> */}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={authDropdownRef}>
                <button
                  onClick={() => setIsAuthOpen(!isAuthOpen)}
                  className="flex items-center gap-2 rounded-full bg-muted p-1 text-base focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  aria-expanded={isAuthOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:block truncate max-w-25 text-base font-medium">
                    {user?.name || user?.email?.split("@")[0] || "User"}
                  </span>
                </button>

                {isAuthOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2">
                        <p className="text-base font-medium text-foreground truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || ""}
                        </p>
                      </div>

                      <div className="border-t border-border my-1"></div>

                      <Link
                        href={getRedirectPath(user?.role || null)}
                        className="flex items-center gap-2 px-4 py-2 text-base text-foreground hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => setIsAuthOpen(false)}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>

                      {/* <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-base text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsAuthOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-base text-foreground cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => setIsAuthOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link> */}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 cursor-pointer text-base text-foreground hover:bg-muted transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  text="Log in"
                  variant="outline"
                  href={loginHref}
                  className="rounded-lg"
                />
                <Button
                  text="Get Started"
                  className="bg-white "
                  icon={<ChevronRight size={16} />}
                  href={registerHref}
                />
              </div>
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
                href={loginHref}
                className="rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              />
              <Button
                text="Get Started"
                className="bg-white"
                icon={<ChevronRight size={16} />}
                href={registerHref}
                onClick={() => setIsMenuOpen(false)}
              />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </section>
  );
}
