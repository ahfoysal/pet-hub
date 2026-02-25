/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetMyProfileQuery,
  useCompleteSitterProfileMutation,
} from "@/redux/features/api/profile/ProfileSetupApi";
import {
  School,
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
  BadgeCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function SchoolSettingsClient() {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useCompleteSitterProfileMutation();

  const [formData, setFormData] = useState<any>({
    designation: "",
    bio: "",
    yearsOfExperience: 0,
    languages: [],
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    if (profileData?.data) {
      const user = profileData.data;
      setFormData({
        designation: user.fullName || "",
        bio: user.description || "",
        yearsOfExperience: 5, // Default for now
        languages: ["English"],
        streetAddress: user.address?.streetAddress || "",
        city: user.address?.city || "",
        country: user.address?.country || "",
        postalCode: user.address?.postalCode || "",
      });
    }
  }, [profileData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      toast.success("School profile updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-gray-400 font-arimo italic">
          Accessing school records...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-nunito tracking-tight flex items-center gap-3">
            School Settings
            <BadgeCheck className="w-8 h-8 text-blue-500" />
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Configure your training programs, facilities, and contact
            information.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="flex items-center gap-3 bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          {isUpdating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <School className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-nunito">
                Institution Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Academic Designation
                </label>
                <input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-primary/20 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Experience (Years)
                </label>
                <input
                  name="yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-primary/20 transition-all outline-none"
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  School Biography
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-primary/20 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-nunito">
                Campus Location
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-full space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Street Address
                </label>
                <input
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-primary/20 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-primary/20 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Postal Code
                </label>
                <input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-primary/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold font-nunito">Languages</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["English", "French", "Spanish"].map((lang) => (
                <span
                  key={lang}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold font-arimo"
                >
                  {lang}
                </span>
              ))}
              <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest">
                + Add
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 font-nunito">
                Verification
              </h2>
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-xs text-orange-800 font-arimo leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                Verification in progress. Keep your school details accurate to
                speed up the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
