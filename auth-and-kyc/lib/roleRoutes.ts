// lib/roleRoutes.ts
export const ROLE_ROUTE_MAP = {
  ADMIN: "/admin",
  VENDOR: "/vendor",
  PET_OWNER: "/owner",
  PET_SITTER: "/sitter",
  PET_SCHOOL: "/school",
  PET_HOTEL: "/hotel",
} as const;

export const PROFILE_ROUTE_MAP = {
  VENDOR: "/profile-settings/vendor",
  PET_SITTER: "/profile-settings/sitter",
  PET_SCHOOL: "/profile-settings/school",
  PET_HOTEL: "/profile-settings/hotel",
} as const;

export const SETTING_ROUTE_MAP = {
  VENDOR: "/vendor/settings",
  PET_SITTER: "/sitter/settings",
  PET_SCHOOL: "/school/settings",
  PET_HOTEL: "/hotel/settings",
  ADMIN: "/admin/settings",
} as const;

export type UserRole = keyof typeof ROLE_ROUTE_MAP;

const getBaseUrlForRole = (role: string): string => {
  switch (role) {
    case "ADMIN":
      return (
        process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL ||
        "https://admin-pethub-rnc.vercel.app"
      );
    case "VENDOR":
      return (
        process.env.NEXT_PUBLIC_VENDOR_DASHBOARD_URL ||
        "https://vendor-pethub-rnc.vercel.app"
      );
    case "PET_OWNER":
      return (
        process.env.NEXT_PUBLIC_OWNER_DASHBOARD_URL ||
        "https://owner-pethub-rnc.vercel.app"
      );
    case "PET_SITTER":
      return (
        process.env.NEXT_PUBLIC_SITTER_DASHBOARD_URL ||
        "https://sitter-pethub-rnc.vercel.app"
      );
    case "PET_SCHOOL":
      return (
        process.env.NEXT_PUBLIC_SCHOOL_DASHBOARD_URL ||
        "https://school-pethub-rnc.vercel.app"
      );
    case "PET_HOTEL":
      return (
        process.env.NEXT_PUBLIC_HOTEL_DASHBOARD_URL ||
        "https://hotel-pethub-rnc.vercel.app"
      );
    default:
      return "";
  }
};

export const getRedirectPath = (role: string | null) => {
  if (!role) return "/select-role";

  const normalizedRole = role.toUpperCase();
  const baseUrl = getBaseUrlForRole(normalizedRole);

  switch (normalizedRole) {
    case "ADMIN":
      return `${baseUrl}${ROLE_ROUTE_MAP.ADMIN}`;
    case "VENDOR":
      return `${baseUrl}${ROLE_ROUTE_MAP.VENDOR}`;
    case "PET_OWNER":
      return `${baseUrl}${ROLE_ROUTE_MAP.PET_OWNER}`;
    case "PET_SITTER":
      return `${baseUrl}${ROLE_ROUTE_MAP.PET_SITTER}`;
    case "PET_SCHOOL":
      return `${baseUrl}${ROLE_ROUTE_MAP.PET_SCHOOL}`;
    case "PET_HOTEL":
      return `${baseUrl}${ROLE_ROUTE_MAP.PET_HOTEL}`;
    default:
      return "/select-role";
  }
};

export const getRedirectProfilePath = (role: string | null) => {
  if (!role) {
    return "/select-role";
  }

  const normalizedRole = role.toUpperCase();

  if (normalizedRole === "ADMIN") {
    return getRedirectPath("ADMIN");
  }

  if (normalizedRole === "VENDOR") {
    return getRedirectPath("VENDOR");
  }

  if (normalizedRole === "PET_HOTEL" || normalizedRole === "HOTEL") {
    return getRedirectPath("PET_HOTEL");
  }

  if (normalizedRole === "PET_OWNER") {
    return getRedirectPath("PET_OWNER");
  }

  if (normalizedRole === "PET_SITTER") {
    return getRedirectPath("PET_SITTER");
  }

  if (normalizedRole === "PET_SCHOOL") {
    return getRedirectPath("PET_SCHOOL");
  }

  // Fallback for any other specific roles that might still need local KYC
  return "/kyc-verification";
};

export const getRedirectSettingPath = (role: string | null) => {
  if (!role) return "/select-role";

  const normalizedRole = role.toUpperCase();
  const baseUrl = getBaseUrlForRole(normalizedRole);

  switch (normalizedRole) {
    case "VENDOR":
      return `${baseUrl}${SETTING_ROUTE_MAP.VENDOR}`;
    case "PET_SITTER":
      return `${baseUrl}${SETTING_ROUTE_MAP.PET_SITTER}`;
    case "PET_SCHOOL":
      return `${baseUrl}${SETTING_ROUTE_MAP.PET_SCHOOL}`;
    case "PET_HOTEL":
      return `${baseUrl}${SETTING_ROUTE_MAP.PET_HOTEL}`;
    case "ADMIN":
      return `${baseUrl}${SETTING_ROUTE_MAP.ADMIN}`;
    default:
      return "/select-role";
  }
};
