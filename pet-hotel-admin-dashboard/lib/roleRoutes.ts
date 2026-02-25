// lib/roleRoutes.ts
export const ROLE_ROUTE_MAP = {
  PET_HOTEL: "/hotel",
} as const;

export const PROFILE_ROUTE_MAP = {
  PET_HOTEL: "/profile-settings/hotel",
} as const;

export const SETTING_ROUTE_MAP = {
  PET_HOTEL: "/hotel/settings",
} as const;

export type UserRole = keyof typeof ROLE_ROUTE_MAP;

export const getRedirectPath = (role: string | null) => {
  return ROLE_ROUTE_MAP.PET_HOTEL;
};

export const getRedirectProfilePath = (role: string | null) => {
  return PROFILE_ROUTE_MAP.PET_HOTEL;
};

export const getRedirectSettingPath = (role: string | null) => {
  return SETTING_ROUTE_MAP.PET_HOTEL;
};
