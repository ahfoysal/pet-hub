"use client";

import { useSession } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store/hooks";
import { updateUser } from "@/redux/features/slice/authSlice";
import Toast from "@/components/ui/Toast";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useCompleteHotelProfileMutation } from "@/redux/features/api/profile/ProfileSetupApi";
import { Settings } from "lucide-react";
import { User } from "@/types/user/userType";
import { handleApiError } from "@/lib/errorHandler";
import {
  validateHotelProfileSettingsForm,
  HotelProfileSettingsFormData,
} from "@/lib/validators/profile/hotelProfileValidation";
import { z } from "zod";

export default function HotelProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [completeProfile, { isLoading }] = useCompleteHotelProfileMutation();

  const [formData, setFormData] = useState<HotelProfileSettingsFormData>(() => {
    return {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      description: "",
      streetAddress: "",
      city: "",
      country: "",
      postalCode: "",
      dayStartingTime: "",
      dayEndingTime: "",
      nightStartingTime: "",
      nightEndingTime: "",
      images: [],
    };
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Handle text inputs
  const handleChange = (
    name: keyof HotelProfileSettingsFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle phone number input
  const handlePhoneChange = (value?: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value || "",
    }));
  };

  // Handle description textarea
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    handleChange("description", e.target.value);
  };

  // Handle file input (single image, but we'll manage multiple)
  const handleFileChange = (file: File | null) => {
    if (file) {
      // Add to existing images array, but limit to 5
      if (formData.images.length < 5) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
        }));
      } else {
        setToastMessage("Maximum 5 images allowed");
        setToastType("error");
        setShowToast(true);
      }
    }
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate form data with Zod
      const validationErrors = validateHotelProfileSettingsForm(formData);

      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      // Prepare form data for submission
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("description", formData.description);
      payload.append("streetAddress", formData.streetAddress);
      payload.append("city", formData.city);
      payload.append("country", formData.country);
      payload.append("postalCode", formData.postalCode);
      payload.append("dayStartingTime", formData.dayStartingTime);
      payload.append("dayEndingTime", formData.dayEndingTime);
      payload.append("nightStartingTime", formData.nightStartingTime);
      payload.append("nightEndingTime", formData.nightEndingTime);

      // Append images if available
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          payload.append("images", image);
        });
      }

      // Call the RTK Query mutation
      const result = await completeProfile(payload);

      if ("error" in result) {
        const errorData = result.error;
        if (
          errorData &&
          "data" in errorData &&
          errorData.data &&
          typeof errorData.data === "object" &&
          "message" in errorData.data
        ) {
          const errorResponse = errorData.data as { message?: string };
          throw new Error(errorResponse.message || "Profile setup failed");
        } else {
          throw new Error("Profile setup failed");
        }
      }

      // Check if the response has success: false
      const responseData = result.data as
        | { success?: boolean; message?: string }
        | undefined;
      if (
        responseData &&
        responseData.success === false &&
        responseData.message
      ) {
        // Show error toast with the exact backend message instead of redirecting
        setToastMessage(responseData.message);
        setToastType("error");
        setShowToast(true);
        setError(responseData.message);
        return; // Don't proceed with success actions
      }

      // Show success toast
      setToastMessage("Profile updated successfully!");
      setToastType("success");
      setShowToast(true);

      // Update Redux store with the updated user data
      if (session?.user) {
        // Create a complete user object by merging session data with form data
        const updatedUser: User = {
          _id: session.user.id,
          name: formData.name || session.user.name || "",
          email: formData.email || session.user.email || "",
          role: session.user.role || "",
          image: session.user.image || "",
        };
        dispatch(updateUser(updatedUser));
      }

      router.push("/kyc-verification");
    } catch (err: unknown) {
      console.error("Profile setup error:", err);

      // Handle Zod validation errors specifically
      if (err instanceof z.ZodError) {
        const zodErrorMessage = err.issues[0]?.message || "Validation failed";
        setToastMessage(zodErrorMessage);
        setToastType("error");
        setShowToast(true);
        setError(zodErrorMessage);
      } else {
        const errorMessage = handleApiError(err);
        setToastMessage(errorMessage);
        setToastType("error");
        setShowToast(true);
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Form */}
      <>
        <div className="bg-white py-4 px-4 rounded-xl border border-card-border">
          <div className="px-4 flex items-start space-x-6">
            <div className="bg-linear-to-b from-[#FF6900] to-[#FF8A00] p-3 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div className="">
              <h3 className="font-semibold text-foreground text-xl space-y-2">
                Hotel Profile Information
              </h3>
              <p className="md:text-base text-[#4A5565] pt-2">
                Update your hotel profile details and information
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-white py-6 px-8 rounded-xl shadow-sm">
          {/* Error / Success */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          {/* Toast */}
          <Toast
            isVisible={showToast}
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              label="Hotel Name"
              placeholder="Enter your hotel name"
              value={formData.name}
              labelClass="text-foreground"
              className="rounded-xl bg-[#F9FAFB] border-border"
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email Address
                <span className="text-xs text-gray-500 ml-2">
                  (from your account)
                </span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                labelClass="text-foreground"
                className="rounded-xl bg-[#F9FAFB] border-border"
                readOnly
              />
            </div>

            <PhoneNumberInput
              label="Phone Number"
              value={formData.phone}
              onChange={handlePhoneChange}
              error={error && formData.phone ? error : ""}
              containerClassName="rounded-xl bg-[#F9FAFB] border-border"
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 cursor-pointer">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Describe your hotel..."
                required
                rows={4}
                className="block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="city"
                label="City"
                placeholder="Enter your city"
                value={formData.city}
                labelClass="text-foreground"
                className="rounded-xl bg-[#F9FAFB] border-border"
                onChange={(e) => handleChange("city", e.target.value)}
              />

              <Input
                id="country"
                label="Country"
                placeholder="Enter your country"
                value={formData.country}
                labelClass="text-foreground"
                className="rounded-xl bg-[#F9FAFB] border-border"
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>

            <Input
              id="postalCode"
              label="Postal Code"
              placeholder="Enter your postal code"
              value={formData.postalCode}
              labelClass="text-foreground"
              className="rounded-xl bg-[#F9FAFB] border-border"
              onChange={(e) => handleChange("postalCode", e.target.value)}
            />

            <Input
              id="streetAddress"
              label="Street Address"
              placeholder="Enter your street address"
              value={formData.streetAddress}
              labelClass="text-foreground"
              className="rounded-xl bg-[#F9FAFB] border-border"
              onChange={(e) => handleChange("streetAddress", e.target.value)}
            />

            {/* Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Day Shift Starting Time (HH:mm)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="time"
                  value={formData.dayStartingTime}
                  onChange={(e) =>
                    handleChange("dayStartingTime", e.target.value)
                  }
                  className="block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Day Shift Ending Time (HH:mm)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="time"
                  value={formData.dayEndingTime}
                  onChange={(e) =>
                    handleChange("dayEndingTime", e.target.value)
                  }
                  className="block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Night Shift Starting Time (HH:mm)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="time"
                  value={formData.nightStartingTime}
                  onChange={(e) =>
                    handleChange("nightStartingTime", e.target.value)
                  }
                  className="block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Night Shift Ending Time (HH:mm)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="time"
                  value={formData.nightEndingTime}
                  onChange={(e) =>
                    handleChange("nightEndingTime", e.target.value)
                  }
                  className="block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Hotel Images
                <span className="text-xs text-gray-500 ml-2">
                  (PNG, JPG up to 5MB each, maximum 5 images)
                </span>
              </label>

              {/* Display selected images */}
              {formData.images.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File upload */}
              <FileUpload
                label="Upload Image"
                description={`Select an image (${formData.images.length}/5)`}
                acceptedTypes="image/*"
                maxSizeMB={5}
                onFileSelect={handleFileChange}
                className="rounded-xl bg-[#F9FAFB] border-border"
                preview={false}
              />

              {formData.images.length >= 5 && (
                <p className="text-sm text-gray-500 mt-2">
                  Maximum 5 images reached
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-linear-to-r from-[#FF6900] to-[#FF8A00] text-white py-3 rounded-xl cursor-pointer
                        font-medium text-sm hover:opacity-90 transition
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                        disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </>
    </div>
  );
}
