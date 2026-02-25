"use client";

import { useState } from "react";
import {
  Pencil,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  CheckCircle2,
  Building,
} from "lucide-react";
import { useGetHotelProfileQuery } from "@/redux/features/api/dashboard/hotel/profile/hotelProfileApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EditProfileModal from "@/components/dashboard/hotel/profile/EditProfileModal";
import { useSession } from "next-auth/react";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

export default function HotelProfilePage() {
  const { status } = useSession();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { data, isLoading, isError, refetch } = useGetHotelProfileQuery(
    undefined,
    { skip: status === "loading" || !accessToken }
  );
  const [showEdit, setShowEdit] = useState(false);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load profile
          </h2>
          <p className="text-gray-500 mb-5">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const profile = data?.data;

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No profile found
          </h2>
          <p className="text-gray-500">
            Your hotel profile hasn&apos;t been set up yet.
          </p>
        </div>
      </div>
    );
  }

  const address = profile.addresses?.[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground font-bold">
            Hotel Profile
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            View and manage your hotel information
          </p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm sm:self-start"
        >
          <Pencil size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Image Banner */}
        {profile.images && profile.images.length > 0 && (
          <div className="h-44 sm:h-56 overflow-hidden">
            <div className="flex gap-1 h-full">
              {profile.images.slice(0, 3).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={profile.name}
                  className={`object-cover h-full ${
                    profile.images.length === 1
                      ? "w-full"
                      : i === 0
                        ? "flex-2"
                        : "flex-1"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                    <CheckCircle2 size={12} />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-gray-900">
                  {profile.rating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-sm text-gray-500">
                  ({profile.reviewCount ?? 0} reviews)
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                profile.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {profile.status}
            </span>
          </div>

          {profile.description && (
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              {profile.description}
            </p>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mail className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Phone className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {profile.phone}
                </p>
              </div>
            </div>
            {address && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {[
                      address.streetAddress,
                      address.city,
                      address.country,
                      address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Operating Hours
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Day Shift</p>
                <p className="text-sm font-medium text-gray-900">
                  {profile.dayStartingTime || "—"} –{" "}
                  {profile.dayEndingTime || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Clock className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Night Shift</p>
                <p className="text-sm font-medium text-gray-900">
                  {profile.nightStartingTime || "—"} –{" "}
                  {profile.nightEndingTime || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        profile={profile}
      />
    </div>
  );
}
