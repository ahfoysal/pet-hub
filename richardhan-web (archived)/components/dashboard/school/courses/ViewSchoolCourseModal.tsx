/* eslint-disable @next/next/no-img-element */
"use client";

import { X } from "lucide-react";
import { SchoolCourse } from "@/types/dashboard/school/SchoolCoursesTypes";

interface ViewSchoolCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: SchoolCourse | null;
}

export default function ViewSchoolCourseModal({
  isOpen,
  onClose,
  course,
}: ViewSchoolCourseModalProps) {
  if (!isOpen || !course) return null;

  const enrolled = course.totalEnrolled || 0;
  const total = course.availableSeats || 20;
  const progress = Math.round((enrolled / total) * 100);

  return (
    <div className="fixed inset-0 top-10 z-100 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-primary/20 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{course.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {course.thumbnailImg && (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={course.thumbnailImg}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Description</h3>
                <p className="text-gray-600 mt-2">
                  {course.details || "No description available"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700">
                    Basic Information
                  </h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">For:</span>{" "}
                      {course.courseFor || "—"}
                    </p>
                    <p>
                      <span className="text-gray-500">Level:</span>{" "}
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          course.courseLevel === "BEGINNER"
                            ? "bg-blue-100 text-blue-800"
                            : course.courseLevel === "INTERMEDIATE"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {course.courseLevel || "—"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Duration:</span>{" "}
                      {course.duration} days
                    </p>
                    <p>
                      <span className="text-gray-500">Classes/week:</span>{" "}
                      {course.classPerWeek}
                    </p>
                    <p>
                      <span className="text-gray-500">Price:</span> $
                      {course.price}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">
                    Enrollment & Trainer
                  </h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Enrolled:</span>{" "}
                      {enrolled} / {total}
                    </p>
                    <p>
                      <span className="text-gray-500">Progress:</span>{" "}
                      <span className="font-medium">{progress}%</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Trainer:</span>{" "}
                      {course.trainer?.name || "—"}
                    </p>
                    <p>
                      <span className="text-gray-500">Location:</span>{" "}
                      {course.location || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Enrollment Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all bg-rose-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Schedules */}
              {course.schedules && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Schedules</h4>
                  <div className="text-sm text-gray-600">
                    {(() => {
                      try {
                        const sched = JSON.parse(course.schedules);
                        if (Array.isArray(sched)) {
                          return sched.map((s: any, i: number) => (
                            <p key={i}>
                              {s.days?.join(", ") || "—"} at {s.time || "—"} (
                              {s.totalSeats || 0} seats)
                            </p>
                          ));
                        }
                        return <p>No schedule information available</p>;
                      } catch {
                        return <p>Invalid schedule format</p>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
