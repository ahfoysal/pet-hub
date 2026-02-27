// middleware.ts — Super Admin Dashboard
// Figma Node: N/A — Infrastructure
// Purpose: Console-only session detection for the admin dashboard.
// Reads the shared JWT cookie from `.lvh.me` domain.
// Phase 1: Logs session info and redirect decisions — no actual redirects.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ─── Role → Dashboard URL Map (for wrong-role redirects) ───
const DASHBOARD_URLS: Record<string, string> = {
  ADMIN: "http://admin.lvh.me:3001/admin",
  VENDOR: "http://vendor.lvh.me:3003/vendor",
  PET_SITTER: "http://sitter.lvh.me:3004/sitter",
  PET_HOTEL: "http://hotel.lvh.me:3002/hotel",
  PET_SCHOOL: "http://school.lvh.me:3005/school",
  PET_OWNER: "http://owner.lvh.me:3006/owner",
};

// This dashboard is for ADMIN role
const EXPECTED_ROLE = "ADMIN";
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Read the shared JWT cookie ────────────────────────
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("═══════════════════════════════════════════════");
  console.log(`📍 ADMIN DASHBOARD MIDDLEWARE`);
  console.log(`   Path: ${pathname}`);

  if (!token) {
    // ─── No session — user not logged in ────────────────
    console.log("❌ NO SESSION FOUND");
    console.log(`   🔀 WOULD REDIRECT TO: ${AUTH_URL}?callbackUrl=${encodeURIComponent(request.url)}`);
    console.log("═══════════════════════════════════════════════");

    // Phase 1: Allow through (console only)
    return NextResponse.next();
  }

  // ─── Session found — check role ───────────────────────
  const userRole = (token.role as string || "").toUpperCase();

  console.log("✅ SSO SESSION FOUND");
  console.log(`   User:  ${token.email}`);
  console.log(`   Name:  ${token.name}`);
  console.log(`   Role:  ${userRole || "NONE"}`);

  if (userRole === EXPECTED_ROLE) {
    // Correct role for this dashboard
    console.log(`   ✅ AUTHORIZED — Role matches ${EXPECTED_ROLE}`);
  } else if (userRole && DASHBOARD_URLS[userRole]) {
    // Wrong dashboard — user should be on their own dashboard
    console.log(`   ⚠️ WRONG DASHBOARD — ${userRole} should be on:`);
    console.log(`   🔀 WOULD REDIRECT TO: ${DASHBOARD_URLS[userRole]}`);
  } else if (!userRole) {
    // Has session but no role
    console.log(`   ⚠️ NO ROLE — User needs to select a role`);
    console.log(`   🔀 WOULD REDIRECT TO: ${AUTH_URL}/select-role`);
  } else {
    // Unknown role
    console.log(`   ⚠️ UNKNOWN ROLE: ${userRole}`);
    console.log(`   🔀 WOULD REDIRECT TO: ${AUTH_URL}/unauthorized`);
  }

  console.log("═══════════════════════════════════════════════");

  // Phase 1: Always allow through — just console log
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/auth|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
};
