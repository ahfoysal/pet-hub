import { 
  FileText, 
  User, 
  Briefcase, 
  Award,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: any;
  fieldErrors?: any;
}

const ReviewRow = ({ label, value, isFile }: { label: string; value: any; isFile?: boolean }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-[#f2f4f8] last:border-0">
      <span className="text-[14px] text-[#6a7282] font-arimo">{label}</span>
      {isFile ? (
        value ? (
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[12px] font-bold">Uploaded</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-[12px] font-bold">Missing</span>
          </div>
        )
      ) : (
        <span className="text-[15px] font-medium text-[#101828] text-right max-w-[60%] truncate font-arimo">
          {value || "-"}
        </span>
      )}
    </div>
  );
};

export default function Step5({ formData }: StepProps) {
  return (
    <div className="space-y-10">
      <InfoCard
        title="Review & Submit"
        description="Please review all the information you've entered. After submission, you will receive verification results within 2-3 business days via email."
        Icon={FileText}
        iconBg="linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)"
      />

      {/* The provided snippet seems to indicate adding a FileUpload component here.
          However, the instruction is only to add a 'label=""' prop.
          Assuming the FileUpload component is intended to be added as part of a larger change,
          and the instruction focuses on a specific prop for that new component.
          Without the full context of where this FileUpload should go,
          I'm placing it where the snippet implies, which is before the first review section.
          Note: `updateFormData` is not defined in this file, which would cause an error.
          This change only addresses the instruction about the `label` prop.
      */}
      {/* <FileUpload
        label=""
        acceptedTypes="image/png, image/jpeg, application/pdf"
        maxSizeMB={10}
        onFileSelect={(file) =>
          updateFormData({ petTrainingCertificationImage: file })
        }
        className="rounded-[14px] bg-white border-2 border-[#d1d5dc] border-dashed hover:border-[#ff6900] transition-all min-h-[176px]"
        preview={true}
        uploadIconColor="#ff6900"
        uploadIconBg="#ffedd4"
      /> */}

      <div className="space-y-6">
        {/* Identity Information */}
        <div className="bg-white py-8 px-8 rounded-[16px] border border-[#e5e7eb] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f2f4f8]">
            <div className="w-9 h-9 rounded-[10px] bg-orange-50 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-[18px] font-bold text-[#101828] font-arimo">Identity Information</h3>
          </div>
          <div className="space-y-1">
            <ReviewRow label="Full Name" value={formData.fullName} />
            <ReviewRow label="Date of Birth" value={formData.dateOfBirth} />
            <ReviewRow label="Phone" value={formData.phoneNumber} />
            <ReviewRow label="Email" value={formData.email} />
            <ReviewRow label="Identification Type" value={formData.identificationType} />
            <ReviewRow label="Identification Number" value={formData.identificationNumber} />
            <ReviewRow label="National ID (Front)" value={formData.identificationFrontImage} isFile />
            <ReviewRow label="National ID (Back)" value={formData.identificationBackImage} isFile />
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white py-8 px-8 rounded-[16px] border border-[#e5e7eb] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f2f4f8]">
            <div className="w-9 h-9 rounded-[10px] bg-blue-50 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-[18px] font-bold text-[#101828] font-arimo">Business Information</h3>
          </div>
          <div className="space-y-1">
            <ReviewRow label="Business Name" value={formData.businessName} />
            <ReviewRow label="Registration Number" value={formData.businessRegistrationNumber} />
            <ReviewRow label="Business Address" value={formData.businessAddress} />
            <ReviewRow label="Business Certificate" value={formData.businessRegistrationCertificate} isFile />
          </div>
        </div>

        {/* Pet Hotel License & Compliance */}
        <div className="bg-white py-8 px-8 rounded-[16px] border border-[#e5e7eb] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f2f4f8]">
            <div className="w-9 h-9 rounded-[10px] bg-purple-50 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-[18px] font-bold text-[#101828] font-arimo">Pet Hotel License & Compliance</h3>
          </div>
          <div className="space-y-1">
            <ReviewRow label="License Number" value={formData.licenseNumber} />
            <ReviewRow label="Expiry Date" value={formData.licenseExpiryDate} />
            <ReviewRow label="License Document" value={formData.hotelLicenseImage} isFile />
            <ReviewRow label="Hygiene Certificate" value={formData.hygieneCertificate} isFile />
            <ReviewRow label="Facility Photos" value={formData.facilityPhotos && formData.facilityPhotos.length > 0} isFile />
          </div>
        </div>

        {/* Confirmation Info Box */}
        <div className="flex items-start gap-4 p-6 bg-orange-50/50 rounded-[14px] border border-orange-100 transition-colors hover:bg-orange-50 mt-6">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="space-y-1 pt-1">
            <p className="text-[14px] font-bold text-orange-900 font-arimo">
              Submission Confirmation
            </p>
            <p className="text-[13px] text-orange-700 leading-relaxed font-arimo">
              I confirm that all information provided is accurate and complete. Providing false information may result in verification failure or account suspension according to our terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
