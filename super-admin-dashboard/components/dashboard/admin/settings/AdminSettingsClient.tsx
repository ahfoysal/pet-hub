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
  DollarSign,
  Save,
  Loader2,
  RefreshCcw,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  BellRing,
  Smartphone,
  Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import Switch from "@/components/ui/Switch";

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

  const [platformFee, setPlatformFee] = useState(10);
  const [commissionRate, setCommissionRate] = useState(5);
  const [freeCancellationWindow, setFreeCancellationWindow] = useState(24);
  const [refundPercentage, setRefundPercentage] = useState(100);

  const [isKycAutomatic, setIsKycAutomatic] = useState(true);
  const [isEmailNotificationEnabled, setIsEmailNotificationEnabled] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true);

  const [providerCategoryLevels, setProviderCategoryLevels] = useState([
    { name: "Bronze", bookingThreshold: 0, benefits: "Standard benefits" },
    { name: "Silver", bookingThreshold: 50, benefits: "Increased visibility" },
    { name: "Gold", bookingThreshold: 150, benefits: "Premium support" },
    { name: "Platinum", bookingThreshold: 300, benefits: "Low commission" },
  ]);

  useEffect(() => {
    if (settingsData?.data) {
      setPlatformFee(Number(settingsData.data.platformFee));
      setCommissionRate(Number(settingsData.data.commissionRate));
      setFreeCancellationWindow(settingsData.data.freeCancellationWindow);
      setRefundPercentage(Number(settingsData.data.refundPercentage));
      setIsKycAutomatic(settingsData.data.isKycAutomatic);
      setIsEmailNotificationEnabled(settingsData.data.isEmailNotificationEnabled);
      setIsTwoFactorEnabled(settingsData.data.isTwoFactorEnabled);
      if (settingsData.data.providerCategoryLevels) {
        setProviderCategoryLevels(settingsData.data.providerCategoryLevels.map(lvl => ({
          name: lvl.name,
          bookingThreshold: lvl.bookingThreshold,
          benefits: lvl.benefits || ""
        })));
      }
    }
  }, [settingsData]);

  const handleUpdate = async () => {
    try {
      await updateSettings({
        platformFee,
        commissionRate,
        freeCancellationWindow,
        refundPercentage,
        isKycAutomatic,
        isEmailNotificationEnabled,
        isTwoFactorEnabled,
        providerCategoryLevels,
      }).unwrap();
      showToast("Platform policies updated successfully", "success");
      refetch();
    } catch (error) {
      const err = error as any;
      showToast(err?.data?.message || "Failed to update policies", "error");
    }
  }

  const historyItems = historyData?.data?.items || [];

  // Example Calculation Logic
  const serviceAmount = 100.0;
  const calculatedFee = (serviceAmount * platformFee) / 100;
  const providerReceives = serviceAmount - calculatedFee;

  return (
    <div className="space-y-10 pb-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight">
            Policies & Settings
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Control platform revenue models, safety policies, and tiered incentive programs.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-sm font-bold text-gray-600 font-arimo shadow-sm"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isSettingsLoading ? "animate-spin" : ""}`}
          />
          Sync System
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Settings Section */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Platform Service Charge */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-nunito">
                Platform Service Charge
              </h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 font-arimo">
                    Set Global Platform Fee
                  </label>
                  <span className="text-xl font-black text-primary font-nunito bg-primary/5 px-4 py-1 rounded-full">
                    {platformFee}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <span>Minimum (0%)</span>
                  <span>Intermediate (25%)</span>
                  <span>Maximum (50%)</span>
                </div>
              </div>

              {/* Example Calculation Box */}
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3 text-primary" />
                    Example Calculation
                  </h4>
                  <p className="text-[11px] text-gray-500 font-arimo">
                    Based on a standard service charge of $100.00
                  </p>
                </div>
                
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Fee Amount</p>
                    <p className="text-lg font-black text-gray-900 font-nunito">${calculatedFee.toFixed(2)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Provider Receives</p>
                    <p className="text-lg font-black text-green-600 font-nunito">${providerReceives.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-nunito">
                Cancellation Policy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 font-arimo">
                  Free Cancellation Window
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={freeCancellationWindow}
                    onChange={(e) => setFreeCancellationWindow(parseInt(e.target.value))}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-nunito text-lg font-bold outline-none"
                    placeholder="24"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">
                    Hours
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-arimo max-w-[240px]">
                  Pet Owners can cancel for free within this timeframe before the service starts.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 font-arimo">
                    Post-Window Refund %
                  </label>
                  <span className="text-xl font-black text-orange-600 font-nunito bg-orange-50 px-4 py-1 rounded-full">
                    {refundPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={refundPercentage}
                  onChange={(e) => setRefundPercentage(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <span>No Refund</span>
                  <span>Half Refund</span>
                  <span>Full Refund</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-amber-900 font-nunito uppercase tracking-tight">
                  Late Cancellation Policy
                </h4>
                <p className="text-[11px] text-amber-700 font-arimo mt-1 leading-relaxed">
                  Cancellations requested after the <strong>{freeCancellationWindow}h window</strong> will apply a <strong>{100 - refundPercentage}% penalty</strong> fee that goes to the platform to compensate for lost slots.
                </p>
              </div>
            </div>
          </section>

          {/* Provider Category Levels */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-nunito">
                  Provider Category Levels
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {providerCategoryLevels.map((level, idx) => (
                <div 
                  key={level.name}
                  className={`bg-white p-6 rounded-[2rem] border-2 transition-all hover:shadow-lg ${
                    idx === 0 ? "border-amber-100" :
                    idx === 1 ? "border-slate-200" :
                    idx === 2 ? "border-yellow-200" :
                    "border-indigo-100"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${
                    idx === 0 ? "bg-amber-100 text-amber-700" :
                    idx === 1 ? "bg-slate-100 text-slate-700" :
                    idx === 2 ? "bg-yellow-100 text-yellow-700" :
                    "bg-indigo-100 text-indigo-700"
                  }`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black font-nunito text-gray-900">{level.name}</h3>
                  <div className="mt-2 space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Threshold</p>
                      <p className="text-sm font-bold text-gray-700 font-arimo">{level.bookingThreshold}+ Bookings</p>
                    </div>
                    <div className="pt-2 border-t border-gray-50">
                      <p className="text-[11px] text-gray-500 font-arimo leading-relaxed italic">
                        &quot;{level.benefits}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* Action Center */}
          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-gray-200">
            <h3 className="text-xl font-bold font-nunito mb-2">Policy Master</h3>
            <p className="text-white/60 text-xs font-arimo mb-8 leading-relaxed">
              Applying changes will update platform logic globally. Please verify with legal.
            </p>
            
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[2px] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Policies
                </>
              )}
            </button>
          </div>

          {/* Additional Platform Settings */}
          <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 font-nunito mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              Safety Toggles
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-bold text-gray-800 font-arimo">Auto KYC</p>
                    <p className="text-[10px] text-gray-400">Scan identities instantly</p>
                  </div>
                </div>
                <Switch checked={isKycAutomatic} onChange={setIsKycAutomatic} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <BellRing className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-bold text-gray-800 font-arimo">Notifications</p>
                    <p className="text-[10px] text-gray-400">Global email service</p>
                  </div>
                </div>
                <Switch checked={isEmailNotificationEnabled} onChange={setIsEmailNotificationEnabled} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[13px] font-bold text-gray-800 font-arimo">2FA Auth</p>
                    <p className="text-[10px] text-gray-400">Force SMS/Email code</p>
                  </div>
                </div>
                <Switch checked={isTwoFactorEnabled} onChange={setIsTwoFactorEnabled} />
              </div>
            </div>
          </div>

          {/* Activity Log (Mini) */}
          <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-gray-400" />
                <h2 className="text-lg font-bold text-gray-900 font-nunito">Audit</h2>
              </div>
              <button className="text-[10px] font-black text-primary uppercase">View Logs</button>
            </div>

            <div className="space-y-5">
              {isHistoryLoading ? (
                <div className="py-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-200" /></div>
              ) : historyItems.slice(0, 3).map((item) => (
                <div key={item.id} className="relative pl-5 border-l border-gray-100 pb-1">
                  <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-gray-200" />
                  <p className="text-[11px] font-bold text-gray-800 font-arimo truncate">{item.updatedBy.fullName}</p>
                  <p className="text-[10px] text-gray-400">{new Date(item.updatedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex items-center justify-between gap-6 overflow-hidden relative">
        <div className="flex items-start gap-4 z-10">
          <ShieldCheck className="w-10 h-10 text-primary shrink-0 opacity-20" />
          <div>
            <h4 className="text-sm font-bold text-gray-900 font-nunito uppercase tracking-widest">
              Financial Integrity Protocol
            </h4>
            <p className="text-xs text-gray-500 font-arimo mt-1 leading-relaxed max-w-2xl">
              Platform fee adjustments follow the <strong>Immutable Ledger Rule</strong>: changes only affect future transactions. Active contracts remain protected under their original agreement terms to prevent billing discrepancies.
            </p>
          </div>
        </div>
        <div className="hidden lg:block z-10">
          <div className="px-4 py-2 bg-primary text-white text-[10px] font-black rounded-lg uppercase tracking-widest opacity-80">
            Compliant
          </div>
        </div>
        <div className="absolute right-[-5%] top-[-50%] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
