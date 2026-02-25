"use client";

import {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
  useGetPlatformSettingsHistoryQuery,
} from "@/redux/features/api/dashboard/admin/platformSettings/platformSettingsApi";
import {
  Settings,
  History,
  TrendingUp,
  Percent,
  DollarSign,
  Save,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";

export default function AdminSettingsClient() {
  const { showToast } = useToast();
  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    refetch,
  } = useGetPlatformSettingsQuery();
  const { data: historyData, isLoading: isHistoryLoading } =
    useGetPlatformSettingsHistoryQuery({ limit: 10 });
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdatePlatformSettingsMutation();

  const [platformFee, setPlatformFee] = useState("");
  const [commissionRate, setCommissionRate] = useState("");

  useEffect(() => {
    if (settingsData?.data) {
      setPlatformFee(settingsData.data.platformFee);
      setCommissionRate(settingsData.data.commissionRate);
    }
  }, [settingsData]);

  const handleUpdate = async () => {
    try {
      await updateSettings({
        platformFee: Number(platformFee),
        commissionRate: Number(commissionRate),
      }).unwrap();
      showToast("Platform settings updated successfully", "success");
      refetch();
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to update settings", "error");
    }
  };

  const historyItems = historyData?.data?.items || [];

  return (
    <div className="space-y-10 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
            Platform Settings
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Configure global fees, commission rates, and operational parameters.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-sm font-bold text-gray-600 font-arimo shadow-sm"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isSettingsLoading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Settings Form Section */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-nunito">
                Revenue Configuration
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 font-arimo flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  Global Platform Fee ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full pl-6 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-nunito text-lg font-bold outline-none"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(e.target.value)}
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-blue-400 bg-blue-50 px-3 py-1 rounded-lg">
                    FIXED
                  </div>
                </div>
                <p className="text-xs text-gray-400 font-arimo">
                  Standard fee applied to all cross-platform bookings.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 font-arimo flex items-center gap-2">
                  <Percent className="w-4 h-4 text-green-500" />
                  Commission Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full pl-6 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-nunito text-lg font-bold outline-none"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    placeholder="0"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-green-400 bg-green-50 px-3 py-1 rounded-lg">
                    RATIO
                  </div>
                </div>
                <p className="text-xs text-gray-400 font-arimo">
                  Percentage taken from service provider earnings.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-50">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-gray-200"
              >
                {isUpdating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Apply Changes
              </button>
            </div>

            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] pointer-events-none"></div>
          </div>

          {/* Quick Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-nunito mb-1">
                Fee Optimization Engine
              </h3>
              <p className="text-indigo-100 text-sm font-arimo leading-relaxed opacity-80">
                Adjusting your platform fee even by $1 can impact monthly
                revenue by up to <strong>12.5%</strong> based on current booking
                volume.
              </p>
            </div>
            <div className="absolute right-[-20%] bottom-[-20%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Audit Log / History Section */}
        <div className="space-y-6">
          <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <History className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-nunito">
                  Audit Log
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              {isHistoryLoading ? (
                <div className="py-10 flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-200 mb-3" />
                  <p className="text-xs text-gray-400">Loading history...</p>
                </div>
              ) : historyItems.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-10">
                  No recent changes recorded.
                </p>
              ) : (
                historyItems.map((item, i) => (
                  <div key={item.id} className="relative pl-8">
                    {/* Timeline Line */}
                    {i !== historyItems.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-gray-50"></div>
                    )}

                    <div className="absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-4 border-white shadow-sm bg-orange-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <p className="text-[13px] font-bold text-gray-800 font-arimo">
                          {item.updatedBy.fullName}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <DollarSign className="w-3 h-3" />
                          <span className="line-through text-gray-300">
                            ${item.platformFeeOld}
                          </span>
                          <ChevronRight className="w-2 h-2" />
                          <span className="font-bold text-blue-600">
                            ${item.platformFeeNew}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <Percent className="w-3 h-3" />
                          <span className="line-through text-gray-300">
                            {item.commissionRateOld}%
                          </span>
                          <ChevronRight className="w-2 h-2" />
                          <span className="font-bold text-green-600">
                            {item.commissionRateNew}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-8 py-3 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">
              View All Logs
            </button>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-900 font-nunito">
            Standard Operating Procedure
          </h4>
          <p className="text-xs text-amber-700 font-arimo mt-1 leading-relaxed">
            Changes to platform fees or commission rates will be applied to{" "}
            <strong>new bookings only</strong>. Active and pending reservations
            will maintain their original transaction terms to ensure financial
            integrity.
          </p>
        </div>
      </div>
    </div>
  );
}
