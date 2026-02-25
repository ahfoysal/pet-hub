import { z } from "zod";

// Define a schema for the profile settings form
export const vendorProfileSettingsSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .transform(
      (val) => val.replace(/[^\d+]/g, ""), // remove spaces, (), -
    )
    .refine(
      (val) => /^\+[1-9]\d{1,14}$/.test(val),
      "Phone number must be a valid international number (e.g. +8801712345678)",
    ),

  email: z.string().email("Please enter a valid email address"),
  description: z.string().min(1, "Description is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  images: z.array(z.instanceof(File)).max(1, "Maximum 1 profile photo allowed"),
});

// Infer the type from the schema
export type VendorProfileSettingsFormData = z.infer<
  typeof vendorProfileSettingsSchema
>;

// Export a function to validate the entire form
export const validateProfileSettingsForm = (
  data: VendorProfileSettingsFormData,
): string[] => {
  try {
    vendorProfileSettingsSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return ["Validation failed"];
  }
};

// Helper function to get validation errors for a specific field
export const getProfileFieldError = (
  data: VendorProfileSettingsFormData,
  fieldName: keyof VendorProfileSettingsFormData,
): string[] => {
  try {
    vendorProfileSettingsSchema.shape[fieldName].parse(data[fieldName]);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return [`Invalid ${String(fieldName)} value`];
  }
};
