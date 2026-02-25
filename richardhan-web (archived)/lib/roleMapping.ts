import { RoleType, KycRoleType } from "@/types/user";

export const mapUserRoleToKycRole = (
  userRole: RoleType | undefined,
): KycRoleType | null => {
  if (!userRole) return null;

  const roleMapping: Record<RoleType, KycRoleType | null> = {
    PET_OWNER: null, // PET_OWNER doesn't have KYC
    PET_SITTER: "PET_SITTER",
    PET_SCHOOL: "SCHOOL",
    PET_HOTEL: "PET_HOTEL",
    VENDOR: "VENDOR",
    ADMIN: null, // ADMIN doesn't have KYC
  };

  return roleMapping[userRole] || null;
};
