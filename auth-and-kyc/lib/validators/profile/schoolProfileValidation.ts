import { z } from "zod";

// Define a schema for the school profile settings form
export const schoolProfileSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must be in international format (e.g. +8801712345678)",
    ),
  email: z.string().email("Please enter a valid email address"),
  description: z.string().min(1, "Description is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  images: z.array(z.instanceof(File)).max(5, "Maximum 5 images allowed"),
});

// Infer the type from the schema
export type SchoolProfileSettingsFormData = z.infer<
  typeof schoolProfileSettingsSchema
>;

// Export a function to validate the entire form
export const validateSchoolProfileSettingsForm = (
  data: SchoolProfileSettingsFormData,
): string[] => {
  try {
    schoolProfileSettingsSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return ["Validation failed"];
  }
};

// Helper function to get validation errors for a specific field
export const getSchoolProfileFieldError = (
  data: SchoolProfileSettingsFormData,
  fieldName: keyof SchoolProfileSettingsFormData,
): string[] => {
  try {
    schoolProfileSettingsSchema.shape[fieldName].parse(data[fieldName]);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return [`Invalid ${String(fieldName)} value`];
  }
};