"use client";

import { useState } from "react";
import { Search, Eye, ChevronDown, X } from "lucide-react";
import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useGetAllStudentsQuery,
  useLazyGetPetProfileQuery,
} from "@/redux/features/api/dashboard/school/student/SchoolStudentApi"; // add lazy query
import { EnrollmentData } from "@/types/dashboard/school/SchoolStudentsTypes";
import ViewPetProfileModal from "@/components/dashboard/school/students/ViewPetProfileModal";

export default function StudentManagementPage() {
  const { status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const {
    data: studentsData,
    isLoading,
    isError,
  } = useGetAllStudentsQuery(undefined, {
    skip: status === "loading",
  });

  const [getPetProfile, { data: petData, isLoading: isPetLoading }] =
    useLazyGetPetProfileQuery();

  const students = studentsData?.data ?? [];

  // Filter students
  const filteredStudents = students.filter((enrollment: EnrollmentData) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      enrollment.user.fullName.toLowerCase().includes(searchLower) ||
      enrollment.petProfile.petName.toLowerCase().includes(searchLower) ||
      enrollment.course.name.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "All Status" ||
      enrollment.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // View pet details
  const handleView = (petId: string) => {
    setSelectedPetId(petId);
    getPetProfile(petId);
  };

  const closeModal = () => {
    setSelectedPetId(null);
  };

  const getStatusStyles = (status: string) => {
    const lower = status.toLowerCase();
    switch (lower) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
      case "dropped":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200! rounded-xl p-6 text-center">
        <h2 className="text-red-800 font-semibold">Failed to load students</h2>
        <p className="text-red-600 mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <DashboardHeading
        title="Student Management"
        description="View and manage all enrolled students"
      />

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by owner name, pet name, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300! rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <button className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300! rounded-lg bg-white hover:bg-gray-50">
            <span className="text-gray-700">{statusFilter}</span>
            <ChevronDown size={18} className="text-gray-500" />
          </button>
          {/* You can replace this with real dropdown/select later */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200! shadow-sm overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-6 min-w-[1100px] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200! text-xs font-medium text-gray-600 uppercase tracking-wider">
          <div className="col-span-2">OWNER / PET</div>
          <div>COURSE ENROLLED</div>
          <div>ADMISSION DATE</div>
          <div className="text-center">STATUS</div>
          <div className="text-center">ACTIONS</div>
        </div>

        {/* Table Body */}
        {filteredStudents.length > 0 ? (
          filteredStudents.map((enrollment: EnrollmentData) => {
            const pet = enrollment.petProfile;
            const user = enrollment.user;
            const initials = user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            return (
              <div
                key={enrollment.petProfile.id}
                className="grid grid-cols-6 min-w-[1100px] gap-4 px-6 py-5 border-b border-gray-100! hover:bg-gray-50 transition-colors items-center"
              >
                {/* Owner / Pet */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold text-sm">
                    {initials}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.fullName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pet.petName} ({pet.breed})
                    </div>
                  </div>
                </div>

                {/* Course */}
                <div className="text-gray-900 font-medium">
                  {enrollment.course.name}
                </div>

                {/* Admission Date */}
                <div className="text-gray-600">
                  {enrollment.enrolledAt
                    ? new Date(enrollment.enrolledAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    : "—"}
                </div>

                {/* Status */}
                <div className="text-center">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(
                      enrollment.status,
                    )}`}
                  >
                    {enrollment.status.charAt(0).toUpperCase() +
                      enrollment.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Actions */}
                <div className="text-center">
                  <button
                    onClick={() => handleView(pet.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-rose-600 cursor-pointer hover:text-black hover:bg-primary/30! rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-gray-500">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No students found</p>
            <p className="mt-1 text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Pet Detail Modal */}
      {selectedPetId && (
        <ViewPetProfileModal
          isOpen={!!selectedPetId}
          onClose={closeModal}
          petData={petData?.data ?? null}
          isLoading={isPetLoading}
        />
      )}
    </div>
  );
}
