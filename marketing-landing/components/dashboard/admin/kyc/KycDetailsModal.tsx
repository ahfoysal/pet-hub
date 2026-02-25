"use client";

import { X, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { KYCData } from "@/types/dashboard/admin/kyc/adminKycType";
import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"details" | "documents">(
    "details",
  );
  const [approveKyc, { isLoading: isApproving }] = useApproveKycMutation();
  const [rejectKyc, { isLoading: isRejecting }] = useRejectKycMutation();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleApprove = async () => {
    try {
      const result = await approveKyc(kycData.id).unwrap();
      showToast(result.message || "KYC approved successfully!", "success");
      onClose();
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to approve KYC", "error");
    }
  };

  const handleReject = async () => {
    try {
      const result = await rejectKyc(kycData.id).unwrap();
      showToast(result.message || "KYC rejected successfully!", "success");
      onClose();
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to reject KYC", "error");
    }
  };

  const getStatusBadge = () => {
    switch (kycData.status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
            <XCircle className="h-4 w-4" />
            Rejected
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Pending Review
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto top-20">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <img
                src={kycData.image}
                alt={kycData.fullName}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {kycData.fullName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {kycData.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {getStatusBadge()}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 px-4 sm:px-6">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "documents"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Documents
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-4 sm:p-6">
            {activeTab === "details" ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-blue-600">📋</span>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InfoItem label="Full Name" value={kycData.fullName} />
                    <InfoItem label="Email" value={kycData.email} />
                    <InfoItem
                      label="Phone Number"
                      value={kycData.phoneNumber}
                    />
                    <InfoItem
                      label="Date of Birth"
                      value={kycData.dateOfBirth}
                    />
                    <InfoItem label="Gender" value={kycData.gender} />
                    <InfoItem label="Nationality" value={kycData.nationality} />
                  </div>
                </div>

                {/* Identification */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-purple-600">🪪</span>
                    Identification
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InfoItem
                      label="ID Type"
                      value={kycData.identificationType}
                    />
                    <InfoItem
                      label="ID Number"
                      value={kycData.identificationNumber}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-green-600">🏠</span>
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <InfoItem
                      label="Present Address"
                      value={kycData.presentAddress}
                    />
                    <InfoItem
                      label="Permanent Address"
                      value={kycData.permanentAddress}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-red-600">🚨</span>
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InfoItem
                      label="Contact Name"
                      value={kycData.emergencyContactName}
                    />
                    <InfoItem
                      label="Relationship"
                      value={kycData.emergencyContactRelation}
                    />
                    <InfoItem
                      label="Contact Phone"
                      value={kycData.emergencyContactPhone}
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-orange-600">ℹ️</span>
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InfoItem label="Role Type" value={kycData.roleType} />
                    <InfoItem
                      label="Submitted On"
                      value={new Date(kycData.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Photo */}
                <DocumentItem
                  title="Profile Photo"
                  imageUrl={kycData.image}
                  alt="Profile"
                />

                {/* ID Front */}
                <DocumentItem
                  title="ID Document - Front"
                  imageUrl={kycData.identificationFrontImage}
                  alt="ID Front"
                />

                {/* ID Back */}
                <DocumentItem
                  title="ID Document - Back"
                  imageUrl={kycData.identificationBackImage}
                  alt="ID Back"
                />

                {/* Signature */}
                <DocumentItem
                  title="Signature"
                  imageUrl={kycData.signatureImage}
                  alt="Signature"
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-4">
            {kycData.status === "PENDING" ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <button
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="px-6 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  {isRejecting ? "Rejecting..." : "Reject"}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  {isApproving ? "Approving..." : "Approve"}
                </button>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">
                  This KYC has already been{" "}
                  <span
                    className={`font-semibold ${
                      kycData.status === "APPROVED"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {kycData.status}
                  </span>
                  {kycData.reviewedAt && (
                    <span className="block mt-1 text-xs">
                      on{" "}
                      {new Date(kycData.reviewedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="break-words">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900 break-all">{value}</p>
    </div>
  );
}

function DocumentItem({
  title,
  imageUrl,
  alt,
}: {
  title: string;
  imageUrl: string;
  alt: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors self-start"
        >
          <Download className="h-4 w-4" />
          <span className="whitespace-nowrap">Download</span>
        </a>
      </div>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto object-contain max-h-[500px]"
        />
      </div>
    </div>
  );
}
