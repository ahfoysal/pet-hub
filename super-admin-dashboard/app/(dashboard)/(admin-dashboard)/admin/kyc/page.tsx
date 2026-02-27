"use client";

import { useState, useMemo } from "react";
import { useGetAllKycSubmissionsQuery } from "@/redux/features/api/dashboard/admin/kyc/adminKycApi";
import { Eye, CheckCircle, XCircle, FileText } from "lucide-react";
import {
  useApproveKycMutation,
  useRejectKycMutation,
} from "@/redux/features/api/dashboard/admin/kyc/adminKycApi";
import { useToast } from "@/contexts/ToastContext";
import { useSession } from "next-auth/react";

export default function AdminKycPage() {
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED">("PENDING");
  const [selectedKycId, setSelectedKycId] = useState<string | null>(null);
  const { status } = useSession();

  const { data, isLoading, isError, refetch } = useGetAllKycSubmissionsQuery(undefined, {
    skip: status === "loading",
  });
  
  const [approveKyc, { isLoading: isApproving }] = useApproveKycMutation();
  const [rejectKyc, { isLoading: isRejecting }] = useRejectKycMutation();
  const { showToast } = useToast();

  const filteredData = useMemo(() => {
    return data?.data?.filter((kyc) => kyc.status === statusFilter) || [];
  }, [data, statusFilter]);

  // Derive the active item (auto-select first if none selected or not in current tab)
  const activeKycId = useMemo(() => {
    if (filteredData.length === 0) return null;
    if (!selectedKycId || !filteredData.find((k) => k.id === selectedKycId)) {
      return filteredData[0].id;
    }
    return selectedKycId;
  }, [filteredData, selectedKycId]);

  const selectedKyc = useMemo(() => {
    return filteredData.find((k) => k.id === activeKycId) || null;
  }, [filteredData, activeKycId]);

  const handleApprove = async (id: string) => {
    try {
      const result = await approveKyc(id).unwrap();
      showToast(result.message || "KYC approved successfully!", "success");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to approve KYC", "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const result = await rejectKyc(id).unwrap();
      showToast(result.message || "KYC rejected successfully!", "success");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to reject KYC", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff7176]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#f2f4f8]">
        <div className="text-center bg-white p-8 rounded-[14px] shadow-sm max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2 font-['Nunito',sans-serif]">Failed to load KYC</h2>
          <p className="text-gray-500 mb-5 font-['Arimo',sans-serif]">Please try again or contact support.</p>
          <button 
            onClick={() => refetch()}
            className="px-6 py-3 bg-[#ff7176] text-white rounded-[10px] font-['Nunito',sans-serif] font-bold hover:bg-[#ff5a60] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = data?.data?.filter((k) => k.status === "PENDING").length || 0;
  const approvedCount = data?.data?.filter((k) => k.status === "APPROVED").length || 0;
  const rejectedCount = data?.data?.filter((k) => k.status === "REJECTED").length || 0;
  const notSubmittedCount = data?.data?.filter((k) => k.status === "NOT_SUBMITTED").length || 0;

  return (
    <div className="size-full bg-[#f2f4f8] -m-6 p-6 min-h-[calc(100vh-80px)]" data-name="KYC Verification">
      <div className="flex flex-col gap-[25px] w-[1090px] mx-auto mt-[26px]">
        {/* Header Text */}
        <div className="flex flex-col gap-[8px] h-[68px] w-full">
          <div className="h-[36px] w-full">
            <h1 className="font-['Nunito',sans-serif] font-medium leading-[36px] text-[#0a0a0a] text-[30px] m-0">
               KYC Verification
            </h1>
          </div>
          <div className="h-[24px] w-full">
            <p className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#4a5565] text-[16px] m-0">
               Review and approve provider verification documents
            </p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="flex gap-[12px] items-center w-[1090px] h-[119px]">
           <div className="bg-white border border-[rgba(197,197,197,0.2)] flex flex-col justify-between p-[20px] rounded-[7.7px] flex-[1.2] h-full">
               <span className="font-['Arimo',sans-serif] font-bold text-[#0f172b] text-[16px]">Pending Requests</span>
               <span className="font-['Nunito',sans-serif] font-semibold text-[#f59e0b] text-[24px]">{pendingCount}</span>
           </div>
           <div className="bg-white border border-[rgba(197,197,197,0.2)] flex flex-col justify-between p-[20px] rounded-[7.7px] flex-1 h-full">
               <span className="font-['Arimo',sans-serif] font-bold text-[#0f172b] text-[16px]">Approved</span>
               <span className="font-['Nunito',sans-serif] font-semibold text-[#00a63e] text-[24px]">{approvedCount}</span>
           </div>
           <div className="bg-white border border-[rgba(197,197,197,0.2)] flex flex-col justify-between p-[20px] rounded-[7.7px] flex-1 h-full">
               <span className="font-['Arimo',sans-serif] font-bold text-[#0f172b] text-[16px]">Rejected</span>
               <span className="font-['Nunito',sans-serif] font-semibold text-[#e11d48] text-[24px]">{rejectedCount}</span>
           </div>
           <div className="bg-white border border-[rgba(197,197,197,0.2)] flex flex-col justify-between p-[20px] rounded-[7.7px] flex-[1.2] h-full">
               <span className="font-['Arimo',sans-serif] font-bold text-[#0f172b] text-[16px]">Not Submitted</span>
               <span className="font-['Nunito',sans-serif] font-semibold text-[#6b7280] text-[24px]">{notSubmittedCount}</span>
           </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white border border-[#e2e8f0] flex h-[76px] items-center px-[20px] rounded-[14px] w-full gap-[8px]">
           {[
             { id: "PENDING", label: "Pending Requests" },
             { id: "APPROVED", label: "Approved" },
             { id: "REJECTED", label: "Rejected" },
             { id: "NOT_SUBMITTED", label: "Not Submitted" },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setStatusFilter(tab.id as any)}
               className={`px-[16px] py-[8px] rounded-[10px] text-[14px] font-['Inter',sans-serif] font-medium leading-[20px] transition-colors ${
                 statusFilter === tab.id
                   ? tab.id === "REJECTED" ? "bg-[#ff6f75] text-white" : "bg-[#f1f5f9] text-[#475569]"
                   : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
               }`}
               style={statusFilter === tab.id && tab.id !== "REJECTED" ? { backgroundColor: tab.id === "PENDING" ? "#f1f5f9" : "#e0e7ff", color: "#475569" } : {}}
             >
               {tab.label}
             </button>
           ))}
        </div>

        {/* Split View Content */}
        <div className="flex gap-[20px] w-full h-[600px] items-start">
          
          {/* Left Side: KYC List */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] w-[350px] h-full flex flex-col overflow-hidden shrink-0">
             <div className="px-[20px] py-[16px] border-b border-[#e2e8f0]">
                <h3 className="font-['Arimo',sans-serif] font-bold text-[16px] text-[#0f172b]">
                   {statusFilter === "PENDING" ? "Pending KYC Requests" : statusFilter === "APPROVED" ? "Approved KYC Requests" : statusFilter === "NOT_SUBMITTED" ? "Not Submitted" : "Rejected KYC Requests"}
                </h3>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar p-[12px] flex flex-col gap-[8px]">
                {filteredData.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 font-['Arimo',sans-serif]">
                     No {statusFilter.toLowerCase().replace('_', ' ')} requests
                  </div>
                ) : (
                  filteredData.map(request => (
                    <div 
                      key={request.id} 
                      onClick={() => setSelectedKycId(request.id)}
                      className={`p-[16px] rounded-[10px] cursor-pointer border transition-colors ${activeKycId === request.id ? 'border-[#ff7176] bg-[#fff5f5]' : 'border-transparent hover:bg-gray-50'}`}
                    >
                       <div className="flex justify-between items-start mb-[8px]">
                          <span className="font-['Arimo',sans-serif] font-bold text-[16px] text-[#0f172b] truncate w-[180px]">{request.fullName}</span>
                          <span className={`px-[8px] py-[2px] rounded-[20px] text-[10px] font-['Nunito',sans-serif] font-bold ${
                             statusFilter === "PENDING" ? "bg-[#fef3c7] text-[#d97706]" : 
                             statusFilter === "APPROVED" ? "bg-[#dcfce7] text-[#008236]" : 
                             statusFilter === "NOT_SUBMITTED" ? "bg-[#f3f4f6] text-[#6b7280]" : 
                             "bg-[#fee2e2] text-[#ef4444]"
                          }`}>
                            {statusFilter === "PENDING" ? "Pending" : statusFilter === "APPROVED" ? "Approved" : statusFilter === "NOT_SUBMITTED" ? "Not Submitted" : "Rejected"}
                          </span>
                       </div>
                       <div className="flex items-center mb-[8px]">
                          <span className="inline-flex items-center px-[8px] py-[2px] rounded-full bg-[#f8e8f8] text-[#9333ea] text-[10px] font-medium font-['Nunito',sans-serif]">
                            {request.roleType}
                          </span>
                       </div>
                       <div className="text-[12px] text-[#62748e] font-['Arimo',sans-serif]">
                          Submitted: {new Date(request.createdAt).toISOString().split('T')[0]}
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>

          {/* Right Side: KYC Details */}
          {selectedKyc ? (
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] w-[720px] h-full flex flex-col overflow-hidden relative">
               {/* Header */}
               <div className={`px-[30px] py-[24px] ${statusFilter === 'APPROVED' ? 'bg-[#00c950]' : statusFilter === 'NOT_SUBMITTED' ? 'bg-[#9ca3af]' : 'bg-[#ff6f75]'} shrink-0`}>
                  <div className="flex justify-between items-start">
                     <div className="flex flex-col">
                        <h2 className="text-[24px] font-bold text-white font-['Nunito',sans-serif] leading-tight">
                          {selectedKyc.fullName}
                        </h2>
                        <p className="text-white/90 text-[14px] mt-1 font-['Arimo',sans-serif]">
                          {selectedKyc.roleType === "SCHOOL" ? "Pet School" : selectedKyc.roleType === "HOTEL" ? "Pet Hotel" : selectedKyc.roleType === "VENDOR" ? "Vendor" : "Pet Sitter"} Application
                        </p>
                     </div>
                     <span className={`px-[12px] py-[4px] rounded-[20px] text-[12px] font-['Nunito',sans-serif] font-bold ${
                        statusFilter === "PENDING" ? "bg-[#fef3c7] text-[#d97706]" : 
                        statusFilter === "APPROVED" ? "bg-white text-[#008236]" : 
                        statusFilter === "NOT_SUBMITTED" ? "bg-white text-[#4b5563]" : 
                        "bg-[#fee2e2] text-[#ef4444]"
                     }`}>
                       {statusFilter === "PENDING" ? "Pending" : statusFilter === "APPROVED" ? "Approved" : statusFilter === "NOT_SUBMITTED" ? "Not Submitted" : "Rejected"}
                     </span>
                  </div>
               </div>

               {/* Scrollable Details */}
               <div className="flex-1 overflow-y-auto custom-scrollbar p-[30px] flex flex-col gap-[30px]">
                  
                  {/* Provider Information */}
                  <div>
                     <h3 className="text-[#0f172b] text-[18px] font-bold font-['Nunito',sans-serif] mb-4">
                       Provider Information
                     </h3>
                     <div className="grid grid-cols-2 gap-y-[20px] gap-x-[40px]">
                        <div>
                           <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">Provider ID</p>
                           <p className="text-[#0a0a0a] text-[15px] font-semibold font-['Nunito',sans-serif]">{selectedKyc.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div>
                           <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">Category</p>
                           <span className="inline-flex px-[10px] py-[2px] bg-[#e0f2fe] text-[#0284c7] text-[12px] font-bold rounded-full font-['Nunito',sans-serif]">
                             {selectedKyc.roleType}
                           </span>
                        </div>
                        <div>
                           <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">Owner Name</p>
                           <p className="text-[#0a0a0a] text-[15px] font-semibold font-['Nunito',sans-serif]">{selectedKyc.fullName}</p>
                        </div>
                        <div>
                           <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">Submitted Date</p>
                           <p className="text-[#0a0a0a] text-[15px] font-semibold font-['Nunito',sans-serif]">{new Date(selectedKyc.createdAt).toISOString().split('T')[0]}</p>
                        </div>
                     </div>
                  </div>

                  {/* Other Details - Mapped from auth-and-kyc submission */}
                  <div className="border-t border-[#e2e8f0] pt-[30px]">
                     <h3 className="text-[#0f172b] text-[18px] font-bold font-['Nunito',sans-serif] mb-4">
                       Personal Information
                     </h3>
                     <div className="grid grid-cols-2 gap-y-[20px] gap-x-[40px]">
                        <div>
                           <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">Email Address</p>
                           <p className="text-[#0a0a0a] text-[15px] font-semibold font-['Nunito',sans-serif]">{selectedKyc.email}</p>
                        </div>
                        <div>
                           <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">Phone Number</p>
                           <p className="text-[#0a0a0a] text-[15px] font-semibold font-['Nunito',sans-serif]">{selectedKyc.phoneNumber}</p>
                        </div>
                        <div>
                           <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">Nationality</p>
                           <p className="text-[#0a0a0a] text-[15px] font-semibold font-['Nunito',sans-serif]">{selectedKyc.nationality || "US Resident"}</p>
                        </div>
                        <div>
                           <p className="text-[#62748e] text-[13px] font-normal font-['Arimo',sans-serif] mb-1">Present Address</p>
                           <p className="text-[#0a0a0a] text-[15px] font-semibold font-['Nunito',sans-serif] break-words">{selectedKyc.presentAddress || "N/A"}</p>
                        </div>
                     </div>
                  </div>

                  {/* Submitted Documents */}
                  <div className="border-t border-[#e2e8f0] pt-[30px] pb-[30px]">
                     <h3 className="text-[#0f172b] text-[18px] font-bold font-['Nunito',sans-serif] mb-4">
                       Submitted Documents
                     </h3>
                     <div className="flex flex-col gap-[12px]">
                        <DocumentRow 
                          title="ID / Driver License Front" 
                          iconColor="text-[#ff6f75]" 
                          bgColor="bg-[#fff1f2]" 
                          fileName="driver_license_front.pdf" 
                          url={selectedKyc.identificationFrontImage} 
                        />
                        <DocumentRow 
                          title="ID / Driver License Back" 
                          iconColor="text-[#3b82f6]" 
                          bgColor="bg-[#eff6ff]" 
                          fileName="driver_license_back.pdf" 
                          url={selectedKyc.identificationBackImage} 
                        />
                        <DocumentRow 
                          title="Business / Vendor Certificate" 
                          iconColor="text-[#00c950]" 
                          bgColor="bg-[#f0fdf4]" 
                          fileName="business_certificate.pdf" 
                          url={selectedKyc.signatureImage} 
                        />
                     </div>
                  </div>
               </div>

               {/* Action Footer for PENDING only */}
               {statusFilter === "PENDING" && (
                 <div className="px-[30px] py-[20px] border-t border-[#e2e8f0] bg-white shrink-0 flex gap-[16px]">
                    <button 
                      onClick={() => handleApprove(selectedKyc.id)}
                      disabled={isApproving || isRejecting}
                      className="flex-1 bg-[#00c950] hover:bg-[#00b046] text-white flex justify-center items-center gap-[8px] h-[48px] rounded-[10px] font-['Nunito',sans-serif] font-bold text-[16px] transition-colors disabled:opacity-50"
                    >
                       <CheckCircle className="w-[20px] h-[20px]" />
                       {isApproving ? "Approving..." : "Approve KYC"}
                    </button>
                    <button 
                      onClick={() => handleReject(selectedKyc.id)}
                      disabled={isApproving || isRejecting}
                      className="flex-1 bg-[#ff6f75] hover:bg-[#ff5a60] text-white flex justify-center items-center gap-[8px] h-[48px] rounded-[10px] font-['Nunito',sans-serif] font-bold text-[16px] transition-colors disabled:opacity-50"
                    >
                       <XCircle className="w-[20px] h-[20px]" />
                       {isRejecting ? "Rejecting..." : "Reject with Reason"}
                    </button>
                 </div>
               )}
            </div>
          ) : (
            <div className="bg-white border border-[#e2e8f0] rounded-[14px] w-[720px] h-full flex items-center justify-center">
               <p className="text-[#62748e] font-['Arimo',sans-serif]">Select a KYC request to view details</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Document Row Component mimicking Figma exactly
function DocumentRow({ title, iconColor, bgColor, fileName, url }: { title: string; iconColor: string; bgColor: string; fileName: string; url: string }) {
  return (
    <div className="border border-[#e2e8f0] rounded-[10px] p-[16px] flex items-center justify-between">
       <div className="flex items-center gap-[16px]">
          <div className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center ${bgColor}`}>
             <FileText className={`w-[20px] h-[20px] ${iconColor}`} />
          </div>
          <div className="flex flex-col">
             <span className="font-['Arimo',sans-serif] font-bold text-[15px] text-[#0f172b]">{title}</span>
             <span className="font-['Arimo',sans-serif] font-normal text-[13px] text-[#62748e]">{fileName}</span>
          </div>
       </div>
       <a 
          href={url || "#"} 
          target="_blank" 
          rel="noreferrer"
          className="text-[#62748e] hover:text-[#0f172b] p-[8px] rounded-[8px] hover:bg-gray-100 transition-colors"
       >
          <Eye className="w-[20px] h-[20px]" />
       </a>
    </div>
  );
}
