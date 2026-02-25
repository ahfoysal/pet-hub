// Define the role types as specified in the API
export type KycRoleType = "SCHOOL" | "HOTEL" | "VENDOR" | "PET_SITTER";

export interface FormData {
  // Personal Information
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  image: File | undefined;

  // Identification
  identificationType: "NID" | "PASSPORT" | "DRIVING_LICENSE";
  identificationNumber: string;
  identificationFrontImage: File | undefined;
  identificationBackImage: File | undefined;
  signatureImage: File | undefined;

  // Contact Information
  phoneNumber: string;
  presentAddress: string;
  permanentAddress: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  // Role Type - Array of role types as specified in API
  roleType: KycRoleType[];
}

// kyc submit type

export interface KycData {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth: string; // ISO date string
  gender: "Male" | "Female" | "Other";
  nationality: string;

  image: string;
  identificationType: "NID" | "PASSPORT" | "DRIVING_LICENSE";
  identificationNumber: string;
  identificationFrontImage: string;
  identificationBackImage: string;
  signatureImage: string;

  phoneNumber: string;
  presentAddress: string;
  permanentAddress: string;

  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  roleType: KycRoleType;
  status: "PENDING" | "APPROVED" | "REJECTED";

  reviewedBy: string | null;
  reviewedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface KycSubmitResponse {
  success: true;
  message: string;
  data: KycData;
}

export interface KycStatusResponse {
  success: true;
  message: string;
  data: KycData;
}
