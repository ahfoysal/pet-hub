"use client";

import {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} from "@/redux/features/api/dashboard/admin/platformSettings/platformSettingsApi";
import { AlertCircle, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import Switch from "@/components/ui/Switch";

const PercentIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5L5 19M5.5 6.5C5.5 7.05228 5.05228 7.5 4.5 7.5C3.94772 7.5 3.5 7.05228 3.5 6.5C3.5 5.94772 3.94772 5.5 4.5 5.5C5.05228 5.5 5.5 5.94772 5.5 6.5ZM19.5 17.5C19.5 18.0523 19.0523 18.5 18.5 18.5C17.9477 18.5 17.5 18.0523 17.5 17.5C17.5 16.9477 17.9477 16.5 18.5 16.5C19.0523 16.5 19.5 16.9477 19.5 17.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.6667 2.5C13.1063 2.50626 13.5256 2.68598 13.8333 3L17 6.16667C17.314 6.47438 17.4937 6.89372 17.5 7.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H12.6667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.1654 17.5007V11.6673C14.1654 11.4463 14.0776 11.2343 13.9213 11.0781C13.765 10.9218 13.553 10.834 13.332 10.834H6.66536C6.44435 10.834 6.23239 10.9218 6.07611 11.0781C5.91983 11.2343 5.83203 11.4463 5.83203 11.6673V17.5007" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.83203 2.5V5.83333C5.83203 6.05435 5.91983 6.26631 6.07611 6.42259C6.23239 6.57887 6.44435 6.66667 6.66536 6.66667H12.4987" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AdminSettingsClient() {
  const { showToast } = useToast();
  const { data: settingsData, refetch } = useGetPlatformSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdatePlatformSettingsMutation();

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
        setProviderCategoryLevels(settingsData.data.providerCategoryLevels.map((lvl: any) => ({
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
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to update policies", "error");
    }
  };

  return (
    <div className="w-full max-w-[1090px]">
      <div className="mb-[24px]">
        <h1 className="text-[30px] font-['Nunito',sans-serif] font-semibold leading-[36px] text-[#0f172b]">
          Policies & Settings
        </h1>
        <p className="text-[16px] font-['Arimo',sans-serif] font-normal leading-[24px] text-[#45556c] mt-[8px]">
          Configure platform-wide policies and settings
        </p>
      </div>

      {/* Platform Service Charge */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-[24px] mb-[24px]">
        <div className="flex gap-[16px] items-start mb-[24px]">
          <div className="bg-[#dcfce7] rounded-[10px] w-[48px] h-[48px] flex items-center justify-center shrink-0">
            <PercentIcon className="w-[24px] h-[24px] text-[#00a63e]" />
          </div>
          <div>
            <h2 className="text-[20px] font-['Inter',sans-serif] font-semibold text-[#0f172b] leading-[28px]">
              Platform Service Charge
            </h2>
            <p className="text-[14px] font-['Inter',sans-serif] text-[#45556c] leading-[20px] mt-[4px]">
              Set the percentage fee charged on all transactions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[24px] items-start">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-['Inter',sans-serif] font-medium text-[#314158] leading-[20px]">
              Platform Fee Percentage
            </label>
            <div className="flex items-center gap-[16px]">
               <div className="flex-1 relative">
                 <input 
                    type="range" min="0" max="50" step="1" 
                    value={platformFee} 
                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                    className="w-full h-[10px] bg-[#f6f6f6] rounded-[9px] appearance-none focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:rounded-[15px] [&::-webkit-slider-thumb]:bg-[#ff7176] [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ff7176 ${(platformFee / 50) * 100}%, #f6f6f6 ${(platformFee / 50) * 100}%)`
                    }}
                 />
               </div>
               <div className="w-[80px]">
                 <p className="text-[24px] font-['Inter',sans-serif] font-bold text-[#00a63e] leading-[32px] text-center">
                   {platformFee}%
                 </p>
               </div>
            </div>
            <p className="text-[12px] font-['Inter',sans-serif] text-[#62748e] leading-[16px]">
              Current setting: Platform retains {platformFee}% of each transaction
            </p>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-[17px] pt-[17px] pb-[16px] flex flex-col gap-[12px]">
            <h3 className="text-[16px] font-['Inter',sans-serif] font-semibold text-[#0f172b] leading-[24px]">
              Example Calculation
            </h3>
            <div className="flex flex-col gap-[8px]">
              <div className="flex justify-between items-start h-[20px]">
                <span className="text-[14px] font-['Inter',sans-serif] font-normal text-[#45556c] leading-[20px]">Service Amount:</span>
                <span className="text-[14px] font-['Inter',sans-serif] font-semibold text-[#0f172b] leading-[20px]">$100.00</span>
              </div>
              <div className="flex justify-between items-start h-[20px]">
                <span className="text-[14px] font-['Inter',sans-serif] font-normal text-[#45556c] leading-[20px]">Platform Fee ({platformFee}%):</span>
                <span className="text-[14px] font-['Inter',sans-serif] font-semibold text-[#e7000b] leading-[20px]">-${(100 * platformFee / 100).toFixed(2)}</span>
              </div>
              <div className="pt-[9px] border-t border-[#cad5e2] flex justify-between items-start h-[29px]">
                <span className="text-[14px] font-['Inter',sans-serif] font-medium text-[#0f172b] leading-[20px]">Provider Receives:</span>
                <span className="text-[14px] font-['Inter',sans-serif] font-bold text-[#00a63e] leading-[20px]">${(100 - (100 * platformFee / 100)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-fit mt-[24px] inline-flex items-center gap-[4px] bg-[#00a63e] hover:bg-[#009035] text-white px-[15px] py-[10px] rounded-[10px] transition-colors"
        >
          <SaveIcon className="w-[20px] h-[20px] text-white" />
          <span className="text-[16px] font-['Inter',sans-serif] font-medium leading-[24px] text-center">Save Platform Fee Settings</span>
        </button>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-[24px] mb-[24px] relative">
        <div className="flex gap-[16px] items-start mb-[24px]">
          <div className="bg-[#ff7176]/10 rounded-[10px] w-[48px] h-[48px] flex items-center justify-center shrink-0">
            <AlertCircle className="w-[24px] h-[24px] text-[#ff7176]" />
          </div>
          <div>
            <h2 className="text-[20px] font-['Inter',sans-serif] font-semibold text-[#0f172b] leading-[28px]">
              Cancellation Policy
            </h2>
            <p className="text-[14px] font-['Inter',sans-serif] text-[#45556c] leading-[20px] mt-[4px]">
              Define cancellation windows and refund policies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[24px] items-start mb-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-['Inter',sans-serif] font-medium text-[#314158] leading-[20px]">
              Free Cancellation Window (Hours)
            </label>
            <div className="h-[42px] border border-[#cad5e2] rounded-[10px] flex items-center px-[16px] py-[8px]">
              <input 
                type="number" 
                value={freeCancellationWindow}
                onChange={(e) => setFreeCancellationWindow(Number(e.target.value))}
                className="w-full bg-transparent font-['Inter',sans-serif] text-[16px] text-[#0a0a0a] outline-none" 
              />
            </div>
            <p className="text-[12px] font-['Inter',sans-serif] font-normal text-[#62748e] leading-[16px]">
              Users can cancel bookings for free within {freeCancellationWindow} hours of booking
            </p>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-['Inter',sans-serif] font-medium text-[#314158] leading-[20px]">
              Refund Percentage (Within Window)
            </label>
            <div className="flex items-center gap-[16px] h-[32px]">
               <div className="flex-1 relative">
                 <input 
                    type="range" min="0" max="100" step="1" 
                    value={refundPercentage} 
                    onChange={(e) => setRefundPercentage(Number(e.target.value))}
                    className="w-full h-[10px] bg-[#f6f6f6] rounded-[9px] appearance-none focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:rounded-[15px] [&::-webkit-slider-thumb]:bg-[#ff7176] [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ff7176 ${refundPercentage}%, #f6f6f6 ${refundPercentage}%)`
                    }}
                 />
               </div>
               <div className="w-[80px]">
                 <p className="text-[24px] font-['Inter',sans-serif] font-bold text-[#155dfc] leading-[32px] text-center">
                   {refundPercentage}%
                 </p>
               </div>
            </div>
            <p className="text-[12px] font-['Inter',sans-serif] font-normal text-[#62748e] leading-[16px]">
              Customers receive {refundPercentage}% refund for cancellations within the window
            </p>
          </div>
        </div>

        <div className="bg-[#fffbeb] border border-[#fee685] rounded-[10px] px-[17px] pt-[17px] pb-[16px] flex gap-[12px] items-start mb-[24px]">
          <AlertCircle className="w-[20px] h-[20px] text-[#bb4d00]" />
          <div className="flex flex-col gap-[4px]">
            <h3 className="text-[14px] font-['Inter',sans-serif] font-medium text-[#7b3306] leading-[20px]">Late Cancellation Policy</h3>
            <p className="text-[12px] font-['Inter',sans-serif] text-[#bb4d00] leading-[16px]">
              Cancellations made after the {freeCancellationWindow}-hour window will incur a {100-refundPercentage}% cancellation fee. Providers will receive {100-refundPercentage}% of the booking amount as compensation.
            </p>
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-fit inline-flex items-center justify-center gap-[4px] bg-[#ff7176] hover:bg-[#ff5a60] text-white px-[15px] py-[10px] rounded-[10px] transition-colors"
        >
          <SaveIcon className="w-[20px] h-[20px] text-white" />
          <span className="text-[16px] font-['Inter',sans-serif] font-medium leading-[24px] text-center">Save Cancellation Policy</span>
        </button>
      </div>

      {/* Provider Category Levels */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-[24px] mb-[24px]">
        <div className="flex gap-[16px] items-start mb-[24px]">
          <div className="bg-[#f3e8ff] rounded-[10px] w-[48px] h-[48px] flex items-center justify-center shrink-0">
            <Shield className="w-[24px] h-[24px] text-[#9810fa]" />
          </div>
          <div>
            <h2 className="text-[20px] font-['Inter',sans-serif] font-semibold text-[#0f172b] leading-[28px]">
              Provider Category Levels
            </h2>
            <p className="text-[14px] font-['Inter',sans-serif] text-[#45556c] leading-[20px] mt-[4px]">
              Manage provider tier system and benefits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-[16px]">
          {/* Bronze */}
          <div className="border-[2px] border-[#bb4d00] rounded-[14px] p-[20px] flex flex-col items-start gap-[12px]" style={{ background: "linear-gradient(149.91deg, #fffbeb 0%, #fef3c6 100%)" }}>
            <div className="flex items-center gap-[8px]">
              <Shield className="w-[20px] h-[20px] text-[#7b3306]" />
              <h3 className="text-[18px] font-['Inter',sans-serif] font-bold text-[#7b3306] leading-[28px]">Bronze</h3>
            </div>
            <div>
              <p className="text-[14px] font-['Inter',sans-serif] font-semibold text-[#314158] leading-[20px] mb-[8px]">0+ bookings</p>
              <p className="text-[10px] font-['Inter',sans-serif] text-[#45556c] leading-[16px]">Basic support, Standard visibility</p>
            </div>
          </div>

          {/* Silver */}
          <div className="border-[2px] border-[#90a1b9] rounded-[14px] p-[20px] flex flex-col items-start gap-[12px]" style={{ background: "linear-gradient(149.91deg, #f8fafc 0%, #f1f5f9 100%)" }}>
            <div className="flex items-center gap-[8px]">
              <Shield className="w-[20px] h-[20px] text-[#0f172b]" />
              <h3 className="text-[18px] font-['Inter',sans-serif] font-bold text-[#0f172b] leading-[28px]">Silver</h3>
            </div>
            <div>
              <p className="text-[14px] font-['Inter',sans-serif] font-semibold text-[#314158] leading-[20px] mb-[8px]">50+ bookings</p>
              <p className="text-[10px] font-['Inter',sans-serif] text-[#45556c] leading-[16px]">Priority support, Enhanced visibility, 12% fee</p>
            </div>
          </div>

          {/* Gold */}
          <div className="border-[2px] border-[#f0b100] rounded-[14px] p-[20px] flex flex-col items-start gap-[12px]" style={{ background: "linear-gradient(149.91deg, #fefce8 0%, #fef9c2 100%)" }}>
            <div className="flex items-center gap-[8px]">
              <Shield className="w-[20px] h-[20px] text-[#733e0a]" />
              <h3 className="text-[18px] font-['Inter',sans-serif] font-bold text-[#733e0a] leading-[28px]">Gold</h3>
            </div>
            <div>
              <p className="text-[14px] font-['Inter',sans-serif] font-semibold text-[#314158] leading-[20px] mb-[8px]">150+ bookings</p>
              <p className="text-[10px] font-['Inter',sans-serif] text-[#45556c] leading-[16px]">Premium support, Top visibility, 10% fee, Featured badge</p>
            </div>
          </div>

          {/* Platinum */}
          <div className="border-[2px] border-[#ad46ff] rounded-[14px] p-[20px] flex flex-col items-start gap-[12px]" style={{ background: "linear-gradient(149.91deg, #faf5ff 0%, #f3e8ff 100%)" }}>
            <div className="flex items-center gap-[8px]">
              <Shield className="w-[20px] h-[20px] text-[#59168b]" />
              <h3 className="text-[18px] font-['Inter',sans-serif] font-bold text-[#59168b] leading-[28px]">Platinum</h3>
            </div>
            <div>
              <p className="text-[14px] font-['Inter',sans-serif] font-semibold text-[#314158] leading-[20px] mb-[8px]">300+ bookings</p>
              <p className="text-[10px] font-['Inter',sans-serif] text-[#45556c] leading-[16px]">Dedicated account manager, Maximum visibility, 8% fee, Premium badge</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-fit mt-[24px] inline-flex items-center justify-center gap-[4px] bg-[#9810fa] hover:bg-[#850ddb] text-white px-[17px] py-[12px] rounded-[10px] transition-colors"
        >
          <SaveIcon className="w-[20px] h-[20px] text-white" />
          <span className="text-[16px] font-['Inter',sans-serif] font-medium leading-[24px] text-center">Update Provider Levels</span>
        </button>
      </div>

      {/* Additional Platform Settings */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-[25px] flex flex-col gap-[24px]">
        <h2 className="text-[20px] font-['Inter',sans-serif] font-semibold text-[#0f172b] leading-[28px]">
          Additional Platform Settings
        </h2>

        <div className="flex flex-col gap-[16px]">
          {/* Setting 1 */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] h-[78px] flex items-center justify-between px-[16px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-[16px] font-['Inter',sans-serif] font-medium text-[#0f172b] leading-[24px]">Automatic KYC Verification</h3>
              <p className="text-[14px] font-['Inter',sans-serif] text-[#45556c] leading-[20px]">Enable AI-powered automatic document verification</p>
            </div>
            <Switch checked={isKycAutomatic} onChange={setIsKycAutomatic} />
          </div>

          {/* Setting 2 */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] h-[78px] flex items-center justify-between px-[16px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-[16px] font-['Inter',sans-serif] font-medium text-[#0f172b] leading-[24px]">Email Notifications</h3>
              <p className="text-[14px] font-['Inter',sans-serif] text-[#45556c] leading-[20px]">Send email alerts for important platform events</p>
            </div>
            <Switch checked={isEmailNotificationEnabled} onChange={setIsEmailNotificationEnabled} />
          </div>

          {/* Setting 3 */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] h-[78px] flex items-center justify-between px-[16px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-[16px] font-['Inter',sans-serif] font-medium text-[#0f172b] leading-[24px]">Two-Factor Authentication</h3>
              <p className="text-[14px] font-['Inter',sans-serif] text-[#45556c] leading-[20px]">Require 2FA for all admin accounts</p>
            </div>
            <Switch checked={isTwoFactorEnabled} onChange={setIsTwoFactorEnabled} />
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-fit mt-[8px] inline-flex items-center justify-center gap-[4px] bg-[#0f172b] hover:bg-[#1e293b] text-white px-[15px] py-[10px] rounded-[10px] transition-colors"
        >
          <SaveIcon className="w-[20px] h-[20px] text-white" />
          <span className="text-[16px] font-['Inter',sans-serif] font-medium leading-[24px] text-center">Save Additional Settings</span>
        </button>
      </div>
    </div>
  );
}
