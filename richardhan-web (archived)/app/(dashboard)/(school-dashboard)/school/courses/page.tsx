/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetSchoolCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/redux/features/api/dashboard/school/courses/SchoolCoursesApi";
import { SchoolCourse } from "@/types/dashboard/school/SchoolCoursesTypes";
import { useSession } from "next-auth/react";
import CreateCourseModal from "@/components/dashboard/school/courses/CreateCourseModal";
import UpdateCourseModal from "@/components/dashboard/school/courses/UpdateCourseModal";
import DeleteCourseModal from "@/components/dashboard/school/courses/DeleteCourseModal";
import ViewSchoolCourseModal from "@/components/dashboard/school/courses/ViewSchoolCourseModal";
import CourseCard from "@/components/dashboard/school/courses/CourseCard"; // ← new import
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SchoolCoursesPage() {
  const { status } = useSession();
  const { showToast } = useToast();

  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetSchoolCoursesQuery(undefined, {
    skip: status === "loading",
  });

  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<SchoolCourse | null>(
    null,
  );
  const [courseToDelete, setCourseToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [courseToView, setCourseToView] = useState<SchoolCourse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCourse = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createCourse(formData).unwrap();
      showToast("Course created successfully!", "success");
      setIsCreating(false);
      refetch();
    } catch (err: any) {
      console.error("Failed to create course:", err);
      showToast(err?.data?.message || "Failed to create course.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async (formData: FormData) => {
    if (!editingCourseId) return;
    setIsSubmitting(true);
    try {
      await updateCourse({
        courseId: editingCourseId,
        data: formData,
      }).unwrap();
      showToast("Course updated successfully!", "success");
      setIsEditing(false);
      setEditingCourseId(null);
      setSelectedCourse(null);
      refetch();
    } catch (err: any) {
      console.error("Failed to update course:", err);
      showToast(err?.data?.message || "Failed to update course.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteCourse(courseToDelete.id).unwrap();
      showToast("Course deleted successfully!", "success");
      setCourseToDelete(null);
      refetch();
    } catch (err: any) {
      console.error("Failed to delete course:", err);
      showToast(err?.data?.message || "Failed to delete course.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (course: SchoolCourse) => {
    setEditingCourseId(course.id);
    setSelectedCourse(course);
    setIsEditing(true);
  };

  const startViewing = (course: SchoolCourse) => {
    setCourseToView(course);
  };

  const handleDeleteClick = (course: SchoolCourse) => {
    setCourseToDelete({ id: course.id, name: course.name });
  };

  const cancelModals = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingCourseId(null);
    setSelectedCourse(null);
    setCourseToView(null);
    setCourseToDelete(null);
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 className="text-red-800 font-semibold text-lg">
          Error loading courses
        </h2>
        <p className="text-red-600 mt-2">
          {error instanceof Error
            ? error.message
            : "An error occurred while loading your courses."}
        </p>
      </div>
    );
  }

  const courses = coursesData?.data.data || [];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Course Management</h1>
          <p className="text-gray-500">
            Create and manage your training courses
          </p>
        </div>

        <Button
          text="Add New Course"
          onClick={() => {
            setIsCreating(true);
            setIsEditing(false);
            setSelectedCourse(null);
          }}
          icon={<Plus size={18} />}
          iconPosition="left"
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm"
        />
      </div>

      {/* Modals */}
      <CreateCourseModal
        isOpen={isCreating}
        onClose={cancelModals}
        onSubmit={handleCreateCourse}
        isSubmitting={isSubmitting}
      />

      <UpdateCourseModal
        isOpen={isEditing}
        onClose={cancelModals}
        onSubmit={handleUpdateCourse}
        course={selectedCourse}
        isSubmitting={isSubmitting}
      />

      <ViewSchoolCourseModal
        isOpen={!!courseToView}
        onClose={cancelModals}
        course={courseToView}
      />

      <DeleteCourseModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDeleteCourse}
        courseName={courseToDelete?.name}
        isSubmitting={isSubmitting}
      />

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={startEditing}
            onDelete={handleDeleteClick}
            onView={startViewing}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="inline-block p-5 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No courses yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first training course to get started
          </p>
        </div>
      )}
    </div>
  );
}
