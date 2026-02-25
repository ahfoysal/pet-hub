// Step4.tsx
import { Home } from "lucide-react";
import Input from "@/components/ui/Input";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { KycFormDataType } from "@/lib/validators/kycValidation";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: KycFormDataType;
  updateFormData: (newData: Partial<KycFormDataType>) => void;
}

export default function Step4({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Emergency Contact Information"
        description="Please provide emergency contact details. This information will
              only be used in case of emergencies."
        Icon={Home}
        iconBg="bg-linear-to-b from-[#FF6900] to-[#FF8A00]"
      />

      <div className="space-y-6 bg-white py-4 px-8 rounded-xl  ">
        <Input
          id="emergencyContactName"
          label="Emergency Contact Name"
          placeholder="Enter emergency contact name"
          value={formData.emergencyContactName}
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) =>
            updateFormData({ emergencyContactName: e.target.value })
          }
        />

        <Input
          id="emergencyContactRelation"
          label="Relationship"
          placeholder="Enter relationship (e.g., Father, Spouse)"
          value={formData.emergencyContactRelation}
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) =>
            updateFormData({ emergencyContactRelation: e.target.value })
          }
        />

        <PhoneNumberInput
          label="Emergency Phone Number"
          value={formData.emergencyContactPhone}
          onChange={(value) =>
            updateFormData({ emergencyContactPhone: value || "" })
          }
          containerClassName="rounded-xl bg-[#F9FAFB] border-border"
        />

        <p className="text-sm text-green-500 bg-green-100 p-2 rounded-lg">
          This emergency contact will be notified only in critical situations
          requiring immediate attention.
        </p>
      </div>
    </div>
  );
}
