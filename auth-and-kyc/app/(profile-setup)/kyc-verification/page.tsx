"use client";

import Image from "next/image";
import petzyLogo from "@/public/images/logo.png";
import Link from "next/link";
import { useKYCForm } from "@/hooks/useKYCForm";
import Step1 from "@/components/profile/kyc-verification/Step1";
import Step2 from "@/components/profile/kyc-verification/Step2";
import Step3 from "@/components/profile/kyc-verification/Step3";
import Step4 from "@/components/profile/kyc-verification/Step4";
import Step5 from "@/components/profile/kyc-verification/Step5";
import KYCHeader from "@/components/profile/kyc-verification/KYCHeader";
import KYCStepper from "@/components/profile/kyc-verification/KYCStepper";
import KYCNavigation from "@/components/profile/kyc-verification/KYCNavigation";
import KYCTrustBadges from "@/components/profile/kyc-verification/KYCTrustBadges";
import KYCErrorDisplay from "@/components/profile/kyc-verification/KYCErrorDisplay";

export default function KycVerificationPage() {
  const {
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
    updateFormData,
  } = useKYCForm();

  if (isKycStatusLoading && session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f4f8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 formData={formData} updateFormData={updateFormData} />;
      case 2: return <Step2 formData={formData} updateFormData={updateFormData} />;
      case 3: return <Step3 formData={formData} updateFormData={updateFormData} />;
      case 4: return <Step4 formData={formData} updateFormData={updateFormData} />;
      case 5: return <Step5 formData={formData} fieldErrors={fieldErrors} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f4f8] flex flex-col py-[72px] px-4 sm:px-6 lg:px-8 font-arimo relative overflow-clip">
      <div className="max-w-[1320px] w-full mx-auto relative z-10">
        <Link href="/" className="inline-block mb-12">
          <Image src={petzyLogo} alt="Logo" width={92} height={38} priority />
        </Link>

        <div className="bg-[rgba(255,255,255,0.5)] border-[3px] border-white rounded-[32px] shadow-[0px_0px_75px_0px_rgba(255,113,118,0.15)] backdrop-blur-sm p-8 md:p-12 lg:px-[112px] flex flex-col items-center">
          <KYCHeader />

          <KYCStepper currentStep={currentStep} />

          <div className="w-full max-w-[720px] space-y-10">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {renderStep()}
            </div>

            <KYCErrorDisplay error={error} errors={errors} />

            <KYCNavigation 
              currentStep={currentStep} 
              loading={loading} 
              onPrevious={handlePrevious} 
              onNext={handleNext} 
            />

            <KYCTrustBadges />
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] bg-[#ff7176]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[25vw] h-[25vw] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
