import { z } from "zod";

// Define a schema for the sitter profile settings form
export const sitterProfileSettingsSchema = z.object({
  designation: z.string().min(1, "Designation is required"),
  bio: z.string().min(1, "Bio is required"),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience must be 0 or greater")
    .max(50, "Years of experience cannot exceed 50"),
  languages: z
    .array(z.string())
    .min(1, "At least one language is required")
    .max(5, "Maximum 5 languages allowed"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().min(1, "Phone number is required"),
});

// Infer the type from the schema
export type SitterProfileSettingsFormData = z.infer<typeof sitterProfileSettingsSchema>;

// Export a function to validate the entire form
export const validateSitterProfileSettingsForm = (
  data: SitterProfileSettingsFormData,
): string[] => {
  try {
    sitterProfileSettingsSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return ["Validation failed"];
  }
};

// Helper function to get validation errors for a specific field
export const getSitterProfileFieldError = (
  data: SitterProfileSettingsFormData,
  fieldName: keyof SitterProfileSettingsFormData,
): string[] => {
  try {
    sitterProfileSettingsSchema.shape[fieldName].parse(data[fieldName]);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return [`Invalid ${String(fieldName)} value`];
  }
};