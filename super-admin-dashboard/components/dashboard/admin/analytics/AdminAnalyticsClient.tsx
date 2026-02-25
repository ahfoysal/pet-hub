/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  useGetOverviewHotelsQuery,
  useGetOverviewPetOwnersQuery,
  useGetOverviewPetSittersQuery,
  useGetOverviewSchoolsQuery,
  useGetOverviewVendorsQuery,
} from "@/redux/features/api/dashboard/admin/analytics/superAdminAnalyticsApi";

type TabKey = "hotels" | "owners" | "sitters" | "schools" | "vendors";

export default function AdminAnalyticsClient() {
  const [activeTab, setActiveTab] = useState<TabKey>("hotels");

  const { data: hotelsData, isLoading: isLoadingHotels } =
    useGetOverviewHotelsQuery({ page: 1, limit: 10 });
  const { data: ownersData, isLoading: isLoadingOwners } =
    useGetOverviewPetOwnersQuery({ page: 1, limit: 10 });
  const { data: sittersData, isLoading: isLoadingSitters } =
    useGetOverviewPetSittersQuery({ page: 1, limit: 10 });
  const { data: schoolsData, isLoading: isLoadingSchools } =
    useGetOverviewSchoolsQuery({ page: 1, limit: 10 });
  const { data: vendorsData, isLoading: isLoadingVendors } =
    useGetOverviewVendorsQuery({ page: 1, limit: 10 });

  // Helper to safely extract array from API response data
  const toArray = (data: any): Record<string, any>[] => {
    console.log("[toArray] input:", JSON.stringify(data)?.substring(0, 300));
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      // Check common wrappers: data.data, data.items, data.results
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.results)) return data.results;
    }
    return [];
  };

  const renderTable = (
    items: Record<string, any>[],
    columns: { key: string; label: string }[],
    isLoading: boolean,
  ) => {
    if (isLoading) {
      return (
        <div className="flex justify-center my-10">
          <div className="w-8 h-8 border-4 border-[#00c950] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return (
        <div className="text-center text-[#62748e] py-8 font-['Arial',sans-serif]">
          No records found.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="pb-3 pt-4 px-4 font-['Nunito',sans-serif] font-medium text-[14px] text-[#62748e]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id || item.userId || idx}
                className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors"
              >
                {columns.map((col) => {
                  const val = col.key.includes(".")
                    ? col.key
                        .split(".")
                        .reduce(
                          (acc: Record<string, any>, part: string) =>
                            acc && acc[part],
                          item,
                        )
                    : item[col.key];
                  return (
                    <td
                      key={col.key}
                      className="py-4 px-4 font-['Arial',sans-serif] text-[14px] text-[#0f172b]"
                    >
                      {val || "N/A"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const tabs: { id: TabKey; label: string }[] = [
    { id: "hotels", label: "Pet Hotels" },
    { id: "owners", label: "Pet Owners" },
    { id: "sitters", label: "Pet Sitters" },
    { id: "schools", label: "Pet Schools" },
    { id: "vendors", label: "Vendors" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-['Nunito',sans-serif] font-bold text-[24px] leading-8 text-[#282828]">
          Platform Analytics
        </h1>
        <p className="font-['Arial',sans-serif] text-[14px] leading-5 text-[#62748e] mt-1">
          Monitor the ecosystem across all user roles and entities.
        </p>
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-[14px] w-full flex flex-col overflow-hidden">
        <div className="flex border-b border-[#e5e7eb] px-6 pt-2 bg-[#f8fafc]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-['Nunito',sans-serif] font-medium text-[15px] transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#00c950]"
                  : "text-[#62748e] hover:text-[#282828]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#00c950]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "hotels" &&
            renderTable(
              toArray(hotelsData?.data),
              [
                { key: "name", label: "HOTEL NAME" },
                { key: "user.email", label: "EMAIL" },
                { key: "status", label: "STATUS" },
                { key: "createdAt", label: "JOINED" },
              ],
              isLoadingHotels,
            )}
          {activeTab === "owners" &&
            renderTable(
              toArray(ownersData?.data),
              [
                { key: "user.fullName", label: "OWNER NAME" },
                { key: "user.email", label: "EMAIL" },
                { key: "createdAt", label: "JOINED" },
              ],
              isLoadingOwners,
            )}
          {activeTab === "sitters" &&
            renderTable(
              toArray(sittersData?.data),
              [
                { key: "user.fullName", label: "SITTER NAME" },
                { key: "user.email", label: "EMAIL" },
                { key: "experienceYears", label: "EXPERIENCE" },
                { key: "createdAt", label: "JOINED" },
              ],
              isLoadingSitters,
            )}
          {activeTab === "schools" &&
            renderTable(
              toArray(schoolsData?.data),
              [
                { key: "name", label: "SCHOOL NAME" },
                { key: "user.email", label: "EMAIL" },
                { key: "status", label: "STATUS" },
                { key: "createdAt", label: "JOINED" },
              ],
              isLoadingSchools,
            )}
          {activeTab === "vendors" &&
            renderTable(
              toArray(vendorsData?.data),
              [
                { key: "shopName", label: "SHOP NAME" },
                { key: "user.email", label: "EMAIL" },
                { key: "status", label: "STATUS" },
              ],
              isLoadingVendors,
            )}
        </div>
      </div>
    </div>
  );
}
