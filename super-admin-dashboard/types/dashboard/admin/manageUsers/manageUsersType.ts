export type SuspendDuration =
  | "ONE_DAY"
  | "THREE_DAYS"
  | "ONE_WEEK"
  | "TWO_WEEKS"
  | "ONE_MONTH"
  | "THREE_MONTHS"
  | "SIX_MONTHS"
  | "ONE_YEAR";

export const SUSPEND_DURATION_LABELS: Record<SuspendDuration, string> = {
  ONE_DAY: "1 Day",
  THREE_DAYS: "3 Days",
  ONE_WEEK: "1 Week",
  TWO_WEEKS: "2 Weeks",
  ONE_MONTH: "1 Month",
  THREE_MONTHS: "3 Months",
  SIX_MONTHS: "6 Months",
  ONE_YEAR: "1 Year",
};

// ── Platform User ───────────────────────────────────────────────
export interface PlatformUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  image: string | null;
  phone: string;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: PlatformUser[];
}

export interface GetSingleUserResponse {
  success: boolean;
  message: string;
  data: PlatformUser;
}

// ── Banned / Suspended ──────────────────────────────────────────
export interface BannedUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  banReason: string;
}

export interface SuspendedUser {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  suspendUntil: string;
  suspendReason: string;
}

// ── Request Types ───────────────────────────────────────────────
export interface BanUserRequest {
  userId: string;
  reason: string;
}

export interface SuspendUserRequest {
  userId: string;
  reason: string;
  suspendDuration: SuspendDuration;
}

// ── Response Types ──────────────────────────────────────────────
export interface ActionResponse {
  success: boolean;
  message: string;
}

export interface GetBannedUsersResponse {
  success: boolean;
  message: string;
  data: {
    data: BannedUser[];
    nextCursor: string | null;
  };
}

export interface GetSuspendedUsersResponse {
  success: boolean;
  message: string;
  data: {
    data: SuspendedUser[];
    nextCursor: string | null;
  };
}
