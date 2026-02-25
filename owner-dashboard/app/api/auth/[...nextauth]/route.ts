import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn:
      process.env.NEXT_PUBLIC_AUTH_URL || "https://auth-pethub-rnc.vercel.app",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        accessToken: { type: "text" },
        refreshToken: { type: "text" },
      },

      async authorize(credentials) {
        let accessToken = credentials?.accessToken;
        let refreshToken = credentials?.refreshToken;
        let isProfileCompleted = false;

        // 1️ Normal email/password login
        if (credentials?.email && credentials?.password) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              credentials: "include",
            },
          );

          const data = await res.json();

          if (!res.ok || !data?.success) return null;

          accessToken = data.data.accessToken;
          refreshToken = data.data.refreshToken;
          isProfileCompleted = data.data.isProfileCompleted ?? false;
        }

        if (!accessToken) return null;

        // 2️ Always verify token with backend
        const meRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!meRes.ok) return null;

        const me = await meRes.json();

        return {
          id: me.data.id,
          email: me.data.email,
          name: me.data.fullName || me.data.userName,
          role: me.data.role,
          image: me.data.image,
          accessToken,
          refreshToken,
          isProfileCompleted: isProfileCompleted ?? false,
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
        token.hasProfile = user.hasProfile;
        token.isProfileCompleted = user.isProfileCompleted;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
      }

      // Still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
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
