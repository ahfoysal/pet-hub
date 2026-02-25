// Step3.tsx
import { Phone } from "lucide-react";
import Input from "@/components/ui/Input";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import DropdownButton from "@/components/ui/DropdownButton";
import { KycFormDataType } from "@/lib/validators/kycValidation";
import { RoleType } from "@/types/user";
import { useSession } from "next-auth/react";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: KycFormDataType;
  updateFormData: (newData: Partial<KycFormDataType>) => void;
}

export default function Step3({ formData, updateFormData }: StepProps) {
  const session = useSession().data;
  console.log("User Role from session:", session?.user?.role);
  return (
    <div className="space-y-6">
      <InfoCard
        title=" Contact Information"
        description="Please provide your contact details. This information will be used
              for communication purposes."
        Icon={Phone}
        iconBg="bg-linear-to-b from-[#FF6900] to-[#FF8A00]"
      />

      <div className="space-y-6 bg-white py-4 px-8 rounded-xl  ">
        <PhoneNumberInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={(value) => updateFormData({ phoneNumber: value || "" })}
          containerClassName="rounded-xl bg-[#F9FAFB] border-border"
        />

        <Input
          id="presentAddress"
          label="Present Address"
          placeholder="Enter your current address"
          value={formData.presentAddress}
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) => updateFormData({ presentAddress: e.target.value })}
        />

        <Input
          id="permanentAddress"
          label="Permanent Address"
          placeholder="Enter your permanent address"
          value={formData.permanentAddress}
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) => updateFormData({ permanentAddress: e.target.value })}
        />
        {/* <Input
          id="roleType"
          label="Role Type *"
          placeholder="Enter your role type"
          value={session?.user?.role}
          className="rounded-xl bg-[#F9FAFB] border-border"
          onChange={(e) => updateFormData({ roleType: e.target.value })}
        /> */}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1 cursor-pointer">
            Role Type *
          </label>
          <DropdownButton
            options={[
              { value: "", label: "Select Role Type" },
              { value: "PET_SCHOOL", label: "School" },
              { value: "PET_HOTEL", label: "Hotel" },
              { value: "VENDOR", label: "Vendor" },
              { value: "PET_SITTER", label: "Sitter" },
            ]}
            value={session?.user?.role}
            // onChange={(value) =>
            //   updateFormData({ roleType: value as RoleType })
            // }
            className="rounded-xl bg-[#F9FAFB] border-border shadow-md"
          />
        </div>

        <p className="text-sm text-purple-500 bg-purple-100 p-2 rounded-lg">
          Your role type determines which dashboard and features you&apos;ll
          have access to.
        </p>
      </div>
    </div>
  );
}
