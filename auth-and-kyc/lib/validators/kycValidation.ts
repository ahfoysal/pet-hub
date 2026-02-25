import { z } from "zod";

// Define the role types enum
export const KycRoleTypeEnum = z.enum(["SCHOOL", "HOTEL", "VENDOR", "PET_SITTER", "PET_HOTEL"]);

// Define the identification type enum
export const IdentificationTypeEnum = z.enum(["NID", "PASSPORT", "DRIVING_LICENSE"]);

// Zod schema for Step 1 (Identity Information)
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Please enter your full name"),
  phoneNumber: z.string().min(1, "Please enter your phone number"),
  email: z.string().email("Please enter a valid email address"),
  dateOfBirth: z.string().optional(),
  identificationFrontImage: z.any().optional(), // File validation is handled in Step 5 or via custom check
  identificationBackImage: z.any().optional(),
});

// Zod schema for Step 2 (Business Information)
export const businessInfoSchema = z.object({
  businessName: z.string().min(1, "Please enter your business name"),
  businessRegistrationNumber: z.string().min(1, "Please enter your business registration number"),
  businessAddress: z.string().min(1, "Please enter your business address"),
  // Files are optional for the step-specific Zod check to avoid 'instanceof File' issues with SSR/rehydration
});

// Zod schema for Step 3 (Pet Hotel License)
export const licenseInfoSchema = z.object({
  licenseNumber: z.string().min(1, "Please enter your license number"),
  // Dates are optional in Step 3 UI
});

// Zod schema for Step 4 (Facility Verification)
export const facilityInfoSchema = z.object({
  // All fields are optional or files in Step 4
});

// Combined schema for the entire form
export const kycFormSchema = z.object({
  // Personal Information
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  image: z.union([z.instanceof(File), z.null()]).optional(),

  // Identification
  identificationType: IdentificationTypeEnum,
  identificationNumber: z.string().optional(),
  identificationFrontImage: z.union([z.instanceof(File), z.null()]).optional(),
  identificationBackImage: z.union([z.instanceof(File), z.null()]).optional(),
  signatureImage: z.union([z.instanceof(File), z.null()]).optional(),

  // Contact Information
  phoneNumber: z.string().min(1, "Phone number is required"),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  roleType: KycRoleTypeEnum, // Single role type as string

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

// Schema for step-specific validation
export const stepSchemas = [
  personalInfoSchema,
  businessInfoSchema,
  licenseInfoSchema,
  facilityInfoSchema,
];

// Type inference from Zod schemas
export type KycFormDataType = z.infer<typeof kycFormSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type BusinessInfoData = z.infer<typeof businessInfoSchema>;
export type LicenseInfoData = z.infer<typeof licenseInfoSchema>;
export type FacilityInfoData = z.infer<typeof facilityInfoSchema>;
// IdentificationData, ContactInfoData, and EmergencyContactData are deprecated in favor of step-specific schemas

// Validation functions
export const validateStep = (formData: KycFormDataType, step: number): string[] => {
  // Step 5 is the review/submit step - validate the complete form
  if (step === 5) {
    return validateCompleteForm(formData);
  }
  
  // Validate specific step (1-4)
  try {
    stepSchemas[step - 1].parse(formData);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return ["Validation failed"];
  }
};

export const validateCompleteForm = (formData: KycFormDataType): string[] => {
  try {
    kycFormSchema.parse(formData);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return ["Validation failed"];
  }
};

// Field name mapping for user-friendly display
const fieldLabels: Record<string, string> = {
  fullName: "Full Name",
  email: "Email Address",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
  nationality: "Nationality",
  image: "Profile Photo",
  identificationType: "Identification Type",
  identificationNumber: "Identification Number",
  identificationFrontImage: "ID Front Image",
  identificationBackImage: "ID Back Image",
  signatureImage: "Signature Image",
  phoneNumber: "Phone Number",
  presentAddress: "Present Address",
  permanentAddress: "Permanent Address",
  roleType: "Role Type",
  emergencyContactName: "Emergency Contact Name",
  emergencyContactRelation: "Relationship",
  emergencyContactPhone: "Emergency Contact Phone",
};

// Helper function to get validation errors for a specific field
export const getFieldErrors = (formData: KycFormDataType, fieldName: keyof KycFormDataType): string[] => {
  try {
    kycFormSchema.shape[fieldName].parse(formData[fieldName]);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => {
        const fieldLabel = fieldLabels[fieldName] || String(fieldName);
        return `${fieldLabel}: ${issue.message}`;
      });
    }
    const fieldLabel = fieldLabels[fieldName] || String(fieldName);
    return [`${fieldLabel}: Invalid value`];
  }
};

// Enhanced validation function that provides contextual error messages
export const validateStepWithContext = (formData: KycFormDataType, step: number): string[] => {
  const errors = validateStep(formData, step);
  
  // Add step-specific context to error messages
  const stepNames = [
    "Identity Information",
    "Business Information",
    "Pet Hotel License",
    "Facility Verification",
    "Review & Submit"
  ];
  
  const stepName = stepNames[step - 1] || `Step ${step}`;
  
  return errors.map(error => `${stepName} - ${error}`);
};

// Specific validation for the final submission step
export const validateSubmissionStep = (formData: KycFormDataType): string[] => {
  const errors = validateCompleteForm(formData);
  
  // Add more specific messaging for submission step
  return errors.map(error => {
    if (error.includes("required")) {
      return `Missing required information: ${error}`;
    }
    return `Validation error: ${error}`;
  });
};