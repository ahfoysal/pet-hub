// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { AuthOptions } from "next-auth";

// export const authOptions: AuthOptions = {
//   session: { strategy: "jwt" },
//   pages: { signIn: process.env.NEXT_PUBLIC_AUTH_URL || "https://auth-pethub-rnc.vercel.app" },

//   providers: [
//     CredentialsProvider({
//       name: "Credentials",

//       credentials: {
//         email: { type: "email" },
//         password: { type: "password" },
//         accessToken: { type: "text" },
//         refreshToken: { type: "text" },
//       },

//       async authorize(credentials) {
//         let accessToken = credentials?.accessToken;
//         let refreshToken = credentials?.refreshToken;
//         let isProfileCompleted = false;

//         // 1️ Normal email/password login
//         if (credentials?.email && credentials?.password) {
//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 email: credentials.email,
//                 password: credentials.password,
//               }),
//               credentials: "include",
//             },
//           );

//           const data = await res.json();

//           if (!res.ok || !data?.success) return null;

//           accessToken = data.data.accessToken;
//           refreshToken = data.data.refreshToken;
//           isProfileCompleted = data.data.isProfileCompleted ?? false;
//         }

//         if (!accessToken) return null;

//         // 2️ Always verify token with backend
//         const meRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           },
//         );

//         if (!meRes.ok) return null;

//         const me = await meRes.json();

//         return {
//           id: me.data.id,
//           email: me.data.email,
//           name: me.data.fullName || me.data.userName,
//           role: me.data.role,
//           image: me.data.image,
//           accessToken,
//           refreshToken,
//           isProfileCompleted: isProfileCompleted ?? false,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.role = user.role;
//         token.image = user.image;
//         token.hasProfile = user.hasProfile;
//         token.isProfileCompleted = user.isProfileCompleted;
//         token.accessToken = user.accessToken;
//         token.refreshToken = user.refreshToken;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       session.user.id = token.id as string;
//       session.user.email = token.email as string;
//       session.user.name = token.name as string;
//       session.user.role = token.role as string;
//       session.user.image = token.image as string;
//       session.user.isProfileCompleted = token.isProfileCompleted as boolean;
//       session.accessToken = token.accessToken as string;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import { refreshAccessToken } from "@/lib/auth/refreshAccessToken";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        accessToken: { type: "text" },
        refreshToken: { type: "text" },
        code: { type: "text" },
      },

      async authorize(credentials) {
        let accessToken = credentials?.accessToken;
        let refreshToken = credentials?.refreshToken;
        let isProfileCompleted = false;

        // 1️ Normal email/password login
        if (credentials?.email && credentials?.password) {
          try {
            console.log("Attempting login payload:", {
              email: credentials.email,
              password: "***",
            });
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
            console.log("Backend login response status:", res.status);
            console.log("Backend login response data:", data);

            if (!res.ok || !data?.success) {
              throw new Error(data?.message || "Invalid credentials");
            }

            accessToken = data.data.accessToken;
            refreshToken = data.data.refreshToken;
            isProfileCompleted = data.data.isProfileCompleted ?? false;
            console.log("✅ AUTH SOURCE: Login successful for", credentials.email);
          } catch (error: any) {
            console.error("❌ AUTH SOURCE: Fetch error to backend /auth/login:", error);
            throw new Error(error.message || "An error occurred during login");
          }
        }
        // 1.5 OTP Login via verify-email
        else if (credentials?.code) {
          try {
            console.log("Attempting OTP login");
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: credentials.code }),
              },
            );

            const data = await res.json();
            console.log("Backend verify response status:", res.status);
            console.log("Backend verify response data:", data);

            if (!res.ok || !data?.success) {
              throw new Error(data?.message || "Invalid OTP code");
            }

            // verify-email now returns { accessToken, refreshToken }
            accessToken = data.data.accessToken;
            refreshToken = data.data.refreshToken || "";
          } catch (error: any) {
            console.error("Fetch error to backend /auth/verify-email:", error);
            throw new Error(
              error.message || "An error occurred during OTP verification",
            );
          }
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

        if (!meRes.ok) {
          console.error("Backend /auth/me failed with status:", meRes.status);
          return null;
        }

        const me = await meRes.json();
        console.log("Backend /auth/me data:", me);

        return {
          id: me.data.id || me.data._id,
          email: me.data.email,
          name: me.data.fullName || me.data.userName || me.data.name,
          role: me.data.role,
          image: me.data.image,
          accessToken,
          refreshToken,
          isProfileCompleted:
            me.data.isProfileCompleted ?? isProfileCompleted ?? false,
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
      console.log("🔄 AUTH SOURCE: Refreshing access token...");
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
