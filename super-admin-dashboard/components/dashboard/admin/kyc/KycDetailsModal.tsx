"use client";

import { X, CheckCircle, XCircle, FileText, Eye } from "lucide-react";
import { KYCData } from "@/types/dashboard/admin/kyc/adminKycType";
import {
  useApproveKycMutation,
  useRejectKycMutation,
} from "@/redux/features/api/dashboard/admin/kyc/adminKycApi";
import { useToast } from "@/contexts/ToastContext";

interface KycDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycData: KYCData;
}

export default function KycDetailsModal({
  isOpen,
  onClose,
  kycData,
}: KycDetailsModalProps) {
  const [approveKyc, { isLoading: isApproving }] = useApproveKycMutation();
  const [rejectKyc, { isLoading: isRejecting }] = useRejectKycMutation();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleApprove = async () => {
    try {
      const result = await approveKyc(kycData.id).unwrap();
      showToast(result.message || "KYC approved successfully!", "success");
      onClose();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      showToast(err?.data?.message || "Failed to approve KYC", "error");
    }
  };

  const handleReject = async () => {
    try {
      const result = await rejectKyc(kycData.id).unwrap();
      showToast(result.message || "KYC rejected successfully!", "success");
      onClose();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      showToast(err?.data?.message || "Failed to reject KYC", "error");
    }
  };

  const getStatusBadge = () => {
    switch (kycData.status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dcfce7] text-[#008236] text-[12px] font-['Nunito',sans-serif] font-bold">
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ffe4e6] text-[#e11d48] text-[12px] font-['Nunito',sans-serif] font-bold">
            Rejected
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#fef3c6] text-[#bb4d00] text-[12px] font-['Nunito',sans-serif] font-bold">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const formattedDate = new Date(kycData.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).split('/').reverse().join('-');

  return (
    <div className="fixed inset-0 z-1000 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0f172b]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-165 flex flex-col max-h-[90vh] overflow-hidden">
          
          {/* Header Area */}
          <div className="bg-[#ff6f75] px-6 py-6 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex justify-between items-start pr-8">
              <div>
                <h2 className="text-[22px] font-bold text-white font-['Nunito',sans-serif] leading-tight">
                  {kycData.fullName}
                </h2>
                <p className="text-white/90 text-[14px] mt-1 font-['Arimo',sans-serif]">
                  {kycData.roleType === "SCHOOL" ? "Pet School" : "Pet Sitter"} Application
                </p>
              </div>
              <div className="shrink-0 mt-1 shadow-sm">
                {getStatusBadge()}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
            
            {/* Provider Information Section - Matching Figma verbatim */}
            <div>
              <h3 className="text-[#0f172b] text-[16px] font-bold font-['Nunito',sans-serif] mb-4">
                Provider Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                <InfoItem label="Provider ID" value={kycData.id.slice(0, 8).toUpperCase()} />
                <div className="wrap-break-word">
                  <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">
                    Category
                  </p>
                  <span className="inline-flex px-3 py-1 bg-[#e0f2fe] text-[#0284c7] text-[12px] font-medium rounded-full">
                    {kycData.roleType}
                  </span>
                </div>
                <InfoItem label="Owner Name" value={kycData.fullName} />
                <InfoItem label="Submitted Date" value={formattedDate} />
              </div>
            </div>

            {/* Additional Details from auth-and-kyc */}
            <div>
              <h3 className="text-[#0f172b] text-[16px] font-bold font-['Nunito',sans-serif] mb-4 border-t border-gray-100 pt-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                <InfoItem label="Email Address" value={kycData.email} />
                <InfoItem label="Phone Number" value={kycData.phoneNumber} />
                <InfoItem label="Date of Birth" value={kycData.dateOfBirth} />
                <InfoItem label="Gender" value={kycData.gender} />
                <InfoItem label="Nationality" value={kycData.nationality} />
              </div>
            </div>

            <div>
              <h3 className="text-[#0f172b] text-[16px] font-bold font-['Nunito',sans-serif] mb-4 border-t border-gray-100 pt-6">
                Identification Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                <InfoItem label="Document Type" value={kycData.identificationType} />
                <InfoItem label="Document Number" value={kycData.identificationNumber} />
              </div>
            </div>

            <div>
              <h3 className="text-[#0f172b] text-[16px] font-bold font-['Nunito',sans-serif] mb-4 border-t border-gray-100 pt-6">
                Address & Contact
              </h3>
              <div className="grid grid-cols-1 gap-y-5 gap-x-8">
                <InfoItem label="Present Address" value={kycData.presentAddress} />
                <InfoItem label="Permanent Address" value={kycData.permanentAddress} />
              </div>
            </div>

            <div>
              <h3 className="text-[#0f172b] text-[16px] font-bold font-['Nunito',sans-serif] mb-4 border-t border-gray-100 pt-6">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                <InfoItem label="Contact Name" value={kycData.emergencyContactName} />
                <InfoItem label="Relationship" value={kycData.emergencyContactRelation} />
                <InfoItem label="Contact Phone" value={kycData.emergencyContactPhone} />
              </div>
            </div>

            {/* Submitted Documents Section */}
            <div>
              <h3 className="text-[#0f172b] text-[16px] font-bold font-['Nunito',sans-serif] mb-4 border-t border-gray-100 pt-6">
                Submitted Documents
              </h3>
              <div className="space-y-3">
                <DocumentItem 
                  title="Profile Photo" 
                  fileName="profile_photo.jpg" 
                  url={kycData.image} 
                  iconColor="text-blue-500" 
                />
                <DocumentItem 
                  title={`${kycData.identificationType} - Front`} 
                  fileName="id_document_front.pdf" 
                  url={kycData.identificationFrontImage} 
                  iconColor="text-[#ff6f75]" 
                />
                <DocumentItem 
                  title={`${kycData.identificationType} - Back`} 
                  fileName="id_document_back.pdf" 
                  url={kycData.identificationBackImage} 
                  iconColor="text-indigo-500" 
                />
                <DocumentItem 
                  title="Official Signature" 
                  fileName="signature.png" 
                  url={kycData.signatureImage} 
                  iconColor="text-emerald-500" 
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          {kycData.status === "PENDING" && (
            <div className="p-6 border-t border-[#e2e8f0] bg-white shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                  className="flex-1 px-6 py-3.5 bg-[#00c950] text-white rounded-[10px] font-['Nunito',sans-serif] font-bold text-[15px] hover:bg-[#00b046] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  {isApproving ? "Approving..." : "Approve KYC"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={isApproving || isRejecting}
                  className="flex-1 px-6 py-3.5 bg-[#ff6f75] text-white rounded-[10px] font-['Nunito',sans-serif] font-bold text-[15px] hover:bg-[#e66469] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  {isRejecting ? "Rejecting..." : "Reject with Reason"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="wrap-break-word">
      <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">
        {label}
      </p>
      <p className="text-[#0f172b] text-[15px] font-medium font-['Nunito',sans-serif]">
        {value || "N/A"}
      </p>
    </div>
  );
}

function DocumentItem({ 
  title, 
  fileName, 
  url, 
  iconColor 
}: { 
  title: string; 
  fileName: string; 
  url: string; 
  iconColor: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] hover:border-[#cbd5e1] transition-colors">
      <div className="flex items-center gap-3">
        <div className="shrink-0 p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
          <FileText className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-[#0f172b] text-[14px] font-bold font-['Nunito',sans-serif]">
            {title}
          </p>
          <p className="text-[#62748e] text-[12px] font-normal mt-0.5">
            {fileName}
          </p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-[#62748e] hover:text-[#00c950] bg-white rounded-lg border border-[#e2e8f0] hover:border-[#00c950]/30 transition-all flex items-center justify-center shadow-sm"
        title="View Document"
      >
        <Eye className="h-4 w-4" />
      </a>
    </div>
  );
}
