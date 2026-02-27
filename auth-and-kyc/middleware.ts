// middleware.ts — auth-and-kyc (Central Auth Server)
// Figma Node: N/A — Infrastructure
// Purpose: Minimal middleware for the central auth app.
// Only protects KYC/profile routes. Login page is public.
// Console-only session logging — no redirects in Phase 1.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/register",
  "/verify-otp",
  "/select-role",
  "/unauthorized",
  "/about",
  "/contact",
  "/services",
  "/logout",
];

const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Read the shared JWT cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    console.log("═══════════════════════════════════════════════");
    console.log("✅ SSO SESSION FOUND (auth-and-kyc)");
    console.log(`   Path:  ${pathname}`);
    console.log(`   User:  ${token.email}`);
    console.log(`   Role:  ${token.role}`);
    console.log("═══════════════════════════════════════════════");
  } else {
    console.log("═══════════════════════════════════════════════");
    console.log("❌ NO SESSION (auth-and-kyc)");
    console.log(`   Path: ${pathname}`);
    console.log(`   🔀 WOULD REDIRECT TO: / (login page)`);
    console.log("═══════════════════════════════════════════════");
  }

  // Phase 1: Always allow through — just console log
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/auth|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
};
