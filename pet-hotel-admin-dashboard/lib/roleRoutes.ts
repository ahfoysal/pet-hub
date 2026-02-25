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
  // PET_OWNER: "/profile-settings/owner",
  PET_SITTER: "/profile-settings/sitter",
  PET_SCHOOL: "/profile-settings/school",
  PET_HOTEL: "/profile-settings/hotel",
} as const;
export const SETTING_ROUTE_MAP = {
  VENDOR: "/vendor/settings",
  // PET_OWNER: "/owner/settings",
  PET_SITTER: "/sitter/settings",
  PET_SCHOOL: "/school/settings",
  PET_HOTEL: "/hotel/settings",
  ADMIN: "/admin/settings",
} as const;

export type UserRole = keyof typeof ROLE_ROUTE_MAP;

export const getRedirectPath = (role: string | null) => {
  if (!role) return "/select-role";

  const normalizedRole = role.toUpperCase();
  switch (normalizedRole) {
    case "ADMIN":
      return ROLE_ROUTE_MAP.ADMIN;
    case "VENDOR":
      return ROLE_ROUTE_MAP.VENDOR;
    case "PET_OWNER":
      return ROLE_ROUTE_MAP.PET_OWNER;
    case "PET_SITTER":
      return ROLE_ROUTE_MAP.PET_SITTER;
    case "PET_SCHOOL":
      return ROLE_ROUTE_MAP.PET_SCHOOL;
    case "PET_HOTEL":
      return ROLE_ROUTE_MAP.PET_HOTEL;
    default:
      return "/select-role";
  }
};

export const getRedirectProfilePath = (role: string | null) => {
  if (!role) return "/select-role";

  const normalizedRole = role.toUpperCase();
  switch (normalizedRole) {
    case "VENDOR":
      return PROFILE_ROUTE_MAP.VENDOR;
    // case "PET_OWNER":
    //   return PROFILE_ROUTE_MAP.PET_OWNER;
    case "PET_SITTER":
      return PROFILE_ROUTE_MAP.PET_SITTER;
    case "PET_SCHOOL":
      return PROFILE_ROUTE_MAP.PET_SCHOOL;
    case "PET_HOTEL":
      return PROFILE_ROUTE_MAP.PET_HOTEL;
    default:
      return "/select-role";
  }
};


export const getRedirectSettingPath = (role: string | null) => {
  if (!role) return "/select-role";

  const normalizedRole = role.toUpperCase();
  switch (normalizedRole) {
    case "VENDOR":
      return SETTING_ROUTE_MAP.VENDOR;
    // case "PET_OWNER":
    //   return SETTING_ROUTE_MAP.PET_OWNER;
    case "PET_SITTER":
      return SETTING_ROUTE_MAP.PET_SITTER;
    case "PET_SCHOOL":
      return SETTING_ROUTE_MAP.PET_SCHOOL;
    case "PET_HOTEL":
      return SETTING_ROUTE_MAP.PET_HOTEL;
    case "ADMIN":
      return SETTING_ROUTE_MAP.ADMIN;
    default:
      return "/select-role";
  }
};
