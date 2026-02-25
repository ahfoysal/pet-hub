/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetSitterProfileQuery,
  useUpdateSitterProfileMutation,
  useGetSitterDetailsQuery,
  useUpdateSitterDetailsMutation,
  useGetSitterNotificationSettingsQuery,
  useUpdateSitterNotificationSettingsMutation,
  useGetSitterBankingInfoQuery,
  useUpdateSitterBankingInfoMutation,
  useGetSitterDocumentsQuery,
  useUploadSitterDocumentsMutation,
} from "@/redux/features/api/dashboard/sitter/settings/sitterSettingsApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Camera,
  Save,
  Loader2,
  Globe,
  Info,
  ShieldCheck,
  Languages,
  Award,
  Bell,
  CreditCard,
  FileText,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function SitterSettingsClient() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile
  const { data: profileData, isLoading: isProfileLoading, refetch: refetchProfile } = useGetSitterProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateSitterProfileMutation();

  // Sitter Details
  const { data: detailsData, isLoading: isDetailsLoading, refetch: refetchDetails } = useGetSitterDetailsQuery();
  const [updateDetails, { isLoading: isUpdatingDetails }] = useUpdateSitterDetailsMutation();

  // Notifications
  const { data: notifyData, isLoading: isNotifyLoading, refetch: refetchNotify } = useGetSitterNotificationSettingsQuery();
  const [updateNotify, { isLoading: isUpdatingNotify }] = useUpdateSitterNotificationSettingsMutation();

  // Banking
  const { data: bankingData, isLoading: isBankingLoading, refetch: refetchBanking } = useGetSitterBankingInfoQuery();
  const [updateBanking, { isLoading: isUpdatingBanking }] = useUpdateSitterBankingInfoMutation();

  // Documents
  const { data: docsData, isLoading: isDocsLoading, refetch: refetchDocs } = useGetSitterDocumentsQuery();
  const [uploadDocs, { isLoading: isUploadingDocs }] = useUploadSitterDocumentsMutation();

  const [formData, setFormData] = useState<any>({
    // Profile
    fullName: "",
    email: "",
    phone: "",
    yearsOfExperience: 0,
    // Details
    description: "",
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
    // Banking
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  });

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
    if (detailsData?.data) {
      const d = detailsData.data;
      setFormData((prev: any) => ({
        ...prev,
        description: d.description || "",
        streetAddress: d.addresses?.[0]?.streetAddress || "",
        city: d.addresses?.[0]?.city || "",
        country: d.addresses?.[0]?.country || "",
        postalCode: d.addresses?.[0]?.postalCode || "",
      }));
    }
  }, [detailsData]);

  useEffect(() => {
    if (notifyData?.data) {
      setFormData((prev: any) => ({
        ...prev,
        emailNotifications: notifyData.data.emailNotifications,
        smsNotifications: notifyData.data.smsNotifications,
        pushNotifications: notifyData.data.pushNotifications,
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

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        yearsOfExperience: Number(formData.yearsOfExperience),
      }).unwrap();
      toast.success("Profile updated successfully");
      refetchProfile();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleSaveDetails = async () => {
    try {
      await updateDetails({
        description: formData.description,
        address: {
          streetAddress: formData.streetAddress,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
        },
      }).unwrap();
      toast.success("Sitter details updated successfully");
      refetchDetails();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update details");
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateNotify({
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        pushNotifications: formData.pushNotifications,
      }).unwrap();
      toast.success("Notification settings updated");
      refetchNotify();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update notifications");
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
      toast.success("Banking info updated");
      refetchBanking();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update banking");
    }
  };

  const handleFileUpload = async (e: any) => {
    const files = e.target.files;
    if (!files?.length) return;

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append("files", files[i]);
    }

    try {
      await uploadDocs(fd).unwrap();
      toast.success("Documents uploaded successfully");
      refetchDocs();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to upload documents");
    }
  };

  if (isProfileLoading || isDetailsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-gray-400 font-arimo italic">Accessing sitter credentials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight flex items-center gap-3">
            Sitter Settings
            <ShieldCheck className="w-8 h-8 text-green-500" />
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Manage your professional profile, service details, and preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "details", label: "Sitter Details", icon: Award },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "banking", label: "Banking", icon: CreditCard },
            { id: "documents", label: "Documents", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-primary" : "text-gray-400"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[500px]">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b pb-6">
                  <h2 className="text-xl font-bold font-nunito">Profile Information</h2>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isUpdatingProfile}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase"
                  >
                    {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Profile
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Experience (Years)</label>
                    <input
                      name="yearsOfExperience"
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b pb-6">
                  <h2 className="text-xl font-bold font-nunito">Sitter Details & Address</h2>
                  <button
                    onClick={handleSaveDetails}
                    disabled={isUpdatingDetails}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase"
                  >
                    {isUpdatingDetails ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Details
                  </button>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Professional Bio</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none resize-none border border-transparent focus:border-primary/20 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-full space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Street Address</label>
                      <input
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">City</label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Postal Code</label>
                      <input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b pb-6">
                  <h2 className="text-xl font-bold font-nunito">Notification Preferences</h2>
                  <button
                    onClick={handleSaveNotifications}
                    disabled={isUpdatingNotify}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase"
                  >
                    {isUpdatingNotify ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Preferences
                  </button>
                </div>
                <div className="space-y-6">
                  {[
                    { id: "emailNotifications", label: "Email Notifications", desc: "Receive updates via your registered email." },
                    { id: "smsNotifications", label: "SMS Notifications", desc: "Get critical alerts sent to your phone." },
                    { id: "pushNotifications", label: "Push Notifications", desc: "Real-time updates in your browser or app." },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                      <div>
                        <h4 className="font-bold text-gray-900">{item.label}</h4>
                        <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        name={item.id}
                        checked={formData[item.id]}
                        onChange={handleChange}
                        className="w-6 h-6 rounded-lg accent-primary cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BANKING TAB */}
            {activeTab === "banking" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b pb-6">
                  <h2 className="text-xl font-bold font-nunito">Bank Information</h2>
                  <button
                    onClick={handleSaveBanking}
                    disabled={isUpdatingBanking}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase"
                  >
                    {isUpdatingBanking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Banking
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Bank Name</label>
                    <input
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Account Holder Name</label>
                    <input
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Account Number</label>
                    <input
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Routing Number / Swift</label>
                    <input
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b pb-6">
                  <h2 className="text-xl font-bold font-nunito">Legal Documents</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[
                    { label: "Business License", key: "businessLicense", value: docsData?.data?.businessLicense },
                    { label: "Insurance Certificate", key: "insuranceCertificate", value: docsData?.data?.insuranceCertificate },
                  ].map((doc) => (
                    <div key={doc.key} className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
                      {doc.value ? (
                        <div className="w-full aspect-video rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                           <img src={doc.value} alt={doc.label} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <FileText className="w-12 h-12 text-gray-200" />
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900">{doc.label}</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Upload PDF or high-quality image</p>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-full">
                    <label className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-8 py-4 rounded-2xl cursor-pointer transition-all">
                      {isUploadingDocs ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                      <span className="font-black text-xs uppercase tracking-widest">Upload Documents</span>
                      <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
