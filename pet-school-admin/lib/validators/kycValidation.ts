import { z } from "zod";

// Define the role types enum
export const KycRoleTypeEnum = z.enum(["SCHOOL", "HOTEL", "VENDOR", "PET_SITTER", "PET_HOTEL"]);

// Define the identification type enum
export const IdentificationTypeEnum = z.enum(["NID", "PASSPORT", "DRIVING_LICENSE"]);

// Zod schema for personal information (Step 1)
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  dateOfBirth: z.string().min(1, "Please select your date of birth"),
  gender: z.string().min(1, "Please select your gender"),
  nationality: z.string().min(1, "Please enter your nationality"),
  image: z.instanceof(File, { message: "Please upload a profile photo" }).optional(),
});

// Zod schema for identification documents (Step 2)
export const identificationSchema = z.object({
  identificationType: IdentificationTypeEnum,
  identificationNumber: z.string().min(1, "Please enter your identification number"),
  identificationFrontImage: z.instanceof(File, { message: "Please upload the front side of your ID" }).optional(),
  identificationBackImage: z.instanceof(File, { message: "Please upload the back side of your ID" }).optional(),
  signatureImage: z.instanceof(File, { message: "Please upload your signature" }).optional(),
});

// Zod schema for contact information (Step 3)
export const contactInfoSchema = z.object({
  phoneNumber: z.string().min(1, "Please enter your phone number"),
  presentAddress: z.string().min(1, "Please enter your present address"),
  permanentAddress: z.string().min(1, "Please enter your permanent address"),
  roleType: KycRoleTypeEnum, // Single role type as string
});

// Zod schema for emergency contact (Step 4)
export const emergencyContactSchema = z.object({
  emergencyContactName: z.string().min(1, "Please enter emergency contact name"),
  emergencyContactRelation: z.string().min(1, "Please enter relationship with emergency contact"),
  emergencyContactPhone: z.string().min(1, "Please enter emergency contact phone number"),
});

// Combined schema for the entire form
export const kycFormSchema = z.object({
  // Personal Information
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  image: z.union([z.instanceof(File), z.null()]).optional(),

  // Identification
  identificationType: IdentificationTypeEnum,
  identificationNumber: z.string().min(1, "Identification number is required"),
  identificationFrontImage: z.union([z.instanceof(File), z.null()]).optional(),
  identificationBackImage: z.union([z.instanceof(File), z.null()]).optional(),
  signatureImage: z.union([z.instanceof(File), z.null()]).optional(),

  // Contact Information
  phoneNumber: z.string().min(1, "Phone number is required"),
  presentAddress: z.string().min(1, "Present address is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  roleType: KycRoleTypeEnum, // Single role type as string

  // Emergency Contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactRelation: z.string().min(1, "Emergency contact relation is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
});

// Schema for step-specific validation
export const stepSchemas = [
  personalInfoSchema,
  identificationSchema,
  contactInfoSchema,
  emergencyContactSchema,
];

// Type inference from Zod schemas
export type KycFormDataType = z.infer<typeof kycFormSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type IdentificationData = z.infer<typeof identificationSchema>;
export type ContactInfoData = z.infer<typeof contactInfoSchema>;
export type EmergencyContactData = z.infer<typeof emergencyContactSchema>;

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
    "Personal Information",
    "Identification Documents",
    "Contact Information",
    "Emergency Contact",
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