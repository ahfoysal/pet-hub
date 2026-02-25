/* eslint-disable @next/next/no-img-element */
"use client";

import { Eye, Edit, Trash2, Clock, Users, FileText } from "lucide-react";
import { SchoolCourse } from "@/types/dashboard/school/SchoolCoursesTypes";
import Button from "@/components/ui/Button";

interface CourseCardProps {
  course: SchoolCourse;
  onEdit: (course: SchoolCourse) => void;
  onDelete: (course: SchoolCourse) => void;
  onView: (course: SchoolCourse) => void;
}

export default function CourseCard({
  course,
  onEdit,
  onDelete,
  onView,
}: CourseCardProps) {
  const enrolled = course.totalEnrolled ?? 0;
  const total = course.totalSeats ?? 0;

  const progress = total > 0 ? Math.round((enrolled / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between">
        <span className="px-4 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
          ACTIVE
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(course)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(course)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-4 text-xl font-bold text-gray-900">{course.name}</h3>

      {/* Description */}
      <p className="mt-2 text-gray-500 line-clamp-2">{course.details}</p>

      {/* Info */}
      <div className="mt-5 space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-red-400" />
          <span>{course.courseLevel}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} className="text-red-400" />
          <span>
            {course.duration} weeks • {course.classPerWeek} classes per week
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={18} className="text-green-500" />
          <span>
            {enrolled} / {total} enrolled
          </span>
        </div>

        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-orange-500">$</span>
          <span>${course.price}</span>
        </div>
      </div>

      {/* Enrollment bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Enrollment</span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* View Details */}
      <Button
        text="View Details"
        iconPosition="left"
        icon={<Eye size={18} />}
        onClick={() => onView(course)}
        className="mt-6 w-full flex items-center cursor-pointer hover:bg-primary hover:text-white justify-center gap-2 py-3 rounded-xl bg-gray-50 transition-colors duration-300 text-gray-700 font-medium"
      />
    </div>
  );
}
