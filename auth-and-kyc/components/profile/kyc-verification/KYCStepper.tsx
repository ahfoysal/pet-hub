"use client";

import { User, Home, IdCard, Shield, CheckCircle } from "lucide-react";

const steps = [
  { number: 1, title: "Identity Information", tagline: "Personal Details", icon: User },
  { number: 2, title: "Business Information", tagline: "Company Details", icon: Home },
  { number: 3, title: "Pet Hotel License", tagline: "Licensing", icon: IdCard },
  { number: 4, title: "Facility Verification", tagline: "Photos & Docs", icon: Shield },
  { number: 5, title: "Review & Submit", tagline: "Final Review", icon: CheckCircle },
];

interface KYCStepperProps {
  currentStep: number;
}

export default function KYCStepper({ currentStep }: KYCStepperProps) {
  return (
    <div className="flex justify-between items-start w-full max-w-[1100px] mb-[80px] overflow-x-auto no-scrollbar gap-4 md:gap-0">
      {steps.map((step) => (
        <div key={step.number} className="flex flex-col items-center min-w-[140px] group">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2 ${
            currentStep === step.number 
              ? "bg-[#ff7176] text-white shadow-[0px_0px_0px_0px_#ffedd4]" 
              : currentStep > step.number 
                ? "bg-green-500 text-white" 
                : "bg-[#e5e7eb] text-[#99a1af]"
          }`}>
            <span className="text-[16px] font-normal leading-none">{step.number}</span>
          </div>
          <p className={`text-[14px] font-normal transition-colors text-center ${
            currentStep === step.number ? "text-[#101828]" : "text-[#4a5565]"
          }`}>
            {step.title}
          </p>
          <p className="text-[12px] text-[#6a7282] font-normal text-center mt-1">
            {step.tagline}
          </p>
        </div>
      ))}
    </div>
  );
}
