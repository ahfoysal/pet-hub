import { z } from "zod";

// Define a schema for the hotel profile settings form
export const hotelProfileSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  description: z.string().min(1, "Description is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  dayStartingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  dayEndingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  nightStartingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  nightEndingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  images: z.array(z.instanceof(File)).max(5, "Maximum 5 images allowed"),
});

// Infer the type from the schema
export type HotelProfileSettingsFormData = z.infer<typeof hotelProfileSettingsSchema>;

// Export a function to validate the entire form
export const validateHotelProfileSettingsForm = (
  data: HotelProfileSettingsFormData,
): string[] => {
  try {
    hotelProfileSettingsSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return ["Validation failed"];
  }
};

// Helper function to get validation errors for a specific field
export const getHotelProfileFieldError = (
  data: HotelProfileSettingsFormData,
  fieldName: keyof HotelProfileSettingsFormData,
): string[] => {
  try {
    hotelProfileSettingsSchema.shape[fieldName].parse(data[fieldName]);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message);
    }
    return [`Invalid ${String(fieldName)} value`];
  }
};