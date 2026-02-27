// app/api/auth/[...nextauth]/route.ts
// Central SSO Auth Handler — the ONLY place where users can sign in.
// Sets JWT cookie on `.lvh.me` domain so all subdomains share the session.

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Cookie domain: ".lvh.me" for local dev, ".yourdomain.com" for production
const COOKIE_DOMAIN = IS_PRODUCTION ? undefined : ".lvh.me";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,

  // CRITICAL: Set cookie domain to root domain so all subdomains share it
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

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        code: { type: "text" },
        accessToken: { type: "text" },
        refreshToken: { type: "text" },
      },

      async authorize(credentials) {
        let accessToken: string | undefined;
        let refreshToken: string | undefined;
        let isProfileCompleted = false;

        // 1. Email/password login
        if (credentials?.email && credentials?.password) {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: credentials.email,
                  password: credentials.password,
                }),
              },
            );

            const data = await res.json();

            if (!res.ok || !data?.success) {
              throw new Error(data?.message || "Invalid credentials");
            }

            accessToken = data.data.accessToken;
            refreshToken = data.data.refreshToken;
            isProfileCompleted = data.data.isProfileCompleted ?? false;
            console.log("✅ SSO: Login successful for", credentials.email);
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Login failed";
            console.error("❌ SSO: Login error:", message);
            throw new Error(message);
          }
        }
        // 2. OTP verification login
        else if (credentials?.code) {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: credentials.code }),
              },
            );

            const data = await res.json();

            if (!res.ok || !data?.success) {
              throw new Error(data?.message || "Invalid OTP code");
            }

            accessToken = data.data.accessToken;
            refreshToken = data.data.refreshToken || "";
            console.log("✅ SSO: OTP verification successful");
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "OTP verification failed";
            console.error("❌ SSO: OTP error:", message);
            throw new Error(message);
          }
        }
        // 3. Token-based login (for role updates)
        else if (credentials?.accessToken) {
          accessToken = credentials.accessToken;
          refreshToken = credentials.refreshToken;
          console.log("✅ SSO: Token-based sign-in detected");
        }

        if (!accessToken) return null;

        // 3. Fetch user profile from backend
        const meRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        if (!meRes.ok) {
          console.error("❌ SSO: /auth/me failed with status:", meRes.status);
          return null;
        }

        const me = await meRes.json();

        return {
          id: me.data.id || me.data._id,
          email: me.data.email,
          name: me.data.fullName || me.data.userName || me.data.name,
          role: me.data.role,
          image: me.data.image,
          accessToken,
          refreshToken,
          isProfileCompleted: me.data.isProfileCompleted ?? isProfileCompleted ?? false,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
        token.isProfileCompleted = user.isProfileCompleted;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
      }

      // Token still valid → return as-is
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Token expired → refresh
      console.log("🔄 SSO: Refreshing access token...");
      return await refreshAccessToken(token);
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
