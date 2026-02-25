"use client";

import { useState, useEffect } from "react";
import {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
  useGetPlatformSettingsHistoryQuery,
} from "@/redux/features/api/dashboard/admin/platformSettings/platformSettingsApi";
import type { PlatformSettingsHistoryItem } from "@/types/dashboard/admin/platformSettings/platformSettingsType";
import { useToast } from "@/contexts/ToastContext";
import { useSession } from "next-auth/react";
import {
  Settings,
  Save,
  X,
  Pencil,
  Search,
  History,
  DollarSign,
  Percent,
  ChevronDown,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react";

export default function AdminPlatformSettingsPage() {
  const { status } = useSession();
  const { showToast } = useToast();

  // ── Current settings ──────────────────────────────────────────
  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
    refetch: refetchSettings,
  } = useGetPlatformSettingsQuery(undefined, {
    skip: status === "loading",
  });

  // ── Edit mode ─────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [platformFee, setPlatformFee] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdatePlatformSettingsMutation();

  useEffect(() => {
    if (settingsData?.data) {
      setPlatformFee(settingsData.data.platformFee ?? "");
      setCommissionRate(settingsData.data.commissionRate ?? "");
    }
  }, [settingsData]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel — reset values
      setPlatformFee(settingsData?.data?.platformFee ?? "");
      setCommissionRate(settingsData?.data?.commissionRate ?? "");
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const feeNum = parseFloat(platformFee);
    const rateNum = parseFloat(commissionRate);

    if (isNaN(feeNum) || feeNum < 0 || feeNum > 100) {
      showToast("Platform fee must be a number between 0 and 100", "error");
      return;
    }
    if (isNaN(rateNum) || rateNum < 0 || rateNum > 100) {
      showToast("Commission rate must be a number between 0 and 100", "error");
      return;
    }

    try {
      const result = await updateSettings({
        platformFee: feeNum,
        commissionRate: rateNum,
      }).unwrap();
      showToast(result.message || "Settings updated successfully!", "success");
      setIsEditing(false);
    } catch (error: any) {
      showToast(
        error?.data?.message || "Failed to update settings",
        "error"
      );
    }
  };

  // ── History ───────────────────────────────────────────────────
  const [historySearch, setHistorySearch] = useState("");
  const [historyLimit] = useState(10);
  const [allHistoryItems, setAllHistoryItems] = useState<
    PlatformSettingsHistoryItem[]
  >([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    undefined
  );
  const [hasMore, setHasMore] = useState(true);

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
  } = useGetPlatformSettingsHistoryQuery(
    { limit: historyLimit, search: historySearch || undefined, cursor: currentCursor },
    { skip: status === "loading" }
  );

  // Reset history when search changes
  useEffect(() => {
    setAllHistoryItems([]);
    setCurrentCursor(undefined);
    setHasMore(true);
  }, [historySearch]);

  // Accumulate items
  useEffect(() => {
    if (historyData?.data) {
      if (!currentCursor) {
        // First page or search reset
        setAllHistoryItems(historyData.data.items);
      } else {
        // Append new items
        setAllHistoryItems((prev) => {
          const ids = new Set(prev.map((i) => i.id));
          const newItems = historyData.data.items.filter(
            (i) => !ids.has(i.id)
          );
          return [...prev, ...newItems];
        });
      }
      setHasMore(historyData.data.nextCursor !== null);
    }
  }, [historyData, currentCursor]);

  const handleLoadMore = () => {
    if (historyData?.data?.nextCursor) {
      setCurrentCursor(historyData.data.nextCursor);
    }
  };

  // ── Format helpers ────────────────────────────────────────────
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatChangeValue = (
    oldVal: string | null,
    newVal: string | null
  ) => {
    if (oldVal === null && newVal === null) return "—";
    return (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <span className="text-gray-400">{oldVal ?? "—"}%</span>
        <ArrowRight className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
        <span className="font-semibold text-gray-800">{newVal ?? "—"}%</span>
      </span>
    );
  };

  // ── Loading state ─────────────────────────────────────────────
  if (isSettingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (isSettingsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load settings
          </h2>
          <p className="text-gray-500 mb-5">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => refetchSettings()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const settings = settingsData?.data;

  return (
    <div className="space-y-5 sm:space-y-6 pb-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold">
          Platform Settings
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Manage platform-wide fee and commission configurations
        </p>
      </div>

      {/* ── Current Settings Card ──────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Current Configuration
              </h2>
              {settings?.updatedAt && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Last updated {formatDate(settings.updatedAt)} · v{settings.version}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleEditToggle}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              isEditing
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" /> Edit Settings
              </>
            )}
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          {isEditing ? (
            /* ── Edit Form ──────────────────────────────── */
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Platform Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Fee (%)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border-0"
                      placeholder="e.g. 25"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    The percentage fee charged on platform transactions
                  </p>
                </div>

                {/* Commission Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border-0"
                      placeholder="e.g. 10.5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    The commission percentage applied to service providers
                  </p>
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ── Read-only display ──────────────────────── */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Platform Fee Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Platform Fee
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {settings?.platformFee ?? "—"}
                      <span className="text-lg text-gray-400 ml-1">%</span>
                    </p>
                  </div>
                  <div className="p-3.5 bg-blue-100/60 rounded-xl transition-transform duration-300 group-hover:scale-110">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Fee charged on each platform transaction
                </p>
              </div>

              {/* Commission Rate Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Commission Rate
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {settings?.commissionRate ?? "—"}
                      <span className="text-lg text-gray-400 ml-1">%</span>
                    </p>
                  </div>
                  <div className="p-3.5 bg-emerald-100/60 rounded-xl transition-transform duration-300 group-hover:scale-110">
                    <Percent className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Commission applied to service provider earnings
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Change History ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-5 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 rounded-xl">
                <History className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Change History
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Track all configuration changes
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by admin name or email…"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all border-0"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Platform Fee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Commission Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Changed By
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {allHistoryItems.length > 0 ? (
                allHistoryItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                    style={{
                      borderTop:
                        index !== 0 ? "1px solid #f9fafb" : "none",
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                        v{item.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatChangeValue(
                        item.platformFeeOld,
                        item.platformFeeNew
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatChangeValue(
                        item.commissionRateOld,
                        item.commissionRateNew
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.updatedBy.fullName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.updatedBy.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.updatedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    {isHistoryLoading || isHistoryFetching ? (
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm">Loading history…</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-base font-medium text-gray-600">
                          No history records found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {historySearch
                            ? "Try adjusting your search"
                            : "Changes will appear here once settings are updated"}
                        </p>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {allHistoryItems.length > 0 ? (
            allHistoryItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  index !== 0 ? "border-t border-gray-100" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                    v{item.version}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(item.updatedAt)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50/60 rounded-xl p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Platform Fee
                    </p>
                    {formatChangeValue(
                      item.platformFeeOld,
                      item.platformFeeNew
                    )}
                  </div>
                  <div className="bg-emerald-50/60 rounded-xl p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Commission Rate
                    </p>
                    {formatChangeValue(
                      item.commissionRateOld,
                      item.commissionRateNew
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {item.updatedBy.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.updatedBy.email}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              {isHistoryLoading || isHistoryFetching ? (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Loading history…</span>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-base font-medium text-gray-600">
                    No history records found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {historySearch
                      ? "Try adjusting your search"
                      : "Changes will appear here once settings are updated"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && allHistoryItems.length > 0 && (
          <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isHistoryFetching}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isHistoryFetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" /> Load More
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
