/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetMyProfileQuery } from "@/redux/features/api/profile/ProfileSetupApi";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
  Heart,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";

export default function OwnerSettingsClient() {
  const { showToast } = useToast();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useGetMyProfileQuery();

  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    streetAddress: "",
    city: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    if (profileData?.data) {
      const user = profileData.data;
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.description || "",
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

  const handleSave = () => {
    showToast("Profile updated successfully (Simulated)", "success");
  };

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-gray-400 font-arimo italic">
          Personalizing your experience...
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
            My Profile
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          </h1>
          <p className="text-gray-500 font-arimo mt-2">
            Update your personal information and account preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-3 bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-gray-200"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <User className="w-5 h-5 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-nunito">
                Personal Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-rose-100 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-rose-100 transition-all outline-none"
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-rose-100 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Short Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-rose-100 transition-all outline-none resize-none"
                  placeholder="A little bit about you and your pets..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-nunito">
                Default Location
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-full space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Residential Address
                </label>
                <input
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-rose-100 transition-all outline-none"
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
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-rose-100 transition-all outline-none"
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
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl font-nunito font-bold focus:bg-white focus:border-rose-100 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-6 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {profileData?.data?.image ? (
                <img
                  src={profileData.data.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-300" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-nunito">
              {formData.fullName || "Pet Owner"}
            </h3>
            <p className="text-xs text-gray-400 font-arimo mt-1 mb-6">
              Platinum Member
            </p>
            <button className="w-full py-3 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">
              Change Photo
            </button>
          </div>

          <div className="bg-rose-500 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-rose-200 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-rose-200 fill-rose-200" />
              <h3 className="text-lg font-bold font-nunito">Pet Loyalty</h3>
            </div>
            <p className="text-xs text-rose-100 font-arimo leading-relaxed">
              You've completed <strong>12</strong> successful bookings. Enjoy 5%
              extra discount on your next reservation!
            </p>
            <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
