import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    image?: string;
    hasProfile?: boolean;
    isProfileCompleted?: boolean;
    accessToken: string;
    refreshToken?: string; // server-only
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: RoleType;
      isProfileCompleted?: boolean;
    } & DefaultSession["user"];
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
    isProfileCompleted?: boolean;
    accessTokenExpires?: number;
  }
}
