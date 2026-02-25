// Step2.tsx
import { IdCard } from "lucide-react";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import DropdownButton from "@/components/ui/DropdownButton";
import { KycFormDataType } from "@/lib/validators/kycValidation";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: KycFormDataType;
  updateFormData: (newData: Partial<KycFormDataType>) => void;
}

export default function Step2({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Identification Documents"
        description="Please provide your official identification documents. This
              information will be verified for security purposes."
        Icon={IdCard}
        iconBg="bg-linear-to-b from-[#FF6900] to-[#FF8A00]"
      />

      <div className="space-y-6 bg-white py-4 px-8 rounded-xl  ">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1 cursor-pointer">
            Identification Type <span className="text-red-500 ml-1">*</span>
          </label>
          <DropdownButton
            options={[
              { value: "", label: "Select Identification Type" },
              { value: "NID", label: "National ID (NID)" },
              { value: "PASSPORT", label: "Passport" },
              { value: "DRIVING_LICENSE", label: "Driving License" },
            ]}
            value={formData.identificationType}
            onChange={(value) =>
              updateFormData({ identificationType: value as any })
            }
            className="rounded-xl bg-[#F9FAFB] border-border shadow-md"
          />
        </div>

        <Input
          id="identificationNumber"
          label="Identification Number"
          placeholder="Enter your identification number"
          value={formData.identificationNumber}
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) =>
            updateFormData({ identificationNumber: e.target.value })
          }
        />

        <FileUpload
          label="ID Document Front *"
          description="PNG, JPG up to 5MB"
          acceptedTypes="image/*"
          maxSizeMB={5}
          onFileSelect={(file) =>
            updateFormData({ identificationFrontImage: file })
          }
          className="rounded-xl bg-[#F9FAFB] border-border"
          preview={true}
        />

        <FileUpload
          label="ID Document Back *"
          description="PNG, JPG up to 5MB"
          acceptedTypes="image/*"
          maxSizeMB={5}
          onFileSelect={(file) =>
            updateFormData({ identificationBackImage: file })
          }
          className="rounded-xl bg-[#F9FAFB] border-border"
          preview={true}
        />

        <FileUpload
          label="Signature *"
          description="PNG, JPG up to 5MB"
          acceptedTypes="image/*"
          maxSizeMB={5}
          onFileSelect={(file) => updateFormData({ signatureImage: file })}
          className="rounded-xl bg-[#F9FAFB] border-border"
          preview={true}
        />
      </div>
    </div>
  );
}
