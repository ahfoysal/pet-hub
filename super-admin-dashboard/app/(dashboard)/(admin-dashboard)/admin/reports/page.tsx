"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useGetAllReportsQuery, useTakeActionOnReportMutation } from "@/redux/features/api/dashboard/admin/reports/superAdminReportsApi";
import { useToast } from "@/contexts/ToastContext";
import { Search, Eye } from "lucide-react";
import ReportDetailsModal from "@/components/dashboard/admin/reports/ReportDetailsModal";
import ReportActionModal from "@/components/dashboard/admin/reports/ReportActionModal";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("ALL REPORTS");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const { showToast } = useToast();

  const { data: reportsResponse, isLoading, refetch } = useGetAllReportsQuery({
    limit: 100,
  });

  const [takeAction, { isLoading: isSubmittingAction }] = useTakeActionOnReportMutation();

  let reports: any[] = [];
  if (Array.isArray(reportsResponse?.data?.data)) {
    reports = reportsResponse.data.data;
  } else if (Array.isArray(reportsResponse?.data?.items)) {
    reports = reportsResponse.data.items;
  } else if (Array.isArray(reportsResponse?.data)) {
    reports = reportsResponse.data;
  } else if (Array.isArray(reportsResponse)) {
    reports = reportsResponse;
  }

  const filteredReports = reports.filter((report: any) => {
    const matchesSearch = report.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.complainId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (activeTab) {
      case "PENDING":
        return report.status === "PENDING";
      case "RESOLVED":
        return report.status === "RESOLVED";
      case "DISMISSED":
        return report.status === "DISMISSED";
      default:
        return true;
    }
  });

  const totalReports = reports.length;
  const pendingReports = reports.filter((r: any) => r.status === "PENDING").length;
  const resolvedReports = reports.filter((r: any) => r.status === "RESOLVED").length;
  const highSeverityReports = reports.filter((r: any) => r.severity === "High" || r.status === "OPEN").length;

  const handleViewDetails = (report: any) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  const handleTakeAction = async (actionType: "WARN" | "SUSPEND" | "RESOLVE", notes: string) => {
    if (!selectedReport) return;
    // setIsSubmittingAction(true); // This line was commented out in the original, but the instruction implies adding it.
    // However, the `isSubmittingAction` state is derived from the mutation hook, so setting it manually here is incorrect.
    // The instruction seems to have a typo `y {` after `setIsSubmittingAction(true);`.
    // I will only apply the type change and parameter name change as requested, and correct the `note` usage.
    
    try {
      await takeAction({
        id: selectedReport.id,
        action: { actionType, note: notes }
      }).unwrap();
      
      showToast(`Action ${actionType} taken successfully`, "success");
      setIsActionModalOpen(false);
      setSelectedReport(null);
      refetch();
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to take action", "error");
    }
  };

  return (
    <div className="w-full h-full bg-[#f2f4f8] -m-6 p-6 min-h-[calc(100vh-80px)]">
      <div className="w-[1090px] mx-auto mt-[26px]">
        
        {/* Header Text */}
        <div className="mb-[24px]">
          <h1 className="font-['Nunito',sans-serif] font-medium leading-[36px] text-[#0a0a0a] text-[30px] m-0">
            Reports & Complaints
          </h1>
          <p className="font-['Arimo',sans-serif] font-normal leading-[24px] text-[#4a5565] text-[16px] m-0 mt-[8px]">
             Manage user reports and resolve platform issues
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-4 gap-[24px] mb-[24px] h-[110px]">
          {/* Open Reports */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] pt-[25px] px-[25px] pb-px flex flex-col gap-[4px]">
            <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0">
              Open Reports
            </p>
            <h2 className="font-['Inter',sans-serif] font-bold text-[30px] leading-[36px] text-[#e7000b] m-0">
              {isLoading ? "-" : totalReports}
            </h2>
          </div>

          {/* In Review */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] pt-[25px] px-[25px] pb-px flex flex-col gap-[4px]">
            <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0">
              In Review
            </p>
            <h2 className="font-['Inter',sans-serif] font-bold text-[30px] leading-[36px] text-[#155dfc] m-0">
              {isLoading ? "-" : pendingReports}
            </h2>
          </div>

          {/* Resolved */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] pt-[25px] px-[25px] pb-px flex flex-col gap-[4px]">
            <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0">
              Resolved
            </p>
            <h2 className="font-['Inter',sans-serif] font-bold text-[30px] leading-[36px] text-[#00a63e] m-0">
              {isLoading ? "-" : resolvedReports}
            </h2>
          </div>

          {/* High Severity */}
          <div className="bg-white border border-[#e2e8f0] rounded-[14px] pt-[25px] px-[25px] pb-px flex flex-col gap-[4px]">
            <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0">
              High Severity
            </p>
            <h2 className="font-['Inter',sans-serif] font-bold text-[30px] leading-[36px] text-[#e7000b] m-0">
              {isLoading ? "-" : highSeverityReports}
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-[12px] mb-[24px]">
          {["All Reports", "In Review", "Resolved", "High Severity"].map((tab) => {
            const isActive = activeTab === tab || (activeTab === "ALL REPORTS" && tab === "All Reports") || (activeTab === "PENDING" && tab === "In Review");
            return (
              <button
                key={tab}
                className={`h-[36px] px-[16px] py-[8px] rounded-[10px] font-['Nunito',sans-serif] font-normal text-[14px] leading-[20px] transition-colors flex items-center justify-center ${
                  isActive
                    ? "bg-[#ff7176] text-white"
                    : "bg-[#f1f5f9] text-[#314158] hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab === "All Reports" ? "ALL REPORTS" : tab.toUpperCase())}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-[24px] items-start mb-[40px]">
          
          {/* Left Column: Report List */}
          <div className="w-[494px] bg-white border border-[#e2e8f0] rounded-[14px] flex flex-col shrink-0 overflow-hidden">
            {/* List Header */}
            <div className="bg-[#f8fafc] border-b border-[#e2e8f0] py-[16px] px-[16px]">
              <h3 className="font-['Inter',sans-serif] font-semibold text-[16px] leading-[24px] text-[#0f172b] m-0">
                Active Reports
              </h3>
            </div>

            {/* List Items */}
            <div className="flex flex-col overflow-y-auto max-h-[600px] min-h-[400px]">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7176]"></div>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="py-10 text-center font-['Inter',sans-serif] text-[#555555]">
                  No reports found.
                </div>
              ) : (
                filteredReports.map((report: any) => {
                  const isSelected = selectedReport?.id === report.id;
                  
                  // Map statuses to specific colors based on Figma
                  let statusBg = "bg-[#f1f5f9]";
                  let statusText = "text-[#64748b]";
                  let statusBorder = "border-[rgba(0,0,0,0.1)]";
                  let severityBg = "bg-[#fef9c2]";
                  let severityText = "text-[#d08700]";
                  let severityLabel = "Low";

                  if (report.status === "PENDING" || report.status === "IN REVIEW") {
                    statusBg = isSelected ? "bg-[rgba(255,113,118,0.1)]" : "bg-white"; // Assuming background logic if needed, Figma says bg is white or light red
                    statusText = "text-[#ff7176]";
                    statusBorder = "border-[rgba(255,113,118,0.2)]";
                  } else if (report.status === "RESOLVED") {
                    statusText = "text-[#00a63e]";
                  } else if (report.status === "OPEN" || report.severity === "High") {
                    statusBg = "bg-[#ffe2e2]";
                    statusBorder = "border-[#ffc9c9]";
                    statusText = "text-[#c10007]";
                    severityBg = "bg-[#ffe2e2]";
                    severityText = "text-[#e7000b]";
                    severityLabel = "High";
                  }

                  return (
                    <div 
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`border-b border-[#e2e8f0] p-[16px] cursor-pointer transition-colors ${
                        isSelected ? "bg-[rgba(255,113,118,0.1)]" : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {/* Name and Warning Icon */}
                      <div className="flex items-center gap-[8px] mb-[8px]">
                        <Image src="/assets/icons/warning-circle.svg" alt="Warning" width={16} height={16} />
                        <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-[20px] text-[#0f172b]">
                          {report.reporter?.fullName || "Unknown User"}
                        </span>
                      </div>
                      
                      {/* Subject */}
                      <p className="font-['Inter',sans-serif] font-normal text-[12px] leading-[16px] text-[#45556c] mb-[8px] truncate">
                        {report.subject || "No Subject"}
                      </p>

                      {/* Badges */}
                      <div className="flex items-center gap-[8px] mb-[8px]">
                        <div className={`border ${statusBorder} ${isSelected && report.status === 'PENDING' ? 'bg-[rgba(255,113,118,0.1)]' : statusBg} rounded-[33554400px] px-[11px] py-[3px] flex items-center justify-center`}>
                          <span className={`${statusText} font-['Inter',sans-serif] font-medium text-[12px] leading-[16px]`}>
                            {report.status === 'PENDING' ? 'In Review' : report.status || "Open"}
                          </span>
                        </div>
                        <div className={`${severityBg} rounded-[33554400px] px-[8px] py-[2px] flex items-center justify-center`}>
                          <span className={`${severityText} font-['Inter',sans-serif] font-normal text-[12px] leading-[16px]`}>
                            {severityLabel}
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <p className="font-['Inter',sans-serif] font-normal text-[12px] leading-[16px] text-[#62748e] m-0">
                        {report.createdAt ? format(new Date(report.createdAt), "yyyy-MM-dd") : "N/A"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Report Details */}
          <div className="flex-1 bg-white border border-[#e2e8f0] rounded-[21px] p-[24px]">
            {!selectedReport ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-[#45556c]">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4">
                  <path d="M40.0013 5.33398H16.0013C14.5868 5.33398 13.2303 5.89589 12.2301 6.89608C11.2299 7.89628 10.668 9.25283 10.668 10.6673V53.334C10.668 54.7485 11.2299 56.105 12.2301 57.1052C13.2303 58.1054 14.5868 58.6673 16.0013 58.6673H48.0013C49.4158 58.6673 50.7723 58.1054 51.7725 57.1052C52.7727 56.105 53.3346 54.7485 53.3346 53.334V18.6673L40.0013 5.33398Z" stroke="#CAD5E2" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M37.332 5.33398V16.0007C37.332 17.4151 37.8939 18.7717 38.8941 19.7719C39.8943 20.7721 41.2509 21.334 42.6654 21.334H53.332" stroke="#CAD5E2" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M26.6654 24H21.332" stroke="#CAD5E2" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M42.6654 34.666H21.332" stroke="#CAD5E2" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M42.6654 45.334H21.332" stroke="#CAD5E2" strokeWidth="5.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="font-['Inter',sans-serif] text-[16px]">Select a report to view details</p>
              </div>
            ) : (
              <div className="flex flex-col gap-[16px]">
                {/* Details Header */}
                <div className="bg-[#ff7176] rounded-[12px] border-b border-[#e2e8f0] px-[24px] py-[24px] flex justify-between items-start">
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex items-center gap-[8px]">
                      <Image src="/assets/icons/document-white.svg" alt="Report" width={24} height={24} />
                      <h2 className="font-['Inter',sans-serif] font-bold text-[24px] leading-[32px] text-white m-0">
                        Report #{selectedReport.complainId || selectedReport.id.slice(0, 6).toUpperCase()}
                      </h2>
                    </div>
                    <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-[#ffe2e2] m-0">
                      {selectedReport.subject || "No Subject"}
                    </p>
                  </div>
                  <div className="bg-white rounded-[33554400px] border border-[rgba(255,113,118,0.2)] px-[11px] py-[3px] flex items-center justify-center">
                    <span className="font-['Inter',sans-serif] font-medium text-[12px] leading-[16px] text-[#ff7176]">
                      {selectedReport.status === 'PENDING' ? 'In Review' : selectedReport.status || 'Open'}
                    </span>
                  </div>
                </div>

                {/* Users Info Grid */}
                <div className="grid grid-cols-2 gap-[24px] mt-[8px]">
                  {/* Reported User (Placeholder for now as API might not provide target user clearly) */}
                  <div className="flex flex-col gap-[12px]">
                    <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#314158] m-0">
                      Reported User
                    </h3>
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pt-[17px] px-[17px] pb-px flex flex-col gap-[4px] min-h-[82px] justify-center">
                      <p className="font-['Inter',sans-serif] font-medium text-[16px] leading-[24px] text-[#0f172b] m-0">
                        Target Entity
                      </p>
                      <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0">
                        System User
                      </p>
                    </div>
                  </div>

                  {/* Reported By */}
                  <div className="flex flex-col gap-[12px]">
                    <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#314158] m-0">
                      Reported By
                    </h3>
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pt-[17px] px-[17px] pb-px flex flex-col gap-[4px] min-h-[82px] justify-center">
                      <p className="font-['Inter',sans-serif] font-medium text-[16px] leading-[24px] text-[#0f172b] m-0 truncate">
                        {selectedReport.reporter?.fullName || "Unknown User"}
                      </p>
                      <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0">
                        {selectedReport.reporter?.role || "Pet Owner"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Report Info Grid */}
                <div className="flex flex-col gap-[12px] mt-[8px]">
                  <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#314158] m-0">
                    Report Information
                  </h3>
                  <div className="grid grid-cols-3 gap-[8px]">
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pt-[17px] px-[17px] pb-px flex flex-col gap-[4px] min-h-[82px] justify-center">
                      <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0">
                        Booking Reference
                      </p>
                      <p className="font-['Inter',sans-serif] font-medium text-[16px] leading-[24px] text-[#0f172b] m-0 truncate">
                        {selectedReport.bookingId || "N/A"}
                      </p>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pt-[17px] px-[17px] pb-px flex flex-col gap-[4px] min-h-[82px] justify-center">
                      <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0">
                        Report Date
                      </p>
                      <p className="font-['Inter',sans-serif] font-medium text-[16px] leading-[24px] text-[#0f172b] m-0">
                        {selectedReport.createdAt ? format(new Date(selectedReport.createdAt), "yyyy-MM-dd") : "N/A"}
                      </p>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] pt-[17px] px-[17px] pb-px flex flex-col gap-[4px] min-h-[82px] justify-center">
                      <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#45556c] m-0 mb-1 mt-[-6px]">
                        Severity
                      </p>
                      <div className="bg-[#fef9c2] rounded-[33554400px] px-[8px] py-[4px] w-fit flex items-center justify-center">
                        <span className="font-['Inter',sans-serif] font-normal text-[12px] leading-[16px] text-[#d08700]">
                          Low
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason for Report */}
                <div className="flex flex-col gap-[12px] mt-[8px]">
                  <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-[#314158] m-0">
                    Reason for Report
                  </h3>
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] py-[17px] px-[17px]">
                    <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-[#0f172b] m-0">
                      {selectedReport.details || selectedReport.subject || "No additional details provided."}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[#f8fafc] w-full my-[8px]"></div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-[12px]">
                  <button 
                    className="bg-[#ff7176] rounded-[7px] p-[10px] flex items-center justify-center gap-[10px] hover:bg-[#ff5c62] transition-colors"
                    onClick={() => console.log("View Logs")}
                  >
                    <Image src="/assets/icons/document-normal.svg" alt="Logs" width={20} height={20} />
                    <span className="font-['Inter',sans-serif] font-medium text-[16px] leading-[24px] text-white">View Logs</span>
                  </button>
                  <button 
                    className="bg-[#e17100] rounded-[7px] p-[10px] flex items-center justify-center gap-[10px] hover:bg-[#cc6600] transition-colors"
                    onClick={() => handleTakeAction("WARN", "Warning issued by admin")}
                  >
                    <Image src="/assets/icons/warning-triangle.svg" alt="Warn" width={20} height={20} />
                    <span className="font-['Inter',sans-serif] font-medium text-[16px] leading-[24px] text-white">Warn User</span>
                  </button>
                  <button 
                    className="bg-[#e7000b] rounded-[7px] p-[10px] flex items-center justify-center gap-[10px] hover:bg-[#cc000a] transition-colors"
                    onClick={() => handleTakeAction("SUSPEND", "Account suspended by admin")}
                  >
                    <Image src="/assets/icons/user-minus.svg" alt="Suspend" width={20} height={20} />
                    <span className="font-['Inter',sans-serif] font-medium text-[16px] leading-[24px] text-white">Suspend Account</span>
                  </button>
                  <button 
                    className="bg-[#00a63e] rounded-[7px] p-[10px] flex items-center justify-center gap-[10px] hover:bg-[#008c34] transition-colors"
                    onClick={() => handleTakeAction("RESOLVE", "Issue marked resolved")}
                  >
                    <Image src="/assets/icons/tick-circle-white.svg" alt="Resolve" width={20} height={20} />
                    <span className="font-['Inter',sans-serif] font-medium text-[16px] leading-[24px] text-white">Resolve Issue</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          if (!isActionModalOpen) setSelectedReport(null);
        }}
        report={selectedReport}
        onTakeAction={() => {
          setIsDetailsModalOpen(false);
          setIsActionModalOpen(true);
        }}
      />

      <ReportActionModal 
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedReport(null);
        }}
        report={selectedReport}
        onSubmit={handleTakeAction}
        isSubmitting={isSubmittingAction}
      />
    </div>
  );
}
