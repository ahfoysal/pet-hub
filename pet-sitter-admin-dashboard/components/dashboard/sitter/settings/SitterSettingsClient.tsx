/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetSitterProfileQuery,
  useUpdateSitterProfileMutation,
  useGetSitterNotificationSettingsQuery,
  useUpdateSitterNotificationSettingsMutation,
  useGetSitterBankingInfoQuery,
  useUpdateSitterBankingInfoMutation,
  useGetSitterDocumentsQuery,
  useUploadSitterDocumentsMutation,
} from "@/redux/features/api/dashboard/sitter/settings/sitterSettingsApi";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { PageHeader } from "@/components/dashboard/shared/DashboardUI";

// Sub-components
import SettingsSidebar from "./SettingsSidebar";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import NotificationsTab from "./tabs/NotificationsTab";
import BankingTab from "./tabs/BankingTab";
import DocumentsTab from "./tabs/DocumentsTab";

export default function SitterSettingsClient() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // API Hooks
  const { data: profileData, isLoading: isProfileLoading, refetch: refetchProfile } = useGetSitterProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateSitterProfileMutation();

  const { data: notifyData, isLoading: isNotifyLoading, refetch: refetchNotify } = useGetSitterNotificationSettingsQuery();
  const [updateNotify, { isLoading: isUpdatingNotify }] = useUpdateSitterNotificationSettingsMutation();

  const { data: bankingData, isLoading: isBankingLoading, refetch: refetchBanking } = useGetSitterBankingInfoQuery();
  const [updateBanking, { isLoading: isUpdatingBanking }] = useUpdateSitterBankingInfoMutation();

  const { data: docsData, isLoading: isDocsLoading, refetch: refetchDocs } = useGetSitterDocumentsQuery();
  const [uploadDocs, { isLoading: isUploadingDocs }] = useUploadSitterDocumentsMutation();

  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: "",
    phone: "",
    yearsOfExperience: 0,
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    // Notification Fields from Design
    newBookings: true,
    checkInReminders: true,
    checkOutReminders: true,
    paymentUpdates: true,
    adminMessages: true,
    bookingCancellations: true,
  });

  // Data Sync
  useEffect(() => {
    if (profileData?.data) {
      setFormData((prev: any) => ({
        ...prev,
        fullName: profileData.data.fullName || "",
        email: profileData.data.email || "",
        phone: profileData.data.phone || "",
        yearsOfExperience: profileData.data.yearsOfExperience || 0,
      }));
    }
  }, [profileData]);

  useEffect(() => {
    if (notifyData?.data) {
      setFormData((prev: any) => ({
        ...prev,
        newBookings: notifyData.data.newBookings ?? true,
        checkInReminders: notifyData.data.checkInReminders ?? true,
        checkOutReminders: notifyData.data.checkOutReminders ?? true,
        paymentUpdates: notifyData.data.paymentUpdates ?? true,
        adminMessages: notifyData.data.adminMessages ?? true,
        bookingCancellations: notifyData.data.bookingCancellations ?? true,
      }));
    }
  }, [notifyData]);

  useEffect(() => {
    if (bankingData?.data) {
      setFormData((prev: any) => ({
        ...prev,
        bankName: bankingData.data.bankName || "",
        accountHolderName: bankingData.data.accountHolderName || "",
        accountNumber: bankingData.data.accountNumber || "",
        routingNumber: bankingData.data.routingNumber || "",
      }));
    }
  }, [bankingData]);

  // Handlers
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNotificationToggle = async (name: string, checked: boolean) => {
    // Optimistic update
    setFormData((prev: any) => ({ ...prev, [name]: checked }));
    
    try {
      // Create body with updated field
      const updatedNotifications = {
        ...formData,
        [name]: checked
      };

      // Extract only notification fields for the API
      const body = {
        newBookings: updatedNotifications.newBookings,
        checkInReminders: updatedNotifications.checkInReminders,
        checkOutReminders: updatedNotifications.checkOutReminders,
        paymentUpdates: updatedNotifications.paymentUpdates,
        adminMessages: updatedNotifications.adminMessages,
        bookingCancellations: updatedNotifications.bookingCancellations,
      };

      await updateNotify(body).unwrap();
      showToast(`${name.replace(/([A-Z])/g, ' $1').trim()} updated`, "success");
      refetchNotify();
    } catch (err: any) {
      // Revert on error
      setFormData((prev: any) => ({ ...prev, [name]: !checked }));
      showToast(err?.data?.message || "Failed to update setting", "error");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        yearsOfExperience: Number(formData.yearsOfExperience),
      }).unwrap();
      showToast("Profile updated successfully", "success");
      refetchProfile();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update profile", "error");
    }
  };

  const handleSaveBanking = async () => {
    try {
      await updateBanking({
        bankName: formData.bankName,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
      }).unwrap();
      showToast("Banking info updated", "success");
      refetchBanking();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update banking", "error");
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateNotify({
        newBookings: formData.newBookings,
        checkInReminders: formData.checkInReminders,
        checkOutReminders: formData.checkOutReminders,
        paymentUpdates: formData.paymentUpdates,
        adminMessages: formData.adminMessages,
        bookingCancellations: formData.bookingCancellations,
      }).unwrap();
      showToast("Notification settings saved", "success");
      refetchNotify();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to update notifications", "error");
    }
  };

  const handleFileUpload = async (e: any) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) fd.append("files", files[i]);
    try {
      await uploadDocs(fd).unwrap();
      showToast("Documents uploaded successfully", "success");
      refetchDocs();
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to upload documents", "error");
    }
  };

  if (isProfileLoading || isNotifyLoading || isBankingLoading || isDocsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-[#ff7176] mb-4" />
        <p className="text-gray-400 font-arimo italic">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-[25px] pb-10 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your account and sitter settings" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px] items-start">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="lg:col-span-9">
          {activeTab === "profile" && (
            <ProfileTab 
                formData={formData} 
                onChange={handleChange} 
                onSave={handleSaveProfile} 
                isUpdating={isUpdatingProfile} 
            />
          )}

          {activeTab === "security" && <SecurityTab />}

          {activeTab === "notifications" && (
            <NotificationsTab 
                formData={formData} 
                onChange={handleChange} 
                onToggle={handleNotificationToggle}
                onSave={handleSaveNotifications} 
                isUpdating={isUpdatingNotify} 
            />
          )}

          {activeTab === "banking" && (
            <BankingTab 
                formData={formData} 
                onChange={handleChange} 
                onSave={handleSaveBanking} 
                isUpdating={isUpdatingBanking} 
            />
          )}

          {activeTab === "documents" && (
            <DocumentsTab 
                docsData={docsData} 
                onFileUpload={handleFileUpload} 
                isUploading={isUploadingDocs} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
