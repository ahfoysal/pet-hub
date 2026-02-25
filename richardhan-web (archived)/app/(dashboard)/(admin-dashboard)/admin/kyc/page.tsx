"use client";

import { useState } from "react";
import { useGetAllKycSubmissionsQuery } from "@/redux/features/api/dashboard/admin/kyc/adminKycApi";
import { Eye, Search, Filter, CheckCircle, XCircle, FileCheck, Clock, UserCheck } from "lucide-react";
import KycDetailsModal from "@/components/dashboard/admin/kyc/KycDetailsModal";
import { KYCData } from "@/types/dashboard/admin/kyc/adminKycType";
import {
  useApproveKycMutation,
  useRejectKycMutation,
} from "@/redux/features/api/dashboard/admin/kyc/adminKycApi";
import { useToast } from "@/contexts/ToastContext";
import { useSession } from "next-auth/react";

export default function AdminKycPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedKyc, setSelectedKyc] = useState<KYCData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { status } = useSession();

  const { data, isLoading, isError, refetch } = useGetAllKycSubmissionsQuery(undefined, {
    skip: status === "loading",
  });
  const [approveKyc, { isLoading: isApproving }] = useApproveKycMutation();
  const [rejectKyc, { isLoading: isRejecting }] = useRejectKycMutation();
  const { showToast } = useToast();

  // Filter data based on search and status
  const filteredData = data?.data?.filter((kyc) => {
    const matchesSearch =
      kyc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.phoneNumber.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || kyc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (kyc: KYCData) => {
    setSelectedKyc(kyc);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await approveKyc(id).unwrap();
      showToast(result.message || "KYC approved successfully!", "success");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to approve KYC", "error");
    }
  };

  const handleReject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await rejectKyc(id).unwrap();
      showToast(result.message || "KYC rejected successfully!", "success");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to reject KYC", "error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Rejected
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-50 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load KYC submissions</h2>
          <p className="text-gray-500 mb-5">Something went wrong. Please try again.</p>
          <button 
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold">
          KYC Verification
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Review and manage user verification requests
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border-0"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-5 w-5 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border-0 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {data?.data?.length || 0}
              </p>
            </div>
            <div className="p-3.5 bg-blue-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <FileCheck className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-amber-500 mt-2">
                {data?.data?.filter((k) => k.status === "PENDING").length || 0}
              </p>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Approved</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">
                {data?.data?.filter((k) => k.status === "APPROVED").length || 0}
              </p>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <UserCheck className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* KYC Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All KYC Submissions
            <span className="ml-2 text-sm font-normal text-gray-500">
              {filteredData?.length || 0} submissions
            </span>
          </h2>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((kyc, index) => (
              <div
                key={kyc.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  index !== 0 ? "border-t border-gray-50" : ""
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={kyc.image}
                    alt={kyc.fullName}
                    className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {kyc.fullName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {kyc.email}
                    </p>
                    <p className="text-xs text-gray-400">{kyc.phoneNumber}</p>
                  </div>
                  {getStatusBadge(kyc.status)}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-violet-50 text-violet-700">
                        {kyc.roleType}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(kyc.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(kyc)}
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      <Eye className="h-5 w-5" />
                      <span className="text-sm font-medium">View</span>
                    </button>
                  </div>
                  {kyc.status === "PENDING" && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                      <button
                        onClick={(e) => handleReject(kyc.id, e)}
                        disabled={isRejecting}
                        className="flex-1 px-3 py-2.5 bg-red-50 text-red-600 cursor-pointer rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        onClick={(e) => handleApprove(kyc.id, e)}
                        disabled={isApproving}
                        className="flex-1 px-3 py-2.5 cursor-pointer bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-600">No KYC submissions found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((kyc, index) => (
                  <tr
                    key={kyc.id}
                    className="hover:bg-gray-50/50 transition-colors"
                    style={{ borderTop: index !== 0 ? '1px solid #f9fafb' : 'none' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={kyc.image}
                          alt={kyc.fullName}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {kyc.fullName}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {kyc.identificationType} - {kyc.identificationNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{kyc.email}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {kyc.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-violet-50 text-violet-700">
                        {kyc.roleType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(kyc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(kyc.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewDetails(kyc)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {kyc.status === "PENDING" && (
                          <>
                            <button
                              onClick={(e) => handleReject(kyc.id, e)}
                              disabled={isRejecting}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => handleApprove(kyc.id, e)}
                              disabled={isApproving}
                              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-base font-medium text-gray-600">
                      No KYC submissions found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Details Modal */}
      {selectedKyc && (
        <KycDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedKyc(null);
          }}
          kycData={selectedKyc}
        />
      )}
    </div>
  );
}
