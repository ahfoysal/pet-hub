"use client";

import { useSession } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store/hooks";
import { updateUser } from "@/redux/features/slice/authSlice";
import Toast from "@/components/ui/Toast";
import Input from "@/components/ui/Input";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useCompletePetSitterProfileMutation } from "@/redux/features/api/profile/ProfileSetupApi";
import { Settings } from "lucide-react";
import { User } from "@/types/user/userType";
import { handleApiError } from "@/lib/errorHandler";
import Button from "@/components/ui/Button";
import {
  validateSitterProfileSettingsForm,
  SitterProfileSettingsFormData,
} from "@/lib/validators/profile/sitterProfileValidation";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";

export default function SitterProfileSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const [completeProfile, { isLoading }] =
    useCompletePetSitterProfileMutation();

  const [formData, setFormData] = useState<SitterProfileSettingsFormData>({
    designation: "",
    bio: "",
    yearsOfExperience: 0,
    languages: [],
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });

  const [newLanguage, setNewLanguage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Handle text inputs
  const handleChange = (
    name: keyof SitterProfileSettingsFormData,
    value: string | number,
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

  // Handle bio textarea
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange("bio", e.target.value);
  };

  // Handle years of experience number input
  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    handleChange("yearsOfExperience", value);
  };

  // Handle language input
  const handleAddLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages.includes(newLanguage.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang !== languageToRemove),
    }));
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate form data with Zod
      const validationErrors = validateSitterProfileSettingsForm(formData);

      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0]);
      }

      // Call the RTK Query mutation
      const result = await completeProfile(formData);

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
          name: session.user.name || "",
          email: session.user.email || "",
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
    <main className=" bg-background flex flex-col py-12 px-4 sm:px-6 lg:px-8  ">
      <Link href="/">
        <Image src={petzyLogo} alt="Logo" />
      </Link>
      <div
        className="w-[90vw] space-y-8 p-8 rounded-3xl border border-white mt-12 
                shadow-[0_0_4px_rgba(255,134,138,0.4)] mx-auto"
      >
        <div>
          <h2 className="mt-6 text-center text-xl md:text-3xl font-semibold text-foreground">
            Sitter Profile Information
          </h2>
          <p className="text-center text-base md:text-xl text-muted-foreground pt-1">
            Complete your profile information
          </p>
        </div>
        {/* Main Form */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white py-4 px-4 rounded-xl border border-card-border">
            <div className="px-4 flex items-start space-x-6">
              <div className="bg-linear-to-b from-[#FF6900] to-[#FF8A00] p-3 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div className="">
                <h3 className="font-semibold text-foreground text-xl space-y-2">
                  Pet Sitter Profile Information
                </h3>
                <p className="md:text-base text-[#4A5565] pt-2">
                  Update your pet sitter profile details and information
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
                id="designation"
                label="Designation"
                placeholder="Enter your designation (e.g., Dog Walker, Pet Sitter)"
                value={formData.designation}
                labelClass="text-foreground"
                className="rounded-xl bg-[#F9FAFB] border-border"
                onChange={(e) => handleChange("designation", e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-1 cursor-pointer">
                  Bio
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleBioChange}
                  placeholder="Tell us about yourself and your experience with pets..."
                  required
                  rows={4}
                  className="block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <Input
                id="yearsOfExperience"
                label="Years of Experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                value={formData.yearsOfExperience.toString()}
                labelClass="text-foreground"
                className="rounded-xl bg-[#F9FAFB] border-border"
                onChange={handleYearsChange}
              />

              <PhoneNumberInput
                label="Phone Number"
                value={formData.phone}
                onChange={handlePhoneChange}
                error={error && formData.phone ? error : ""}
                containerClassName="rounded-xl bg-[#F9FAFB] border-border"
              />

              {/* Languages Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Languages
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language"
                    className="flex-1 px-4 py-2 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLanguage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddLanguage}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Add
                  </Button>
                </div>
                {formData.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
          <div />
        </div>
      </div>
    </main>
  );
}
