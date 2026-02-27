import { User } from "lucide-react";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: any;
  updateFormData: (newData: any) => void;
}

export default function Step1({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-10">
      <InfoCard
        title="Identity Information"
        description="Please enter your identity information exactly as it appears on your National ID card. All information will be securely encrypted."
        Icon={User}
        iconBg="linear-gradient(135deg, #FF8904 0%, #FF6900 100%)"
      />

      <div className="space-y-6 bg-white py-8 px-8 rounded-[16px] border border-[#e5e7eb]">
        <Input
          id="fullName"
          label="Full Name *"
          placeholder="Enter your full name"
          value={formData.fullName}
          labelClass="text-[#101828] font-arimo text-[16px]"
          className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4"
          onChange={(e) => updateFormData({ fullName: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="dateOfBirth"
            label="Date of Birth *"
            type="date"
            value={formData.dateOfBirth}
            labelClass="text-[#101828] font-arimo text-[16px]"
            className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4 w-full"
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
          />

          <div className="space-y-2">
            <label className="text-[#101828] font-arimo text-[16px]">Identification Type *</label>
            <select
              value={formData.identificationType}
              onChange={(e) => updateFormData({ identificationType: e.target.value })}
              className="w-full h-[50px] px-4 rounded-[14px] bg-[#f9fafb] border border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] outline-none font-arimo text-[#101828]"
            >
              <option value="NID">National ID (NID)</option>
              <option value="PASSPORT">Passport</option>
              <option value="DRIVING_LICENSE">Driving License</option>
            </select>
          </div>
        </div>

        <Input
          id="identificationNumber"
          label="Identification Number *"
          placeholder="Enter your ID number"
          value={formData.identificationNumber}
          labelClass="text-[#101828] font-arimo text-[16px]"
          className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4"
          onChange={(e) => updateFormData({ identificationNumber: e.target.value })}
        />

        <Input
          id="phoneNumber"
          label="Phone Number *"
          placeholder="Enter your phone number"
          value={formData.phoneNumber || ""}
          labelClass="text-[#101828] font-arimo text-[16px]"
          className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] focus:ring-1 focus:ring-[#ff6900] h-[50px] px-4"
          onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
        />

        <Input
          id="email"
          label="Email Address *"
          placeholder="Enter your email address"
          type="email"
          value={formData.email}
          readOnly
          labelClass="text-[#101828] font-arimo text-[16px]"
          className="rounded-[14px] bg-[#f9fafb] border-[#e5e7eb] text-gray-400 cursor-not-allowed h-[50px] px-4"
        />

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <label className="text-[#101828] font-arimo text-[16px]">National ID (Front) <span className="text-[#ff6900]">*</span></label>
              <p className="text-[#6a7282] text-[14px]">Upload the front side of your National ID card for verification.</p>
            </div>
            <FileUpload
              label="Front of Identification"
              acceptedTypes="image/png, image/jpeg, application/pdf"
              maxSizeMB={10}
              onFileSelect={(file) => updateFormData({ identificationFrontImage: file })}
              initialFile={formData.identificationFrontImage}
              className="rounded-[14px] bg-white border-2 border-[#d1d5dc] border-dashed hover:border-[#ff6900] transition-all min-h-[176px]"
              preview={true}
              uploadIconColor="#ff6900"
              uploadIconBg="#ffedd4"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <label className="text-[#101828] font-arimo text-[16px]">National ID (Back) <span className="text-[#ff6900]">*</span></label>
              <p className="text-[#6a7282] text-[14px]">Upload the back side of your National ID. All personal data is securely encrypted.</p>
            </div>
            <FileUpload
              label="Back of Identification"
              acceptedTypes="image/png, image/jpeg, application/pdf"
              maxSizeMB={10}
              onFileSelect={(file) => updateFormData({ identificationBackImage: file })}
              initialFile={formData.identificationBackImage}
              className="rounded-[14px] bg-white border-2 border-[#d1d5dc] border-dashed hover:border-[#ff6900] transition-all min-h-[176px]"
              preview={true}
              uploadIconColor="#ff6900"
              uploadIconBg="#ffedd4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
