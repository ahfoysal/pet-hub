/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetAdmissionByIdQuery,
  useRespondToAdmissionRequestMutation,
} from "@/redux/features/api/dashboard/school/admission/SchoolAdmissionApi";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ViewAdmissionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  admissionId: string | null;
}

export default function ViewAdmissionRequestModal({
  isOpen,
  onClose,
  admissionId,
}: ViewAdmissionRequestModalProps) {
  const [respond, { isLoading: isResponding }] =
    useRespondToAdmissionRequestMutation();
  const { showToast } = useToast();

  // Fetch admission details by ID
  const {
    data: admissionData,
    isLoading,
    isError,
  } = useGetAdmissionByIdQuery(admissionId || "", {
    skip: !admissionId || !isOpen,
  });

  const admission = admissionData?.data || null;

  if (!isOpen || !admissionId) return null;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !admission) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="relative w-full max-w-xl bg-gray-100 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-white m-4 rounded-3xl p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Admission
              </h3>
              <p className="text-gray-600">Could not load admission details.</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const date = new Date(admission.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleRespond = async (status: "APPROVED" | "REJECTED") => {
    try {
      await respond({
        admissionId: admission.id,
        status: { status },
      }).unwrap();

      showToast(
        `Admission request ${status.toLowerCase()} successfully!`,
        "success",
      );
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      showToast(
        errorMessage || `Failed to ${status.toLowerCase()} request.`,
        "error",
      );
    }
  };

  const isPending = admission.status.toUpperCase() === "PENDING";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Card Container */}
        <div className="bg-white m-4 rounded-3xl p-6 space-y-6">
          {/* Pet Image */}
          <div className="w-full h-64 rounded-2xl overflow-hidden">
            {admission.petProfile.profileImg ? (
              <img
                src={admission.petProfile.profileImg}
                alt={admission.petProfile.petName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Name & Status */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {admission.petProfile.petName} ({admission.petProfile.breed})
              </h2>
            </div>

            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                admission.status === "APPROVED"
                  ? "bg-green-100 text-green-600"
                  : admission.status === "PENDING"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-red-100 text-red-600"
              }`}
            >
              {admission.status.charAt(0).toUpperCase() +
                admission.status.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Course Section */}
          <div className="space-y-3 text-sm text-gray-700 flex">
            <div className="w-1/2">
              <p className="font-bold text-gray-900 text-xl">Course</p>
              <p className="text-lg">{admission.course.name}</p>
            </div>

            <div className="w-1/2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Price:</span>
                  <span>${admission.course.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Duration:</span>
                  <span>{admission.course.duration} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Classes per week:
                  </span>
                  <span>{admission.course.classPerWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Average Rating:
                  </span>
                  <span>{admission.course.avgRating.toFixed(1)} ⭐</span>
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-gray-900">
                    Course Objective:
                  </p>
                  <p className="text-gray-700">
                    {admission.course.courseObjective}
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <span>Request Date</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isPending && (
            <div className="flex gap-4 pt-4">
              <Button
                text="Reject"
                variant="outline"
                className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"
                onClick={() => handleRespond("REJECTED")}
                disabled={isResponding}
              />
              <Button
                text="Approve"
                variant="primary"
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleRespond("APPROVED")}
                disabled={isResponding}
              />
            </div>
          )}

          {/* {!isPending && (
            <div className="text-center text-gray-500 text-sm pt-2">
              This request has already been {admission.status.toLowerCase()}.
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
