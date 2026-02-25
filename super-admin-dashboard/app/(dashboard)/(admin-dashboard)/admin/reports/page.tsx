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

  const reports = reportsResponse?.data || [];

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

  const handleViewDetails = (report: any) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  const handleTakeAction = async (actionType: "WARN" | "SUSPEND", note: string) => {
    if (!selectedReport) return;
    
    try {
      await takeAction({
        id: selectedReport.id,
        action: { actionType, note }
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
        <div className="mb-[25px]">
          <h1 className="font-['Nunito',sans-serif] font-medium leading-[36px] text-[#0a0a0a] text-[30px] m-0">
            Reports & Complaints
          </h1>
          <p className="font-['Arimo',sans-serif] font-normal leading-[19.2px] text-[#555555] text-[16px] m-0 mt-[8px]">
             Manage user feedhacks and complaints efficiently.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="flex gap-[25px] mb-[25px]">
          {/* Total Reports */}
          <div className="bg-white rounded-[24px] p-[24px] w-[346.67px] shadow-[0px_4px_20px_0px_#0000000a]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-['Nunito',sans-serif] font-medium text-[20px] leading-[26px] text-[#555555] m-0">Total Reports</p>
                <h2 className="font-['Nunito',sans-serif] font-bold text-[36px] leading-[46.8px] text-[#0a0a0a] m-0 mt-[16px]">
                  {isLoading ? "-" : totalReports}
                </h2>
              </div>
              <div className="w-[52px] h-[52px] bg-[#f2f4f8] rounded-full flex items-center justify-center">
                <Image src="/assets/icons/document-text.svg" alt="Total Reports" width={24} height={24} />
              </div>
            </div>
            <p className="font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#555555] m-0 mt-[16px]">
              +5% from last month
            </p>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-[24px] p-[24px] w-[346.67px] shadow-[0px_4px_20px_0px_#0000000a]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-['Nunito',sans-serif] font-medium text-[20px] leading-[26px] text-[#555555] m-0">Pending Reviews</p>
                <h2 className="font-['Nunito',sans-serif] font-bold text-[36px] leading-[46.8px] text-[#0a0a0a] m-0 mt-[16px]">
                  {isLoading ? "-" : pendingReports}
                </h2>
              </div>
              <div className="w-[52px] h-[52px] bg-[#fff5f5] rounded-full flex items-center justify-center">
                <Image src="/assets/icons/document-text-red.svg" alt="Pending Reviews" width={24} height={24} />
              </div>
            </div>
            <p className="font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#555555] m-0 mt-[16px]">
              Needs immediate attention
            </p>
          </div>

          {/* Resolved Issues */}
          <div className="bg-white rounded-[24px] p-[24px] w-[346.67px] shadow-[0px_4px_20px_0px_#0000000a]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-['Nunito',sans-serif] font-medium text-[20px] leading-[26px] text-[#555555] m-0">Resolved Issues</p>
                <h2 className="font-['Nunito',sans-serif] font-bold text-[36px] leading-[46.8px] text-[#0a0a0a] m-0 mt-[16px]">
                  {isLoading ? "-" : resolvedReports}
                </h2>
              </div>
              <div className="w-[52px] h-[52px] bg-[#f0fbf5] rounded-full flex items-center justify-center">
                <Image src="/assets/icons/tick-circle-green.svg" alt="Resolved Issues" width={24} height={24} />
              </div>
            </div>
            <p className="font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#555555] m-0 mt-[16px]">
              Successfully managed
            </p>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-[24px] p-[24px] shadow-[0px_4px_20px_0px_#0000000a]">
          {/* Controls */}
          <div className="flex justify-between items-center mb-[24px]">
            <div className="flex gap-[8px] border-b border-[#e2e8f0] w-full max-w-[430px]">
              {["ALL REPORTS", "PENDING", "RESOLVED", "DISMISSED"].map((tab) => (
                <button
                  key={tab}
                  className={`pb-[14px] px-[4px] font-['Nunito',sans-serif] font-bold text-[16px] leading-[20.8px] relative ${
                    activeTab === tab ? "text-[#ff7176]" : "text-[#555555] hover:text-[#0a0a0a]"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#ff7176] rounded-t-[100px]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-[16px]">
              <div className="relative">
                <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Search by ID or Subject"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[300px] h-[52px] pl-[48px] pr-[16px] bg-[#f2f4f8] rounded-[16px] border-none font-['Arimo',sans-serif] text-[16px] text-[#0a0a0a] placeholder:text-[#9ca3af] focus:ring-1 focus:ring-[#ff7176] outline-none"
                />
              </div>
              <button className="flex items-center justify-center gap-[8px] w-[130px] h-[52px] border border-[#e2e8f0] rounded-[12px] font-['Nunito',sans-serif] font-bold text-[18px] text-[#0a0a0a] hover:bg-gray-50 transition-colors">
                <Image src="/assets/icons/filter.svg" alt="Filter" width={24} height={24} />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f2f4f8] rounded-[12px]">
                  <th className="py-[16px] px-[20px] text-left font-['Nunito',sans-serif] font-bold text-[16px] leading-[20.8px] text-[#555555] first:rounded-l-[12px]">Report ID</th>
                  <th className="py-[16px] px-[20px] text-left font-['Nunito',sans-serif] font-bold text-[16px] leading-[20.8px] text-[#555555]">Reported By</th>
                  <th className="py-[16px] px-[20px] text-left font-['Nunito',sans-serif] font-bold text-[16px] leading-[20.8px] text-[#555555]">Subject</th>
                  <th className="py-[16px] px-[20px] text-left font-['Nunito',sans-serif] font-bold text-[16px] leading-[20.8px] text-[#555555]">Date</th>
                  <th className="py-[16px] px-[20px] text-left font-['Nunito',sans-serif] font-bold text-[16px] leading-[20.8px] text-[#555555]">Status</th>
                  <th className="py-[16px] px-[20px] text-left font-['Nunito',sans-serif] font-bold text-[16px] leading-[20.8px] text-[#555555] last:rounded-r-[12px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-[40px] text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7176]"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-[40px] text-center font-['Arimo',sans-serif] text-[#555555]">
                       No reports found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report: any, index: number) => (
                    <tr key={report.id} className="border-b border-[#e2e8f0] last:border-none">
                      <td className="py-[16px] px-[20px] font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#0a0a0a]">
                        #{report.complainId || "12341"}
                      </td>
                      <td className="py-[16px] px-[20px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="w-[40px] h-[40px] rounded-[10px] overflow-hidden bg-gray-200 shrink-0">
                            {report.reporter?.image ? (
                              <Image src={report.reporter.image} alt={report.reporter.fullName} width={40} height={40} className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold">
                                {report.reporter?.fullName?.[0] || "?"}
                              </div>
                            )}
                          </div>
                          <span className="font-['Arimo',sans-serif] font-medium text-[16px] leading-[24px] text-[#0a0a0a]">
                            {report.reporter?.fullName || "Unknown User"}
                          </span>
                        </div>
                      </td>
                      <td className="py-[16px] px-[20px] font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#0a0a0a]">
                        {report.subject || "No Subject"}
                      </td>
                      <td className="py-[16px] px-[20px] font-['Arimo',sans-serif] font-normal text-[16px] leading-[24px] text-[#555555]">
                        {report.createdAt ? format(new Date(report.createdAt), "MMM dd, yyyy") : "N/A"}
                      </td>
                      <td className="py-[16px] px-[20px]">
                        <span className={`px-[12px] py-[4px] rounded-[24px] font-['Nunito',sans-serif] font-bold text-[14px] leading-[19.1px] ${
                          report.status === "PENDING" ? "bg-[#fff5f5] text-[#ff7176]" :
                          report.status === "RESOLVED" ? "bg-[#f0fbf5] text-[#22c55e]" :
                          "bg-[#f1f5f9] text-[#64748b]"
                        }`}>
                          {report.status || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="py-[16px] px-[20px]">
                        <button 
                          onClick={() => handleViewDetails(report)}
                          className="flex items-center justify-center w-[36px] h-[36px] bg-transparent border border-[#e2e8f0] rounded-[8px] hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-[18px] h-[18px] text-[#555555]" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder */}
          {!isLoading && filteredReports.length > 0 && (
            <div className="mt-[24px] flex justify-between items-center border-t border-[#e2e8f0] pt-[24px]">
              <span className="font-['Arimo',sans-serif] font-normal text-[14px] leading-[20px] text-[#555555]">
                Showing 1 to {Math.min(10, filteredReports.length)} of {filteredReports.length} entries
              </span>
              <div className="flex gap-[8px]">
                <button className="w-[36px] h-[36px] rounded-[8px] flex flex-col justify-center items-center bg-transparent border border-[#e2e8f0] hover:bg-gray-50 text-[#555555]">
                  &lt;
                </button>
                <button className="w-[36px] h-[36px] rounded-[8px] flex flex-col justify-center items-center bg-[#ff7176] text-white font-['Nunito',sans-serif] font-bold">
                  1
                </button>
                <button className="w-[36px] h-[36px] rounded-[8px] flex flex-col justify-center items-center bg-transparent border border-[#e2e8f0] hover:bg-gray-50 text-[#555555]">
                  &gt;
                </button>
              </div>
          )}

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
