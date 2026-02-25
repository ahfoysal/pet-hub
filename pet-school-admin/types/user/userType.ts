// User-specific types
export type RoleType =
  | "PET_OWNER"
  | "PET_SITTER"
  | "PET_SCHOOL"
  | "PET_HOTEL"
  | "VENDOR"
  | "ADMIN";

// KYC-specific role types that match API specification
export type KycRoleType =
  | "SCHOOL"
  | "HOTEL"
  | "VENDOR"
  | "PET_HOTEL"
  | "PET_SITTER";
export interface User {
  _id: string;
  phone?: string;
  email: string;
  role?: RoleType;
  // createdAt: string;
  // updatedAt: string;
  name: string;
  image: string;
  accessToken?: string;
}
