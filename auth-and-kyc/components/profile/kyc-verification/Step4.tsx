import { Camera, CheckCircle } from "lucide-react";
import FileUpload from "@/components/ui/FileUpload";
import InfoCard from "@/components/ui/InfoCard";

interface StepProps {
  formData: any;
  updateFormData: (newData: any) => void;
}

export default function Step4({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-10">
      <InfoCard
        title="Facility Verification (Optional)"
        description="Upload photos of your pet hotel facility for faster approval. Include rooms, cages, play areas, and safety features."
        Icon={Camera}
        iconBg="linear-gradient(135deg, #34D399 0%, #059669 100%)"
      />

      <div className="space-y-6 bg-white py-8 px-8 rounded-[16px] border border-[#e5e7eb]">
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <label className="text-[#101828] font-arimo text-[16px]">Facility Photos</label>
            <p className="text-[#6a7282] text-[14px]">Upload photos of your pet hotel interior, rooms, play areas, hygiene facilities. (Max 10 photos)</p>
          </div>
          <FileUpload
            acceptedTypes="image/png, image/jpeg"
            maxSizeMB={10}
            onFileSelect={(file) => {
              updateFormData({ facilityPhotos: [file] });
            }}
            className="rounded-[14px] bg-white border-2 border-[#d1d5dc] border-dashed hover:border-[#ff6900] transition-all min-h-[176px]"
            preview={true}
            uploadIconColor="#ff6900"
            uploadIconBg="#ffedd4"
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <label className="text-[#101828] font-arimo text-[16px]">Hygiene / Safety Compliance Certificate <span className="text-[#6a7282] text-[14px] font-normal">(Optional)</span></label>
            <p className="text-[#6a7282] text-[14px]">If you have hygiene management or safety certification documents, please upload them.</p>
          </div>
          <FileUpload
            acceptedTypes="image/png, image/jpeg, application/pdf"
            maxSizeMB={10}
            onFileSelect={(file) =>
              updateFormData({ hygieneCertificate: file })
            }
            className="rounded-[14px] bg-white border-2 border-[#d1d5dc] border-dashed hover:border-[#ff6900] transition-all min-h-[176px]"
            preview={true}
            uploadIconColor="#ff6900"
            uploadIconBg="#ffedd4"
          />
        </div>

        <div className="flex items-start gap-4 p-4 bg-green-50/50 rounded-[14px] border border-green-100 transition-colors hover:bg-green-50">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="space-y-1 pt-1">
            <p className="text-[14px] font-bold text-green-900 font-arimo">
              Expedited Verification
            </p>
            <p className="text-[13px] text-green-700 leading-relaxed font-arimo">
              Recommended photos: Overall interior, individual rooms, play areas, hygiene facilities, and safety equipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
