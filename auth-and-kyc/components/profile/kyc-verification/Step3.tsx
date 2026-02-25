import { Award, Info } from "lucide-react";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: any;
  updateFormData: (newData: any) => void;
}

export default function Step3({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-10">
      <InfoCard
        title="Pet Hotel License"
        description="Enter your animal care and pet hotel operating license information. This is required for legal operation of your pet hotel business."
        Icon={Award}
        iconBg="linear-gradient(135deg, #B14BEE 0%, #8024D3 100%)"
      />

      <div className="space-y-6 bg-white py-8 px-8 rounded-[16px] border border-[#e5e7eb]">
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <label className="text-[#101828] font-arimo text-[16px]">Animal Care / Pet Hotel License <span className="text-[#ff6900]">*</span></label>
            <p className="text-[#6a7282] text-[14px]">Upload your animal care license or related permit required to operate a pet hotel.</p>
          </div>
          <FileUpload
            acceptedTypes="image/png, image/jpeg, application/pdf"
            maxSizeMB={10}
            onFileSelect={(file) =>
              updateFormData({ hotelLicenseImage: file })
            }
            className="rounded-[14px] bg-white border-2 border-[#d1d5dc] border-dashed hover:border-[#ff6900] transition-all min-h-[176px]"
            preview={true}
            uploadIconColor="#ff6900"
            uploadIconBg="#ffedd4"
          />
        </div>

        <Input
          id="licenseNumber"
          label="License Number *"
          placeholder="Enter your unique license number"
          value={formData.licenseNumber || ""}
          labelClass="text-[#101828] font-arimo text-[16px]"
          className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4"
          onChange={(e) => updateFormData({ licenseNumber: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="licenseIssueDate"
            label="Issue Date"
            type="date"
            placeholder="Select the license issue date"
            value={formData.licenseIssueDate || ""}
            labelClass="text-[#101828] font-arimo text-[16px]"
            className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4"
            onChange={(e) => updateFormData({ licenseIssueDate: e.target.value })}
          />

          <Input
            id="licenseExpiryDate"
            label="Expiry Date"
            type="date"
            placeholder="Select the license expiry date"
            value={formData.licenseExpiryDate || ""}
            labelClass="text-[#101828] font-arimo text-[16px]"
            className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4"
            onChange={(e) => updateFormData({ licenseExpiryDate: e.target.value })}
          />
        </div>

        <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-[14px] border border-blue-100 transition-colors hover:bg-blue-50">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-[14px] text-blue-800 leading-relaxed font-arimo pt-1">
            If your license is nearing expiration, please renew it before submitting or resubmit after renewal to avoid service interruptions.
          </p>
        </div>
      </div>
    </div>
  );
}
