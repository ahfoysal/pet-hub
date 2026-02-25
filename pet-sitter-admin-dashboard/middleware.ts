import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/* ===== ROUTES ===== */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/unauthorized",
  "/about",
  "/contact",
  "/services",
  "/verify-otp",
  "/select-role",
  "/sitter",
  "/sitter-dashboard",
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
const isPublicRoute = (pathname: string) => 
  PUBLIC_ROUTES.includes(pathname) || 
  pathname.startsWith("/sitter") || 
  pathname.startsWith("/sitter-dashboard");

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
    process.env.NEXT_PUBLIC_AUTH_URL || "https://auth-pethub-rnc.vercel.app";
  const { pathname } = request.nextUrl;

  // 1. Process sync_token FIRST before any other logic or bypasses
  const syncToken = request.nextUrl.searchParams.get("sync_token");
  if (syncToken) {
    console.log("🔄 [Middleware] Processing sync_token...");
    const url = request.nextUrl.clone();
    url.searchParams.delete("sync_token");
    const response = NextResponse.redirect(url);
    const cookieName =
      request.nextUrl.protocol === "https:"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";
    
    response.cookies.set(cookieName, syncToken, {
      path: "/",
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
    });
    return response;
  }

  // 2. DEBUG BYPASS: Allow access even without token session
  // ONLY for the main dashboard routes to allow hydration
  if (pathname.startsWith("/sitter") || pathname.startsWith("/sitter-dashboard")) {
    // We still allow this to proceed, but now the cookie above would have been set
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not logged in → redirect to central auth server (DISABLED FOR DEBUGGING)
  if (!token) {
    console.warn("⚠️ [DEBUG MODE] Token missing. Skipping auto-redirection.");
    return NextResponse.next();
  }

  const userRole = getUserRole(token.role);
  console.log("User Role in Proxy:", userRole);

  // Admin routes
  if (startsWithRoute(pathname, ADMIN_ROUTES)) {
    if (!userRole) {
      return NextResponse.redirect(
        new URL(`${authUrl}/select-role`, request.url),
      );
    }
    if (!hasAccess(userRole.toLowerCase(), "admin")) {
      return NextResponse.redirect(
        new URL(`${authUrl}/unauthorized`, request.url),
      );
    }
  }

  // Vendor routes
  if (startsWithRoute(pathname, VENDOR_ROUTES)) {
    if (!userRole) {
      return NextResponse.redirect(
        new URL(`${authUrl}/select-role`, request.url),
      );
    }
    if (!hasAccess(userRole.toLowerCase(), "vendor")) {
      return NextResponse.redirect(
        new URL(`${authUrl}/unauthorized`, request.url),
      );
    }
  }

  // Pet Owner routes
  if (startsWithRoute(pathname, OWNER_ROUTES)) {
    if (!userRole) {
      return NextResponse.redirect(
        new URL(`${authUrl}/select-role`, request.url),
      );
    }
    if (!hasAccess(userRole.toLowerCase(), "pet_owner")) {
      return NextResponse.redirect(
        new URL(`${authUrl}/unauthorized`, request.url),
      );
    }
  }

  // Pet Sitter routes
  if (startsWithRoute(pathname, SITTER_ROUTES)) {
    if (!userRole) {
      return NextResponse.redirect(
        new URL(`${authUrl}/select-role`, request.url),
      );
    }
    if (!hasAccess(userRole.toLowerCase(), "pet_sitter")) {
      return NextResponse.redirect(
        new URL(`${authUrl}/unauthorized`, request.url),
      );
    }
  }

  // Pet School routes
  if (startsWithRoute(pathname, SCHOOL_ROUTES)) {
    if (!userRole) {
      return NextResponse.redirect(
        new URL(`${authUrl}/select-role`, request.url),
      );
    }
    if (!hasAccess(userRole.toLowerCase(), "pet_school")) {
      return NextResponse.redirect(
        new URL(`${authUrl}/unauthorized`, request.url),
      );
    }
  }

  // Pet Hotel routes
  if (startsWithRoute(pathname, HOTEL_ROUTES)) {
    if (!userRole) {
      return NextResponse.redirect(
        new URL(`${authUrl}/select-role`, request.url),
      );
    }
    if (!hasAccess(userRole.toLowerCase(), "pet_hotel")) {
      return NextResponse.redirect(
        new URL(`${authUrl}/unauthorized`, request.url),
      );
    }
  }

  // User routes
  // if (startsWithRoute(pathname, USER_ROUTES)) {
  //   if (!userRole) {
  //     return NextResponse.redirect(new URL(`${authUrl}/select-role`, request.url));
  //   }
  //   if (!hasAccess(userRole.toLowerCase(), "user")) {
  //     return NextResponse.redirect(new URL(`${authUrl}/unauthorized`, request.url));
  //   }
  // }

  return NextResponse.next();
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
