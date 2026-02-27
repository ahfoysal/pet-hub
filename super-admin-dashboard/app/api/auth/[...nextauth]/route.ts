// app/api/auth/[...nextauth]/route.ts — Super Admin Dashboard
// Figma Node: N/A — Infrastructure
// Purpose: READ-ONLY NextAuth handler. Does NOT have login providers.
// Reads the shared JWT cookie set by auth-and-kyc on `.lvh.me` domain.
// This dashboard is for ADMIN role only.

import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const COOKIE_DOMAIN = IS_PRODUCTION ? undefined : ".lvh.me";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  // Point sign-in to the central auth server
  pages: {
    signIn: process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000",
  },

  // CRITICAL: Same cookie config as auth-and-kyc so we read the same JWT
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: IS_PRODUCTION,
        domain: COOKIE_DOMAIN,
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: IS_PRODUCTION,
        domain: COOKIE_DOMAIN,
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: IS_PRODUCTION,
        domain: COOKIE_DOMAIN,
      },
    },
  },

  // NO providers — this dashboard does NOT handle login
  providers: [],

  callbacks: {
    async jwt({ token }) {
      // Just pass through the token from the shared cookie
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.role = token.role as string;
      session.user.image = token.image as string;
      session.user.isProfileCompleted = token.isProfileCompleted as boolean;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
