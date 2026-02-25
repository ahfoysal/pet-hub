/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DropdownButton from "@/components/ui/DropdownButton";
import FileUpload from "@/components/ui/FileUpload";
import { Save, X } from "lucide-react";
import {
  SchoolCourse,
  DiscountType,
  CourseLevel,
} from "@/types/dashboard/school/SchoolCoursesTypes";
import { useGetSchoolTrainersQuery } from "@/redux/features/api/dashboard/school/trainers/SchoolTrainersApi";
import { useSession } from "next-auth/react";
import Textarea from "@/components/ui/Textarea";

interface UpdateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  course?: SchoolCourse | null;
  isSubmitting: boolean;
}

type Schedule = {
  days: string[];
  time: string;
  totalSeats: number;
};

const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  course,
  isSubmitting,
}) => {
  const { status } = useSession();
  const { data: trainersData, isLoading: trainersLoading } =
    useGetSchoolTrainersQuery(undefined, {
      skip: status === "loading",
    });

  const [formData, setFormData] = useState({
    name: "",
    details: "",
    courseObjective: "",
    outcomes: "",
    price: "",
    discount: "",
    discountType: "",
    duration: "",
    classPerWeek: "",
    courseFor: "",
    location: "",
    trainerId: "",
    courseLevel: "BEGINNER",
    startDate: "",
    endDate: "",
  });

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const trainerOptions = [
    { value: "", label: "Select a Trainer" },
    ...(trainersData?.data.trainers.map((trainer) => ({
      value: trainer.id,
      label: trainer.name,
    })) || []),
  ];

  // Load course data when modal opens or course changes
  useEffect(() => {
    if (course && isOpen) {
      setFormData({
        name: course.name || "",
        details: course.details || "",
        courseObjective: course.courseObjective || "",
        outcomes: course.outcomes?.join(", ") || "",
        price: course.price?.toString() || "",
        discount: course.discount?.toString() || "",
        discountType: (course.discountType as DiscountType) || "",
        duration: course.duration?.toString() || "",
        classPerWeek: course.classPerWeek?.toString() || "",
        courseFor: course.courseFor || "",
        location: course.location || "",
        trainerId: course.trainerId || "",
        courseLevel: (course.courseLevel as CourseLevel) || "BEGINNER",
        startDate: course.startDate?.split("T")[0] || "",
        endDate: course.endDate?.split("T")[0] || "",
      });

      let parsedSchedules: Schedule[] = [];
      if (course.schedules) {
        if (Array.isArray(course.schedules)) {
          parsedSchedules = course.schedules;
        } else if (typeof course.schedules === "string") {
          try {
            const parsed = JSON.parse(course.schedules);
            if (Array.isArray(parsed)) parsedSchedules = parsed;
          } catch (err) {
            console.warn("Failed to parse schedules:", err);
          }
        }
      }

      // Transform schedules to new format: only keep days, time, and totalSeats
      const transformedSchedules = parsedSchedules.map((schedule: any) => ({
        days: schedule.days || [],
        time: schedule.time || "",
        totalSeats: schedule.totalSeats || 0,
      }));

      setSchedules(transformedSchedules);

      setImagePreview(course.thumbnailImg || null);
      setImageFile(null);
    }
  }, [course, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(course?.thumbnailImg || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.trainerId) {
      alert("Please select a trainer");
      return;
    }

    const submitData = new FormData();

    // Basic info
    submitData.append("name", formData.name);
    submitData.append("courseFor", formData.courseFor);
    submitData.append("details", formData.details);
    submitData.append("courseObjective", formData.courseObjective);

    submitData.append("outcomes", formData.outcomes);

    // Pricing
    submitData.append("price", formData.price);
    if (formData.discount) submitData.append("discount", formData.discount);
    if (formData.discountType)
      submitData.append("discountType", formData.discountType);

    // Duration & Level
    submitData.append("duration", formData.duration);
    submitData.append("classPerWeek", formData.classPerWeek);
    submitData.append("courseLevel", formData.courseLevel);

    // Dates
    submitData.append("startDate", formData.startDate);
    submitData.append("endDate", formData.endDate);

    // Trainer & Location
    submitData.append("trainerId", formData.trainerId);
    if (formData.location) submitData.append("location", formData.location);

    // Image
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-20 z-100 overflow-y-auto">
      <div
        className="fixed inset-0  bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-300! px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Course</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Course Name"
                  placeholder="Enter course name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className=""
                />
              </div>
              <div className="col-span-2">
                <Textarea
                  label="Course For"
                  placeholder="e.g., Puppies, Adult Dogs, All Breeds"
                  name="courseFor"
                  value={formData.courseFor}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Course Name"
                placeholder="Enter course name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Course For"
                placeholder="e.g., Puppies, Adult Dogs, All Breeds"
                name="courseFor"
                value={formData.courseFor}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Price"
                placeholder="10"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Discount"
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
              />
              <div className="col-span-2">
                <label className="block text-base font-medium text-foreground mb-2 ">
                  Discount Type
                </label>
                <DropdownButton
                  options={[
                    { value: "", label: "None" },
                    { value: "PERCENTAGE", label: "Percentage (%)" },
                    { value: "FLAT", label: "Flat Amount" },
                  ]}
                  value={formData.discountType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, discountType: value }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Duration & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Duration (days)"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Classes per Week"
                type="number"
                name="classPerWeek"
                value={formData.classPerWeek}
                onChange={handleInputChange}
                required
              />
              <div className="col-span-2">
                <label className="block text-base font-medium text-foreground mb-2">
                  Course Level *
                </label>
                <DropdownButton
                  options={[
                    { value: "BEGINNER", label: "Beginner" },
                    { value: "INTERMEDIATE", label: "Intermediate" },
                    { value: "ADVANCED", label: "Advanced" },
                  ]}
                  value={formData.courseLevel}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      courseLevel: value as CourseLevel,
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
              <Input
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Trainer & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-medium text-foreground mb-2">
                  Assigned Trainer *
                </label>
                <DropdownButton
                  options={trainerOptions}
                  value={formData.trainerId}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, trainerId: value }))
                  }
                  placeholder="Select a Trainer"
                  className="w-full"
                  disabled={trainersLoading}
                />
                {trainersLoading && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Loading trainers...
                  </p>
                )}
              </div>

              <Input
                label="Location"
                placeholder="e.g., Main Training Hall, Online, Park"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            {/* Objective */}
            <div>
              <label className="block text-base font-medium text-foreground mb-2">
                Course Objective
              </label>
              <textarea
                name="courseObjective"
                value={formData.courseObjective}
                onChange={handleInputChange}
                rows={2}
                className="block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="What is the main goal of this course?"
              />
            </div>

            {/* Outcomes */}
            <div>
              <label className="block text-base font-medium text-foreground mb-2">
                Expected Outcomes (comma-separated)
              </label>
              <Input
                placeholder="e.g., Sit on command, Walk on leash, Come when called"
                name="outcomes"
                value={formData.outcomes}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate each outcome with a comma
              </p>
            </div>

            {/* Details */}
            <div>
              <label className="block text-base font-medium text-foreground mb-2">
                Detailed Description
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
                className="block w-full px-4 py-3 bg-background rounded-md border border-border shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Provide detailed information about the course content, target audience, prerequisites, etc..."
              />
            </div>

            {/* Thumbnail */}
            <div>
              <FileUpload
                label="Course Thumbnail Image"
                description="PNG, JPG, GIF (MAX. 5MB)"
                onFileSelect={handleFileSelect}
                preview={true}
                maxSizeMB={5}
                acceptedTypes="image/*"
                initialPreview={imagePreview ? imagePreview : null}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100!">
              <Button
                text={isSubmitting ? "Updating..." : "Update Course"}
                type="submit"
                variant="primary"
                icon={<Save size={16} />}
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
              />
              <Button
                text="Cancel"
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourseModal;
