"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import Link from "next/link";
import {
  User,
  IdCard,
  Phone,
  Home,
  CheckCircle,
  Lock,
  Shield,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Step1 from "@/components/profile/kyc-verification/Step1";
import Step2 from "@/components/profile/kyc-verification/Step2";
import Step3 from "@/components/profile/kyc-verification/Step3";
import Step4 from "@/components/profile/kyc-verification/Step4";
import Step5 from "@/components/profile/kyc-verification/Step5";
// import { FormData } from "@/types/profile/kycType";
// import { transformFormDataToDto } from "@/lib/kycUtils";
import {
  validateStepWithContext,
  validateSubmissionStep,
  KycFormDataType,
} from "@/lib/validators/kycValidation";
import { useSession } from "next-auth/react";
import { useKycSubmitMutation } from "@/redux/features/api/profile/kycSubmitApi";
import { useToast } from "@/contexts/ToastContext";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { getRedirectPath } from "@/lib/roleRoutes";
import { KycRoleType } from "@/types/user";
import { mapUserRoleToKycRole } from "@/lib/roleMapping";

export default function KycVerificationPage() {
  const session = useSession().data;
  const [kycSubmitApi] = useKycSubmitMutation();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KycFormDataType>({
    // Personal Information
    fullName: "",
    email: session?.user?.email || "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    image: undefined,

    // Identification
    identificationType: "NID",
    identificationNumber: "",
    identificationFrontImage: undefined,
    identificationBackImage: undefined,
    signatureImage: undefined,

    // Contact Information
    phoneNumber: "",
    presentAddress: "",
    permanentAddress: "",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",

    // Role Type
    roleType: mapUserRoleToKycRole(session?.user?.role) || "PET_SITTER", // Default fallback
  });
  const { fieldErrors, validateAllFields } = useFieldValidation(formData);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session?.user?.email || "",
        roleType: mapUserRoleToKycRole(session?.user?.role) || "PET_SITTER",
      }));
    }
  }, [session?.user?.email, session?.user?.role]);

  const steps = [
    {
      number: 1,
      title: "Identity Information",
      tagline: "Personal Details",
      icon: User,
      color: "text-orange-500 bg-orange-100",
    },
    {
      number: 2,
      title: "Identification Documents",
      tagline: "ID Verification",
      icon: IdCard,
      color: "text-blue-500 bg-blue-100",
    },
    {
      number: 3,
      title: "Contact Information",
      tagline: "Details",
      icon: Phone,
      color: "text-purple-500 bg-purple-100",
    },
    {
      number: 4,
      title: "Emergency Contact",
      tagline: "Information",
      icon: Home,
      color: "text-green-500 bg-green-100",
    },
    {
      number: 5,
      title: "Review & Submit",
      tagline: "Final Review",
      icon: CheckCircle,
      color: "text-pink-500 bg-pink-100",
    },
  ];

  const handleNext = async () => {
    setError("");
    setErrors([]);

    // Validate current step only with contextual errors
    let validationErrors =
      currentStep === 5
        ? validateSubmissionStep(formData)
        : validateStepWithContext(formData, currentStep);

    // Additional checks for step 5 (final submission)
    if (currentStep === 5) {
      const missingFiles = [];

      if (!formData.image) {
        missingFiles.push("Profile Photo");
      }
      if (!formData.identificationFrontImage) {
        missingFiles.push("ID Front Image");
      }
      if (!formData.identificationBackImage) {
        missingFiles.push("ID Back Image");
      }
      if (!formData.signatureImage) {
        missingFiles.push("Signature Image");
      }

      if (missingFiles.length > 0) {
        const fileError = `Missing required documents: ${missingFiles.join(", ")}`;
        validationErrors = [fileError, ...validationErrors];
      }
    }

    if (validationErrors.length > 0) {
      // For step 5, show field-level errors
      if (currentStep === 5) {
        validateAllFields(); // This will populate fieldErrors
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
      // Submit logic
      setLoading(true);
      try {
        const formDataToSend = new FormData();

        // Append text fields
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("dateOfBirth", formData.dateOfBirth);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("nationality", formData.nationality);
        formDataToSend.append(
          "identificationType",
          formData.identificationType,
        );
        formDataToSend.append(
          "identificationNumber",
          formData.identificationNumber,
        );
        formDataToSend.append("phoneNumber", formData.phoneNumber);
        formDataToSend.append("presentAddress", formData.presentAddress);
        formDataToSend.append("permanentAddress", formData.permanentAddress);
        formDataToSend.append(
          "emergencyContactName",
          formData.emergencyContactName,
        );
        formDataToSend.append(
          "emergencyContactRelation",
          formData.emergencyContactRelation,
        );
        formDataToSend.append(
          "emergencyContactPhone",
          formData.emergencyContactPhone,
        );

        // Append role type (single value)
        formDataToSend.append(
          "roleType",
          formData.roleType == "PET_HOTEL" ? "HOTEL" : formData.roleType,
        );

        // Append file fields if they exist
        if (formData.image) {
          formDataToSend.append("image", formData.image);
        }
        if (formData.identificationFrontImage) {
          formDataToSend.append(
            "identificationFrontImage",
            formData.identificationFrontImage,
          );
        }
        if (formData.identificationBackImage) {
          formDataToSend.append(
            "identificationBackImage",
            formData.identificationBackImage,
          );
        }
        if (formData.signatureImage) {
          formDataToSend.append("signatureImage", formData.signatureImage);
        }

        console.log("Submitting KYC FormData:", formDataToSend);

        const result = await kycSubmitApi(formDataToSend);

        if (!result.data) {
          throw new Error("Failed to submit KYC");
        }

        console.log("KYC submitted successfully:", result);

        // Show success toast
        if (result.data.message) {
          showToast(result.data.message, "success");
        } else {
          showToast("KYC submitted successfully!", "success");
        }

        // Redirect to dashboard or success page
        router.push(getRedirectPath(session?.user?.role));
      } catch (err: unknown) {
        console.error("KYC submission failed:", err);

        // Extract message directly from API response
        let errorMessage =
          "Failed to submit KYC information. Please try again.";
        let toastType: "success" | "error" | "info" | "warning" = "error";

        if (typeof err === "object" && err !== null) {
          const apiError = err as {
            data?: { message?: string; success?: boolean };
          };
          if (apiError.data?.message) {
            errorMessage = apiError.data.message;
            // Show success toast for successful submissions
            if (apiError.data.success === true) {
              toastType = "success";
            }
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        // Show toast with API response message
        showToast(errorMessage, toastType);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (newData: Partial<KycFormDataType>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    // Clear error when user makes changes
    if (error) setError("");
    if (errors.length > 0) setErrors([]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2 formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step3 formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4 formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5 formData={formData} fieldErrors={fieldErrors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF80] flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <Link href="/">
        <Image src={petzyLogo} alt="Logo" />
      </Link>

      <div className="flex flex-1 items-center justify-center mt-12 ">
        <div
          className="w-[90vw] space-y-8 p-2 md:p-8 rounded-3xl border border-white 
                shadow-[0_0_4px_rgba(255,134,138,0.4)] "
        >
          {" "}
          <div>
            <h2 className="mt-6 text-center text-xl md:text-3xl font-semibold text-foreground">
              KYC Verification
            </h2>
            <p className="text-center text-base md:text-xl text-muted-foreground pt-1">
              Complete KYC to list your services
            </p>
          </div>
          {/* Step Indicators */}
          <div className="flex justify-between items-center mt-8  w-full md:max-w-5xl mx-auto overflow-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center font-arimo overflow-auto min-w-48 md:min-w-fit"
                >
                  <div
                    className={`rounded-full w-10 h-10 flex items-center justify-center ${
                      currentStep === step.number
                        ? "bg-primary text-white"
                        : currentStep > step.number
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  <p
                    className={`text-md mt-1 text-center  ${
                      currentStep === step.number
                        ? " text-muted-foreground"
                        : " text-[#6A7282]"
                    } `}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm mt-1 text-center text-secondary">
                    {step.tagline}
                  </p>
                </div>
              );
            })}
          </div>
          {/* Step Content */}
          <div className="mt-8 w-full md:max-w-[80vw] xl:max-w-[50vw] mx-auto">
            {renderStep()}
          </div>
          {(error || errors.length > 0) && (
            <div className="mt-2 w-full md:max-w-[50vw] mx-auto bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center mb-2">
                <svg
                  className="h-5 w-5 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-red-800 font-medium">
                  Please fix the following issues:
                </h3>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {/* Show header error message if present (for step 5) */}
                {error && error !== "Please fix the following issues:" && (
                  <li className="flex items-start font-medium">• {error}</li>
                )}
                {errors.map((err, index) => (
                  <li key={index} className="flex items-start">
                    • {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 w-full md:max-w-[80vw] xl:max-w-[50vw] mx-auto">
            {currentStep > 1 && (
              <Button
                icon={<ChevronLeft className="h-5 w-5 mr-2" />}
                iconPosition="left"
                onClick={handlePrevious}
                className="text-sm font-medium text-primary hover:text-primary/90  rounded-xl"
              >
                Previous
              </Button>
            )}
            <Button
              text={
                loading
                  ? "Submitting..."
                  : currentStep === 5
                    ? "Submit"
                    : "Next"
              }
              icon={<ChevronRight className="h-5 w-5 mr-2" />}
              variant="primary"
              className="ml-auto rounded-xl "
              onClick={handleNext}
              disabled={loading}
            />
          </div>
          {/* Bottom Badges */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3  mt-8 w-full md:max-w-[80vw] xl:max-w-[50vw] mx-auto  pt-8 ">
            <div className="bg-white p-4 rounded-xl border-border flex items-center space-x-2 shadow-md ">
              <div className="flex items-center bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm">
                <Shield className="h-8 w-6 " />
              </div>
              <div className="mx-4">
                <h1 className="text-md">Secure Verification</h1>
                <h3 className="text-secondary text-sm">
                  Bank-level encryption
                </h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border-border flex items-center space-x-2 shadow-md">
              <div className="flex items-center bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm">
                <Lock className="h-8 w-6 " />
              </div>
              <div className="mx-4">
                <h1 className="text-md">Data Protected</h1>
                <h3 className="text-secondary text-sm">Privacy guaranteed</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border-border flex items-center space-x-2 shadow-md">
              <div className="flex items-center bg-purple-100 text-purple-600 px-3 py-2 rounded-lg text-sm">
                <CheckCircle className="h-8 w-6 " />
              </div>
              <div className="mx-4">
                <h1 className="text-md">Secure Verification</h1>
                <h3 className="text-secondary text-sm">2-3 business days</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
