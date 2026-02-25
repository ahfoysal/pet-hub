// Step5.tsx
import { CheckCircle } from "lucide-react";
import { KycFormDataType } from "@/lib/validators/kycValidation";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: KycFormDataType;
  fieldErrors?: Record<string, string[]>;
}

const UploadedBadge = () => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
    <span className="mr-1">●</span> Uploaded
  </span>
);

const InfoRow = ({
  label,
  value,
  isUploaded = false,
}: {
  label: string;
  value: string;
  isUploaded?: boolean;
}) => (
  <div className="py-3 flex justify-between items-center  border-gray-100 last:-0">
    <span className="text-gray-700 font-medium">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-gray-900">{value || "N/A"}</span>
      {isUploaded && <UploadedBadge />}
    </div>
  </div>
);

export default function Step5({ formData, fieldErrors = {} }: StepProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <InfoCard
        title="Review & Submit"
        description="Please review all the information you've entered. After
              submission, you will receive verification results within 2-3
              business days via email."
        Icon={CheckCircle}
        iconBg="bg-linear-to-b from-[#FF6900] to-[#FF8A00]"
      />

      {/* Identity Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5  border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 text-xl font-semibold">👤</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Identity Information
          </h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow label="Full Name" value={formData.fullName} />
          <InfoRow label="Phone" value={formData.phoneNumber} />
          <InfoRow label="Email" value={formData.email} />
          <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
          <InfoRow label="Gender" value={formData.gender} />
          <InfoRow label="Nationality" value={formData.nationality} />
          <InfoRow label="ID Type" value={formData.identificationType} />
          <InfoRow label="ID Number" value={formData.identificationNumber} />
          <InfoRow
            label="ID Front Image"
            value={
              formData.identificationFrontImage
                ? "ID Front Uploaded"
                : "Not uploaded"
            }
            isUploaded={!!formData.identificationFrontImage}
          />
          <InfoRow
            label="ID Back Image"
            value={
              formData.identificationBackImage
                ? "ID Back Uploaded"
                : "Not uploaded"
            }
            isUploaded={!!formData.identificationBackImage}
          />
          <InfoRow
            label="Signature Image"
            value={
              formData.signatureImage ? "Signature Uploaded" : "Not uploaded"
            }
            isUploaded={!!formData.signatureImage}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5  border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-xl font-semibold">📞</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Contact Information
          </h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow label="Phone Number" value={formData.phoneNumber} />
          <InfoRow label="Present Address" value={formData.presentAddress} />
          <InfoRow
            label="Permanent Address"
            value={formData.permanentAddress}
          />
          <InfoRow label="Role Type" value={formData.roleType || ""} />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5  border-gray-200 bg-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
            <span className="text-pink-600 text-xl font-semibold">🚨</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Emergency Contact
          </h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow label="Contact Name" value={formData.emergencyContactName} />
          <InfoRow
            label="Relationship"
            value={formData.emergencyContactRelation}
          />
          <InfoRow
            label="Contact Phone"
            value={formData.emergencyContactPhone}
          />
        </div>
      </div>

      {/* Confirmation */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-gray-800 font-medium">
          I confirm that all information is accurate and complete. False
          information may result in rejection or account suspension.
        </p>
      </div>
    </div>
  );
}
