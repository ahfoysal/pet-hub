/**
 * Represents the status of the KYC verification process.
 */
export type KYCStatus = "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED";

/**
 * Represents the role type associated with the user.
 */
export type RoleType = "SCHOOL" | "HOTEL" | "VENDOR" | "PET_SITTER";

export interface KYCData {
  id: string; // UUID
  userId: string; // UUID
  fullName: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: "Male" | "Female" | "Other";
  nationality: string;
  image: string; // URL
  identificationType: "NID" | "Passport" | "Driving License";
  identificationNumber: string;
  identificationFrontImage: string; // URL
  identificationBackImage: string; // URL
  signatureImage: string; // URL
  phoneNumber: string;
  presentAddress: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  roleType: RoleType;
  status: KYCStatus;
  reviewedBy: string | null;
  reviewedAt: string | null; // ISO Date String
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface KYCResponse {
  success: boolean;
  message: string;
  data: KYCData[];
}
