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

const SITTER_ROUTES = [
  "/sitter",
  "/sitter-dashboard",
  "/profile-settings/sitter",
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

  // 1. Process sync_token FIRST
  const syncToken = request.nextUrl.searchParams.get("sync_token");
  if (syncToken) {
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

  // 2. DEBUG BYPASS: Allow access even without token session for hydration
  if (pathname.startsWith("/sitter") || pathname.startsWith("/sitter-dashboard")) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.next();
  }

  const userRole = getUserRole(token.role);

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api/auth|.*\.png$|.*\.jpg$|.*\.jpeg$|.*\.svg$).*)"],
};

// Combining matchers (best practice) for more regular routes
// export const config = {
//   matcher: ["/dashboard/:path*", "/admin/:path*", "/moderator/:path*"],
// };
