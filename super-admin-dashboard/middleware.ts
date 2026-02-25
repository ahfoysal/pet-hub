import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/* ===== ROUTES ===== */
const PUBLIC_ROUTES = [
  "/",
  "/register",
  "/verify-otp",
  "/select-role",
  "/api/sync",
  "/admin",
  "/admin-dashboard",
];

const ADMIN_ROUTES = ["/admin", "/admin-dashboard"];
const OWNER_ROUTES = ["/owner", "/owner-dashboard"];
const SITTER_ROUTES = [
  "/sitter",
  "/sitter-dashboard",
  "/profile-settings/sitter",
];
const SCHOOL_ROUTES = ["/school", "/school-dashboard"];
const HOTEL_ROUTES = ["/hotel", "/hotel-dashboard", "/profile-settings/hotel"];
const VENDOR_ROUTES = [
  "/vendor",
  "/vendor-dashboard",
  // "/profile-settings/vendor",
];

/* ===== HELPERS ===== */
const isPublicRoute = (pathname: string) => {
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname === "/" ? pathname === route : pathname.startsWith(route)
  );

  // DEBUG BYPASS: Allow access to admin if bypass loop is present
  if (pathname.startsWith("/admin") || pathname.startsWith("/admin-dashboard")) {
    console.warn("DEBUG: Bypassing auth for Admin route:", pathname);
    return true; // Treat as public for bypass
  }
  return isPublicRoute;
};

const startsWithRoute = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname.startsWith(route));

const getUserRole = (role: string | undefined) => {
  if (!role) return null;
  return role;
};

const hasAccess = (userRole: string | null, requiredRole: string) => {
  return userRole === requiredRole;
};

/* ===== MAIN MIDDLEWARE ===== */
export async function middleware(request: NextRequest) {
  const authUrl =
    process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000";
  const { pathname } = request.nextUrl;

  const syncToken = request.nextUrl.searchParams.get("sync_token");
  if (syncToken) {
    console.log(`Sync process started for URL: ${request.url}`);
    const url = request.nextUrl.clone();
    url.searchParams.delete("sync_token");
    const response = NextResponse.redirect(url);
    
    const isProd = request.url.startsWith("https://");
    const cookieName = isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token";
    
    console.log(`Setting sync cookie: ${cookieName} | IsProd: ${isProd} | Token Length: ${syncToken.length}`);
    
    response.cookies.set(cookieName, syncToken, {
      path: "/",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    return response;
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get session
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      console.log("✅ LOGIN DONE: Token found in middleware.");
      console.log(`Current Path: ${pathname}`);
      console.log(`User Role: ${token.role}`);
    } else {
      console.log("❌ LOGIN FAILED: No token found in current request.");
      console.log("Checking all available cookies:");
      request.cookies.getAll().forEach((c) => console.log(` - ${c.name}`));
    }

    // Not logged in → redirect to central auth server (DISABLED FOR DEBUGGING)
    if (!token) {
      console.warn("⚠️ [DEBUG MODE] Token missing. Skipping auto-redirection.");
      
      const isLoop = request.nextUrl.searchParams.get("loop") === "1";
      if (isLoop) {
        console.log("Headers for loop investigation:");
        request.headers.forEach((v, k) => console.log(` - ${k}: ${v}`));
      }

      // Instead of redirecting, we just log and continue to let the page handle it or show empty state
      return NextResponse.next();
    }

    const userRole = getUserRole(token.role as string);
    console.log("Verified User Role:", userRole);

    // Admin routes
    if (startsWithRoute(pathname, ADMIN_ROUTES)) {
      if (!userRole) {
        const dest = new URL(`${authUrl}/select-role`, request.url);
        console.log(`🔄 REDIRECTING (No Role): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
      if (!hasAccess(userRole.toLowerCase(), "admin")) {
        const dest = new URL(`${authUrl}/unauthorized`, request.url);
        console.log(`🔄 REDIRECTING (Unauthorized Admin): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
    }

    // Vendor routes
    if (startsWithRoute(pathname, VENDOR_ROUTES)) {
      if (!userRole) {
        const dest = new URL(`${authUrl}/select-role`, request.url);
        console.log(`🔄 REDIRECTING (No Role): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
      if (!hasAccess(userRole.toLowerCase(), "vendor")) {
        const dest = new URL(`${authUrl}/unauthorized`, request.url);
        console.log(`🔄 REDIRECTING (Unauthorized Vendor): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
    }

    // Pet Owner routes
    if (startsWithRoute(pathname, OWNER_ROUTES)) {
      if (!userRole) {
        const dest = new URL(`${authUrl}/select-role`, request.url);
        console.log(`🔄 REDIRECTING (No Role): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
      if (!hasAccess(userRole.toLowerCase(), "pet_owner")) {
        const dest = new URL(`${authUrl}/unauthorized`, request.url);
        console.log(`🔄 REDIRECTING (Unauthorized Owner): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
    }

    // Pet Sitter routes
    if (startsWithRoute(pathname, SITTER_ROUTES)) {
      if (!userRole) {
        const dest = new URL(`${authUrl}/select-role`, request.url);
        console.log(`🔄 REDIRECTING (No Role): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
      if (!hasAccess(userRole.toLowerCase(), "pet_sitter")) {
        const dest = new URL(`${authUrl}/unauthorized`, request.url);
        console.log(`🔄 REDIRECTING (Unauthorized Sitter): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
    }

    // Pet School routes
    if (startsWithRoute(pathname, SCHOOL_ROUTES)) {
      if (!userRole) {
        const dest = new URL(`${authUrl}/select-role`, request.url);
        console.log(`🔄 REDIRECTING (No Role): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
      if (!hasAccess(userRole.toLowerCase(), "pet_school")) {
        const dest = new URL(`${authUrl}/unauthorized`, request.url);
        console.log(`🔄 REDIRECTING (Unauthorized School): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
    }

    // Pet Hotel routes
    if (startsWithRoute(pathname, HOTEL_ROUTES)) {
      if (!userRole) {
        const dest = new URL(`${authUrl}/select-role`, request.url);
        console.log(`🔄 REDIRECTING (No Role): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
      if (!hasAccess(userRole.toLowerCase(), "pet_hotel")) {
        const dest = new URL(`${authUrl}/unauthorized`, request.url);
        console.log(`🔄 REDIRECTING (Unauthorized Hotel): ${dest.toString()}`);
        return NextResponse.redirect(dest);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("🔥 MIDDLEWARE ERROR:", error);
    // Fallback to auth server if something explodes
    const callbackUrl = encodeURIComponent(request.url);
    const redirectUrl = new URL(`${authUrl}/?callbackUrl=${callbackUrl}`, request.url);
    console.log(`🔄 ERROR FALLBACK: Redirecting to ${redirectUrl.toString()}`);
    return NextResponse.redirect(redirectUrl);
  }
}

/* ===== MATCHER ===== */
// global matcher ( best practice ) for all routes

export const config = {
  // Exclude API routes, static files, image optimizations, and .png files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api/auth|.*\.png$|.*\.jpg$|.*\.jpeg$|.*\.svg$).*)"],
};

// Combining matchers (best practice) for more regular routes
// export const config = {
//   matcher: ["/dashboard/:path*", "/admin/:path*", "/moderator/:path*"],
// };
