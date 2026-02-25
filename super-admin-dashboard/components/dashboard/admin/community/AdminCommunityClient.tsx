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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-['Nunito',sans-serif] font-bold text-[24px] leading-8 text-[#282828]">
          Community Moderation
        </h1>
        <p className="font-['Arial',sans-serif] text-[14px] leading-5 text-[#62748e] mt-1">
          Review and manage user reports, content flags, and community
          guidelines.
        </p>
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-[14px] w-full flex flex-col overflow-hidden">
        <div className="flex border-b border-[#e5e7eb] px-6 pt-2 bg-[#f8fafc] overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-3 font-['Nunito',sans-serif] font-medium text-[15px] transition-colors relative whitespace-nowrap ${
                filterStatus === f
                  ? "text-[#00c950]"
                  : "text-[#62748e] hover:text-[#282828]"
              }`}
            >
              {f}
              {filterStatus === f && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#00c950]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center my-10">
              <div className="w-8 h-8 border-4 border-[#00c950] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center text-[#62748e] py-8 font-['Arial',sans-serif]">
              No reports found for this status.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="pb-3 pt-4 px-4 font-['Nunito',sans-serif] font-medium text-[14px] text-[#62748e]">
                      DATE
                    </th>
                    <th className="pb-3 pt-4 px-4 font-['Nunito',sans-serif] font-medium text-[14px] text-[#62748e]">
                      TYPE
                    </th>
                    <th className="pb-3 pt-4 px-4 font-['Nunito',sans-serif] font-medium text-[14px] text-[#62748e]">
                      REPORTER
                    </th>
                    <th className="pb-3 pt-4 px-4 font-['Nunito',sans-serif] font-medium text-[14px] text-[#62748e]">
                      REASON
                    </th>
                    <th className="pb-3 pt-4 px-4 font-['Nunito',sans-serif] font-medium text-[14px] text-[#62748e]">
                      STATUS
                    </th>
                    <th className="pb-3 pt-4 px-4 font-['Nunito',sans-serif] font-medium text-[14px] text-[#62748e]">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report: any) => (
                    <tr
                      key={report.id}
                      className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="py-4 px-4 font-['Arial',sans-serif] text-[14px] text-[#0f172b]">
                        {format(new Date(report.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="py-4 px-4 font-['Arial',sans-serif] text-[14px] text-[#0f172b] capitalize">
                        {report.targetType}
                      </td>
                      <td className="py-4 px-4 font-['Arial',sans-serif] text-[14px] text-[#0f172b]">
                        {report.reporter?.email ||
                          report.reporterId ||
                          "Unknown"}
                      </td>
                      <td
                        className="py-4 px-4 font-['Arial',sans-serif] text-[14px] text-[#0f172b] max-w-50 truncate"
                        title={report.reason}
                      >
                        {report.reason}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={report.status}
                          onChange={(e) =>
                            handleStatusChange(report.id, e.target.value)
                          }
                          disabled={isUpdating}
                          className="font-['Arial',sans-serif] text-[13px] border border-[#e5e7eb] rounded-md px-2 py-1 outline-none focus:border-[#00c950]"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="DISMISSED">Dismissed</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleAction(report.id, "DELETE_CONTENT")
                            }
                            disabled={isActing}
                            className="text-[13px] font-['Nunito',sans-serif] font-medium text-red-600 hover:text-red-700 hover:underline"
                          >
                            Delete Content
                          </button>
                          <button
                            onClick={() =>
                              handleAction(report.id, "SUSPEND_USER")
                            }
                            disabled={isActing}
                            className="text-[13px] font-['Nunito',sans-serif] font-medium text-red-600 hover:text-red-700 hover:underline"
                          >
                            Suspend User
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
  );
}
