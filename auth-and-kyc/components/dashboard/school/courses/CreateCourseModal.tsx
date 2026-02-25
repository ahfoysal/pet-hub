/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DropdownButton from "@/components/ui/DropdownButton";
import FileUpload from "@/components/ui/FileUpload";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { useGetSchoolTrainersQuery } from "@/redux/features/api/dashboard/school/trainers/SchoolTrainersApi";
import { useSession } from "next-auth/react";
import { CourseLevel } from "@/types/dashboard/school/SchoolCoursesTypes";
import Textarea from "@/components/ui/Textarea";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

type Schedule = {
  days: string[];
  time: string;
  totalSeats: number;
};

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
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
      setSchedules([]);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [isOpen]);
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

  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
      setImagePreview(null);
    }
  };

  const addSchedule = () => {
    setSchedules((prev) => [...prev, { days: [], time: "", totalSeats: 0 }]);
  };

  const removeSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: any) => {
    setSchedules((prev) =>
      prev.map((sched, i) =>
        i === index ? { ...sched, [field]: value } : sched,
      ),
    );
  };

  const toggleDay = (index: number, day: string) => {
    setSchedules((prev) =>
      prev.map((sched, i) => {
        if (i !== index) return sched;
        const days = sched.days.includes(day)
          ? sched.days.filter((d) => d !== day)
          : [...sched.days, day];
        return { ...sched, days };
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.trainerId) {
      alert("Please select a trainer");
      return;
    }

    const submitData = new FormData();

    submitData.append("name", formData.name);
    submitData.append("details", formData.details);
    submitData.append("courseObjective", formData.courseObjective);

    submitData.append("outcomes", formData.outcomes);

    submitData.append("price", formData.price);
    submitData.append("courseFor", formData.courseFor);
    submitData.append("duration", formData.duration);
    submitData.append("classPerWeek", formData.classPerWeek);
    submitData.append("trainerId", formData.trainerId);
    submitData.append("courseLevel", formData.courseLevel);
    submitData.append("startDate", formData.startDate);
    submitData.append("endDate", formData.endDate);

    if (formData.discount) submitData.append("discount", formData.discount);
    if (formData.discountType)
      submitData.append("discountType", formData.discountType);
    if (formData.location) submitData.append("location", formData.location);

    submitData.append("schedules", JSON.stringify(schedules));

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 top-20 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200! px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Create New Course
            </h2>
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
            {/* Basic Info */}
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
                  label="Course Description"
                  placeholder="e.g., Puppies, Adult Dogs, All Breeds"
                  name="courseFor"
                  value={formData.courseFor}
                  onChange={handleInputChange}
                  required
                  className="md:col-span"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Price"
                placeholder="Price ( 100 )"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Discount"
                placeholder="Discount"
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
              />
              <div className="col-span-2">
                <DropdownButton
                  label="Discount Type"
                  options={[
                    { value: "", label: "None" },
                    { value: "PERCENTAGE", label: "Percentage (%)" },
                    { value: "FLAT", label: "Flat Amount" },
                  ]}
                  value={formData.discountType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, discountType: value }))
                  }
                  className="w-full col-span-2"
                />
              </div>
            </div>

            {/* Duration & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Duration (days)"
                type="number"
                placeholder="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Classes per Week"
                type="number"
                placeholder="eg 3, 5"
                name="classPerWeek"
                value={formData.classPerWeek}
                onChange={handleInputChange}
                required
              />
              <div className="col-span-2">
                <DropdownButton
                  label="Course Level"
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

            {/* Schedules */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-base font-medium text-foreground ">
                  Class Schedules
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className=""
                  icon={<Plus size={16} />}
                  text="Add Schedule"
                  onClick={addSchedule}
                />
              </div>

              {schedules.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 min-h-32 flex items-center justify-center">
                  <p className="text-gray-500">No schedules added yet</p>
                </div>
              )}

              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="absolute top-3 right-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {dayOptions.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(index, day)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                              schedule.days.includes(day)
                                ? "bg-rose-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Input
                      label="Time"
                      type="time"
                      value={schedule.time}
                      onChange={(e) =>
                        updateSchedule(index, "time", e.target.value)
                      }
                      required
                    />

                    <Input
                      label="Total Seats"
                      type="number"
                      value={schedule.totalSeats.toString()}
                      onChange={(e) =>
                        updateSchedule(
                          index,
                          "totalSeats",
                          Number(e.target.value),
                        )
                      }
                      min="1"
                      required
                    />
                  </div>
                </div>
              ))}
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
                // imageSize=""
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100!">
              <Button
                text={isSubmitting ? "Saving..." : "Create Course"}
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

export default CreateCourseModal;
