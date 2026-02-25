/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

// Helper to safely extract an array from API responses
const toArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;
  }
  return [];
};
import { format } from "date-fns";
import {
  useGetAllReportsQuery,
  useTakeActionOnReportMutation,
  useUpdateReportStatusMutation,
} from "@/redux/features/api/dashboard/admin/reports/superAdminReportsApi";

export default function AdminCommunityClient() {
  const [filterStatus, setFilterStatus] = useState<string>("PENDING");
  const {
    data: reportsData,
    isLoading,
    refetch,
  } = useGetAllReportsQuery({
    page: 1,
    limit: 20,
    status: filterStatus === "ALL" ? undefined : filterStatus,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateReportStatusMutation();
  const [takeAction, { isLoading: isActing }] = useTakeActionOnReportMutation();

  const handleAction = async (id: string, actionType: string) => {
    if (
      confirm(`Are you sure you want to perform this action: ${actionType}?`)
    ) {
      try {
        await takeAction({
          id,
          action: { type: actionType, reason: "Admin Discretion" },
        }).unwrap();
        refetch();
      } catch (error) {
        console.error("Action error", error);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, data: { status: newStatus } }).unwrap();
      refetch();
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  const reports = toArray(reportsData?.data);
  const filters = ["PENDING", "REVIEWED", "RESOLVED", "DISMISSED", "ALL"];

  return (
    <div className="size-full bg-[#f2f4f8] -m-6 p-6 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col gap-6 w-full max-w-272.5 mx-auto mt-7">
        <div className="flex flex-col gap-2">
          <h1 className="font-['Arimo',sans-serif] font-normal text-[30px] leading-9 text-[#0a0a0a] m-0">
            Community Moderation
          </h1>
          <p className="font-['Arimo',sans-serif] font-normal text-[16px] leading-6 text-[#4a5565] m-0 mt-2">
            Review and manage user reports, content flags, and community guidelines.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] flex flex-col gap-2">
            <p className="text-[#64748b] text-[14px] font-medium">Total Reports</p>
            <p className="text-[#0a0a0a] text-[24px] font-bold">{reports.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] flex flex-col gap-2">
            <p className="text-[#64748b] text-[14px] font-medium">Pending Review</p>
            <p className="text-[#ff7176] text-[24px] font-bold">{reports.filter(r => r.status === 'PENDING').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] flex flex-col gap-2">
            <p className="text-[#64748b] text-[14px] font-medium">Resolved</p>
            <p className="text-green-600 text-[24px] font-bold">{reports.filter(r => r.status === 'RESOLVED').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] flex flex-col gap-2">
            <p className="text-[#64748b] text-[14px] font-medium">Flagged Content</p>
            <p className="text-amber-600 text-[24px] font-bold">{reports.filter(r => r.targetType !== 'USER').length}</p>
          </div>
        </div>

        <div className="bg-white border border-[#e5e7eb] rounded-[14px] w-full flex flex-col overflow-hidden">
          <div className="flex border-b border-[#e5e7eb] px-6 pt-2 bg-white overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-3 font-['Nunito',sans-serif] font-medium text-[15px] transition-colors relative whitespace-nowrap ${
                  filterStatus === f
                    ? "text-[#ff7176]"
                    : "text-[#62748e] hover:text-[#282828]"
                }`}
              >
                {f.replace("_", " ")}
                {filterStatus === f && (
                  <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#ff7176]"></div>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center my-10">
                <div className="w-8 h-8 border-4 border-[#ff7176] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center text-[#62748e] py-8 font-['Arial',sans-serif]">
                No reports found for this status.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e7eb] bg-[#f8fafc]">
                      <th className="py-4 px-6 font-['Nunito',sans-serif] font-semibold text-[13px] text-[#4a5565] tracking-wider text-left uppercase">
                        Date
                      </th>
                      <th className="py-4 px-6 font-['Nunito',sans-serif] font-semibold text-[13px] text-[#4a5565] tracking-wider text-left uppercase">
                        Type
                      </th>
                      <th className="py-4 px-6 font-['Nunito',sans-serif] font-semibold text-[13px] text-[#4a5565] tracking-wider text-left uppercase">
                        Reporter
                      </th>
                      <th className="py-4 px-6 font-['Nunito',sans-serif] font-semibold text-[13px] text-[#4a5565] tracking-wider text-left uppercase">
                        Reason
                      </th>
                      <th className="py-4 px-6 font-['Nunito',sans-serif] font-semibold text-[13px] text-[#4a5565] tracking-wider text-center uppercase">
                        Status
                      </th>
                      <th className="py-4 px-6 font-['Nunito',sans-serif] font-semibold text-[13px] text-[#4a5565] tracking-wider text-center uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report: any) => (
                      <tr
                        key={report.id}
                        className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                      >
                        <td className="py-4 px-6 font-['Arial',sans-serif] text-[14px] text-[#0f172b]">
                          {format(new Date(report.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="py-4 px-6 font-['Arial',sans-serif] text-[14px] text-[#0f172b]">
                          <span className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase ${
                            report.targetType === 'USER' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {report.targetType}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-['Arial',sans-serif] text-[14px] text-[#0f172b]">
                          {report.reporter?.email || report.reporterId || "Unknown"}
                        </td>
                        <td
                          className="py-4 px-6 font-['Arial',sans-serif] text-[14px] text-[#4a5565] max-w-50 truncate"
                          title={report.reason}
                        >
                          {report.reason}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusChange(report.id, e.target.value)
                            }
                            disabled={isUpdating}
                            className="font-['Arial',sans-serif] text-[12px] border border-[#e2e8f0] rounded-lg px-3 py-1.5 outline-none focus:border-[#ff7176] bg-white cursor-pointer hover:border-[#ff7176] transition-colors font-medium text-[#0f172b]"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="REVIEWED">Reviewed</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="DISMISSED">Dismissed</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={() =>
                                handleAction(report.id, "DELETE_CONTENT")
                              }
                              disabled={isActing}
                              className="text-[12px] font-['Nunito',sans-serif] font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-tight"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                handleAction(report.id, "SUSPEND_USER")
                              }
                              disabled={isActing}
                              className="text-[12px] font-['Nunito',sans-serif] font-bold text-[#0a0a0a] hover:text-red-600 transition-colors uppercase tracking-tight"
                            >
                              Suspend
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
