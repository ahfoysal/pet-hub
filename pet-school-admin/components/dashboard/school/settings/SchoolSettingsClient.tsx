/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
// import { useToast } from "@/contexts/ToastContext"; // Assuming similar toast context exists or will be needed
import DashboardHeading from "@/components/dashboard/common/DashboardHeading";

// Sub-components
import SettingsSidebar from "./SettingsSidebar";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import NotificationsTab from "./tabs/NotificationsTab";
import BankingTab from "./tabs/BankingTab";
import DocumentsTab from "./tabs/DocumentsTab";

export default function SchoolSettingsClient() {
  // Mock states and functions since we might not have the full redux setup yet
  // Once the user connects the backend, these should be replaced with real RTK Query hooks
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<any>({
    fullName: "John Doe",
    email: "john.doe@petschool.com",
    phone: "+1 (555) 123-4567",
    yearsOfExperience: 5,
    bankName: "Chase Bank",
    accountHolderName: "John Doe",
    accountNumber: "**** 5678",
    routingNumber: "**** 1234",
    // Notification Fields
    newBookings: true,
    checkInReminders: true,
    checkOutReminders: true,
    paymentUpdates: true,
    adminMessages: true,
    bookingCancellations: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNotificationToggle = async (name: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [name]: checked }));
    console.log(`Notification ${name} toggled to ${checked}`);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const handleFileUpload = async (e: any) => {
    const files = e.target.files;
    if (!files?.length) return;
    console.log("Uploading files...", files);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-[#ff7176] mb-4" />
        <p className="text-gray-400 italic">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-[25px] pb-10 bg-[#f2f4f8]">
      <DashboardHeading 
        title="Settings" 
        subtitle="Manage your account and school settings" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px] items-start">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="lg:col-span-9">
          {activeTab === "profile" && (
            <ProfileTab 
                formData={formData} 
                onChange={handleChange} 
                onSave={handleSave} 
                isUpdating={isUpdating} 
            />
          )}

          {activeTab === "security" && <SecurityTab />}

          {activeTab === "notifications" && (
            <NotificationsTab 
                formData={formData} 
                onChange={handleChange} 
                onToggle={handleNotificationToggle}
                onSave={handleSave} 
                isUpdating={isUpdating} 
            />
          )}

          {activeTab === "banking" && (
            <BankingTab 
                formData={formData} 
                onChange={handleChange} 
                onSave={handleSave} 
                isUpdating={isUpdating} 
            />
          )}

          {activeTab === "documents" && (
            <DocumentsTab 
                docsData={{ data: [] }} 
                onFileUpload={handleFileUpload} 
                isUploading={isUpdating} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
