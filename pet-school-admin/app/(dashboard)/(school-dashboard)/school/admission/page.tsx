"use client";

import { useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetAllAdmissionRequestQuery } from "@/redux/features/api/dashboard/school/admission/SchoolAdmissionApi";
import ViewAdmissionRequestModal from "@/components/dashboard/school/admission/ViewAdmissionRequestModal";
import Image from "next/image";

// Types based on your API response
interface PetProfile {
  id: string;
  petName: string;
  petType: string;
  breed: string;
  profileImg: string | null;
}

interface User {
  id: string;
  fullName: string;
  image: string | null;
}

interface Course {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  time: string;
}

interface AdmissionRequest {
  id: string;
  paymentId: string | null;
  petProfile: PetProfile;
  user: User;
  course: Course;
  schedule: Schedule;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface AdmissionsResponse {
  success: boolean;
  message: string;
  data: AdmissionRequest[];
}

export default function AdmissionsManagementPage() {
  const { status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(
    null,
  );

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetAllAdmissionRequestQuery(undefined, {
    skip: status === "loading",
  });

  const admissions = (response as AdmissionsResponse)?.data || [];

  // Filter admissions
  const filteredAdmissions = admissions.filter((adm: AdmissionRequest) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      adm.user.fullName.toLowerCase().includes(searchLower) ||
      adm.petProfile.petName.toLowerCase().includes(searchLower) ||
      adm.course.name.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "All Status" ||
      adm.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "✔";
      case "PENDING":
        return "⏳";
      case "REJECTED":
        return "✖";
      default:
        return "•";
    }
  };

  const getStats = () => {
    const pending = admissions.filter(
      (a) => a.status.toUpperCase() === "PENDING",
    ).length;
    const approved = admissions.filter(
      (a) => a.status.toUpperCase() === "APPROVED",
    ).length;
    const rejected = admissions.filter(
      (a) => a.status.toUpperCase() === "REJECTED",
    ).length;

    return { pending, approved, rejected };
  };

  const stats = getStats();

  const handleView = (admission: AdmissionRequest) => {
    setSelectedAdmissionId(admission.id);
  };

  const closeModal = () => {
    setSelectedAdmissionId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 className="text-red-800 font-semibold">
          Failed to load admissions
        </h2>
        <p className="text-red-600 mt-2">
          {(error as unknown as { data?: { message?: string } })?.data
            ?.message || "Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <DashboardHeading
        title="Admissions Management"
        description="Review and manage course admission requests"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-yellow-100 rounded-lg">
            <span className="text-2xl">⏳</span>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Pending Review</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-green-100 rounded-lg">
            <span className="text-2xl">✔</span>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Approved</p>
            <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-red-100 rounded-lg">
            <span className="text-2xl">✖</span>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Rejected</p>
            <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by owner name, pet name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700">{statusFilter}</span>
            <ChevronDown size={18} className="text-gray-500" />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {["All Status", "Pending", "Approved", "Rejected"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsStatusDropdownOpen(false);
                    }}
                    className="w-full text-left cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-6 min-w-275 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200! text-xs font-medium text-gray-600 uppercase tracking-wider">
          <div className="">NAME</div>
          <div>PET</div>
          <div>COURSE</div>
          <div>REQUEST DATE</div>
          <div className="text-center">STATUS</div>
          <div className="text-center">ACTION</div>
        </div>

        {/* Table Body */}
        {filteredAdmissions.length > 0 ? (
          filteredAdmissions.map((adm: AdmissionRequest) => {
            const initials = adm.user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            const colorClasses = [
              "bg-rose-500",
              "bg-pink-500",
              "bg-purple-500",
              "bg-indigo-500",
              "bg-blue-500",
              "bg-cyan-500",
              "bg-teal-500",
              "bg-emerald-500",
            ];
            const colorIndex =
              parseInt(adm.user.id.slice(0, 8), 16) % colorClasses.length;
            const bgColor = colorClasses[colorIndex];

            const date = new Date(adm.createdAt);
            const formattedDate = date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={adm.id}
                className="grid grid-cols-6 min-w-[1100px] gap-4 px-6 py-5 border-b border-gray-100! hover:bg-gray-50 transition-colors items-center"
              >
                {/* Name */}
                <div className=" flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${bgColor}`}
                  >
                    {initials}
                  </div>
                  <div className="font-medium text-gray-900">
                    {adm.user.fullName}
                  </div>
                </div>

                {/* Pet */}
                <div className="text-gray-700 font-medium flex items-center gap-2">
                  {adm.petProfile.profileImg ? (
                    <Image
                      width={400}
                      height={400}
                      src={adm.petProfile.profileImg}
                      alt={adm.petProfile.petName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  )}
                  {adm.petProfile.petName} ({adm.petProfile.breed})
                </div>

                {/* Course */}
                <div className="text-gray-900 font-medium">
                  {adm.course.name}
                </div>

                {/* Request Date */}
                <div className="text-gray-600">{formattedDate}</div>

                {/* Status */}
                <div className="text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(
                      adm.status,
                    )}`}
                  >
                    {getStatusIcon(adm.status)}
                    {adm.status.charAt(0).toUpperCase() +
                      adm.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Actions */}
                <div className="text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleView(adm)}
                    className="p-2 text-gray-600 cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="View admission details"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-gray-500">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No admission requests found</p>
            <p className="mt-1 text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* View Admission Modal */}
      {selectedAdmissionId && (
        <ViewAdmissionRequestModal
          isOpen={true}
          onClose={closeModal}
          admissionId={selectedAdmissionId}
        />
      )}
    </div>
  );
}
