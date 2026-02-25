"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGetKycStatusQuery, useKycSubmitMutation } from "@/redux/features/api/profile/kycSubmitApi";
import { useToast } from "@/contexts/ToastContext";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { getRedirectPath } from "@/lib/roleRoutes";
import { mapUserRoleToKycRole } from "@/lib/roleMapping";
import { validateStepWithContext, validateSubmissionStep } from "@/lib/validators/kycValidation";

export function useKYCForm() {
  const session = useSession().data;
  const { data: kycStatus, isLoading: isKycStatusLoading } = useGetKycStatusQuery();
  const [kycSubmitApi] = useKycSubmitMutation();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: session?.user?.email || "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    image: undefined,
    identificationType: "NID",
    identificationNumber: "",
    identificationFrontImage: undefined,
    identificationBackImage: undefined,
    signatureImage: undefined,
    phoneNumber: "",
    presentAddress: "",
    permanentAddress: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    roleType: mapUserRoleToKycRole(session?.user?.role) || "PET_SITTER",
    businessName: "",
    businessRegistrationNumber: "",
    businessAddress: "",
    businessType: "HOTEL",
    hotelLicenseImage: undefined,
    facilityPhotos: [],
  });

  const { fieldErrors, validateAllFields } = useFieldValidation(formData as any);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev: any) => ({
        ...prev,
        fullName: prev.fullName || session?.user?.name || "",
        email: session?.user?.email || "",
        roleType: mapUserRoleToKycRole(session?.user?.role) || "PET_SITTER",
      }));
    }
  }, [session?.user?.email, session?.user?.role, session?.user?.name]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      const adminDest = getRedirectPath("ADMIN");
      window.location.href = `/api/sync?callbackUrl=${encodeURIComponent(adminDest)}`;
      return;
    }

    if (!isKycStatusLoading && kycStatus?.success && kycStatus?.data) {
      const status = kycStatus.data.status;
      if (status === "PENDING" || status === "APPROVED") {
        const dest = getRedirectPath(session?.user?.role);
        window.location.href = `/api/sync?callbackUrl=${encodeURIComponent(dest)}`;
      }
    }
  }, [kycStatus, isKycStatusLoading, session?.user]);

  const handleNext = async () => {
    setError("");
    setErrors([]);

    let validationErrors =
      currentStep === 5
        ? validateSubmissionStep(formData)
        : validateStepWithContext(formData, currentStep);

    if (currentStep === 5) {
      const missingFiles = [];
      if (!formData.identificationFrontImage) missingFiles.push("ID Front Image");
      if (!formData.identificationBackImage) missingFiles.push("ID Back Image");
      if (missingFiles.length > 0) {
        validationErrors = [`Missing required documents: ${missingFiles.join(", ")}`, ...validationErrors];
      }
    }

    if (validationErrors.length > 0) {
      if (currentStep === 5) {
        validateAllFields();
        setError("Please complete all required information before submitting:");
        setErrors(validationErrors);
      } else {
        setError(validationErrors[0]);
        setErrors(validationErrors);
      }
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("identificationType", formData.identificationType);
        formDataToSend.append("phoneNumber", formData.phoneNumber);

        if (formData.dateOfBirth) formDataToSend.append("dateOfBirth", formData.dateOfBirth);
        if (formData.gender) formDataToSend.append("gender", formData.gender);
        if (formData.nationality) formDataToSend.append("nationality", formData.nationality);
        if (formData.identificationNumber) formDataToSend.append("identificationNumber", formData.identificationNumber);
        if (formData.presentAddress) formDataToSend.append("presentAddress", formData.presentAddress);
        if (formData.permanentAddress) formDataToSend.append("permanentAddress", formData.permanentAddress);
        if (formData.emergencyContactName) formDataToSend.append("emergencyContactName", formData.emergencyContactName);
        if (formData.emergencyContactRelation) formDataToSend.append("emergencyContactRelation", formData.emergencyContactRelation);
        if (formData.emergencyContactPhone) formDataToSend.append("emergencyContactPhone", formData.emergencyContactPhone);

        formDataToSend.append("roleType", formData.roleType === "PET_HOTEL" ? "HOTEL" : formData.roleType);

        if (formData.image) formDataToSend.append("image", formData.image);
        if (formData.identificationFrontImage) formDataToSend.append("identificationFrontImage", formData.identificationFrontImage);
        if (formData.identificationBackImage) formDataToSend.append("identificationBackImage", formData.identificationBackImage);
        if (formData.signatureImage) formDataToSend.append("signatureImage", formData.signatureImage);

        if (formData.businessName) formDataToSend.append("businessName", formData.businessName);
        if (formData.businessRegistrationNumber) formDataToSend.append("businessRegistrationNumber", formData.businessRegistrationNumber);
        if (formData.businessAddress) formDataToSend.append("businessAddress", formData.businessAddress);
        if (formData.businessRegistrationCertificate) formDataToSend.append("businessRegistrationCertificate", formData.businessRegistrationCertificate);
        if (formData.hotelLicenseImage) formDataToSend.append("hotelLicenseImage", formData.hotelLicenseImage);
        if (formData.licenseNumber) formDataToSend.append("licenseNumber", formData.licenseNumber);
        if (formData.licenseIssueDate) formDataToSend.append("licenseIssueDate", formData.licenseIssueDate);
        if (formData.licenseExpiryDate) formDataToSend.append("licenseExpiryDate", formData.licenseExpiryDate);
        if (formData.hygieneCertificate) formDataToSend.append("hygieneCertificate", formData.hygieneCertificate);
        if (formData.facilityPhotos?.length > 0) {
          formData.facilityPhotos.forEach((file: any) => formDataToSend.append("facilityPhotos", file));
        }

        const result = await kycSubmitApi(formDataToSend);
        if (!result.data) throw new Error("Failed to submit KYC");
        showToast(result.data.message || "KYC submitted successfully!", "success");
        window.location.href = getRedirectPath(session?.user?.role);
      } catch (err: any) {
        let errorMessage = "Failed to submit KYC information. Please try again.";
        if (err?.data?.message) errorMessage = err.data.message;
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
    if (error) setError("");
    if (errors.length > 0) setErrors([]);
  };

  return {
    currentStep,
    formData,
    fieldErrors,
    error,
    errors,
    loading,
    isKycStatusLoading,
    session,
    handleNext,
    handlePrevious,
    updateFormData
  };
}
