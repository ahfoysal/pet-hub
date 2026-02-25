"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface KYCNavigationProps {
  currentStep: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function KYCNavigation({ currentStep, loading, onPrevious, onNext }: KYCNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-10">
      {currentStep > 1 ? (
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 px-6 py-3 text-[16px] font-medium text-[#4a5565] hover:text-[#ff7176] transition-colors group"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Previous
        </button>
      ) : <div />}

      <button
        onClick={onNext}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-8 py-3 bg-[#ff7176] text-white rounded-[14px] text-[16px] font-normal hover:opacity-90 transition-all shadow-sm group min-w-[160px]"
      >
        {loading ? "Submitting..." : currentStep === 5 ? "Submit" : "Next Step"}
        {!loading && <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
      </button>
    </div>
  );
}
