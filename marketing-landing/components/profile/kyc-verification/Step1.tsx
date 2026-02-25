// Step1.tsx
import { User } from "lucide-react";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import DropdownButton from "@/components/ui/DropdownButton";
import { KycFormDataType } from "@/lib/validators/kycValidation";
import { useSession } from "next-auth/react";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: KycFormDataType;
  updateFormData: (newData: Partial<KycFormDataType>) => void;
}

export default function Step1({ formData, updateFormData }: StepProps) {
  const session = useSession().data;
  return (
    <div className="space-y-6 ">
      <InfoCard
        title="Identity Information"
        description="Please enter your identity information exactly as it appears on your National ID card. All information will be securely encrypted."
        Icon={User}
        iconBg="bg-gradient-to-b from-[#FF6900] to-[#FF8A00]"
      />

      <div className="space-y-6 bg-white py-4 px-8 rounded-xl  ">
        <Input
          id="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          labelClass="text-foreground"
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) => updateFormData({ fullName: e.target.value })}
        />
        <Input
          id="email"
          label="Email Address"
          placeholder="Enter your email address"
          type="email"
          value={session?.user.email || ""}
          readOnly
          className="rounded-xl bg-[#F9FAFB] border-border"
          // onChange={(e) => updateFormData({ email: e.target.value })}
        />

        <Input
          id="dateOfBirth"
          label="Date of Birth *"
          type="date"
          value={formData.dateOfBirth}
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1 cursor-pointer">
            Gender
            <span className="text-red-500 ml-1">*</span>
          </label>
          <DropdownButton
            options={[
              { value: "", label: "Select Gender" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
            value={formData.gender}
            onChange={(value) => updateFormData({ gender: value })}
            className="rounded-xl bg-[#F9FAFB] border-border shadow-md"
          />
        </div>

        <Input
          id="nationality"
          label="Nationality"
          placeholder="Enter your nationality"
          value={formData.nationality}
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) => updateFormData({ nationality: e.target.value })}
        />

        <FileUpload
          label="Profile Photo"
          description="PNG, JPG up to 5MB"
          acceptedTypes="image/*"
          maxSizeMB={5}
          onFileSelect={(file) => updateFormData({ image: file })}
          className="rounded-xl bg-[#F9FAFB] border-border"
          preview={true}
        />
      </div>
    </div>
  );
}
