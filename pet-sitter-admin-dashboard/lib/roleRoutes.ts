// lib/roleRoutes.ts
export const ROLE_ROUTE_MAP = {
  PET_SITTER: "/sitter",
} as const;

export const PROFILE_ROUTE_MAP = {
  PET_SITTER: "/profile-settings/sitter",
} as const;

export const SETTING_ROUTE_MAP = {
  PET_SITTER: "/sitter/settings",
} as const;

export type UserRole = keyof typeof ROLE_ROUTE_MAP;

export const getRedirectPath = (role: string | null) => {
  return ROLE_ROUTE_MAP.PET_SITTER;
};

export const getRedirectProfilePath = (role: string | null) => {
  return PROFILE_ROUTE_MAP.PET_SITTER;
};

export const getRedirectSettingPath = (role: string | null) => {
  return SETTING_ROUTE_MAP.PET_SITTER;
};
