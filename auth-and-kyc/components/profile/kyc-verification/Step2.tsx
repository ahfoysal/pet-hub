import { Briefcase } from "lucide-react";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: any;
  updateFormData: (newData: any) => void;
}

export default function Step2({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-10">
      <InfoCard
        title="Business Information"
        description="Enter your business information exactly as it appears on your Business Registration Certificate. This is required to operate a pet hotel service."
        Icon={Briefcase}
        iconBg="linear-gradient(135deg, #51A2FF 0%, #2B7FFF 100%)"
      />

      <div className="space-y-6 bg-white py-8 px-8 rounded-[16px] border border-[#e5e7eb]">
        <Input
          id="businessName"
          label="Business Name *"
          placeholder="Enter your pet hotel business name"
          value={formData.businessName || ""}
          labelClass="text-[#101828] font-arimo text-[16px]"
          className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4"
          onChange={(e) => updateFormData({ businessName: e.target.value })}
        />

        <Input
          id="businessRegistrationNumber"
          label="Business Registration Number *"
          placeholder="000-00-00000"
          value={formData.businessRegistrationNumber || ""}
          labelClass="text-[#101828] font-arimo text-[16px]"
          className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4"
          onChange={(e) =>
            updateFormData({ businessRegistrationNumber: e.target.value })
          }
        />

        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <label className="text-[#101828] font-arimo text-[16px]">Business Registration Certificate <span className="text-[#ff6900]">*</span></label>
            <p className="text-[#6a7282] text-[14px]">Upload your Business Registration Certificate. This is used to verify your eligibility to operate a pet hotel.</p>
          </div>
          <FileUpload
            acceptedTypes="image/png, image/jpeg, application/pdf"
            maxSizeMB={10}
            onFileSelect={(file) =>
              updateFormData({ businessRegistrationCertificate: file })
            }
            className="rounded-[14px] bg-white border-2 border-[#d1d5dc] border-dashed hover:border-[#ff6900] transition-all min-h-[176px]"
            preview={true}
            uploadIconColor="#ff6900"
            uploadIconBg="#ffedd4"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[#101828] font-arimo text-[16px] block mb-1">
            Business Address <span className="text-[#ff6900]">*</span>
          </label>
          <p className="text-[#6a7282] text-[14px] mb-2 leading-relaxed">
            Enter the complete address where your pet hotel is located.
          </p>
          <textarea
            id="businessAddress"
            placeholder="123 Main Street, Seoul..."
            value={formData.businessAddress || ""}
            onChange={(e) => updateFormData({ businessAddress: e.target.value })}
            className="w-full rounded-[14px] bg-[#f9fafb] border border-[#e5e7eb] p-4 text-[16px] min-h-[120px] outline-none focus:ring-1 focus:ring-[#ff6900] transition-all font-arimo text-[#0f0f0f]"
          />
        </div>
      </div>
    </div>
  );
}
