"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { Plus, Edit3, Trash2, Tag, Clock, Users, DollarSign, Eye } from "lucide-react";
import React, { useState } from "react";
import AddNewCourseModal from "@/components/dashboard/school/courses/AddNewCourseModal";
import ViewCourseModal from "@/components/dashboard/school/courses/ViewCourseModal";

export default function CoursesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewModalCourse, setViewModalCourse] = useState<any>(null);

  const courses = [
    {
      id: 1,
      status: "ACTIVE",
      title: "Basic Obedience Training",
      description: "Fundamental commands and behavior training for all breeds",
      category: "Obedience",
      duration: "8 weeks • 2 classes per week",
      enrolled: 12,
      capacity: 15,
      price: "$299",
      enrollmentPercentage: 80,
    },
    {
      id: 2,
      status: "ACTIVE",
      title: "Toilet Training for Puppies",
      description: "Effective house training techniques for young dogs",
      category: "Hygiene",
      duration: "4 weeks • 3 classes per week",
      enrolled: 8,
      capacity: 10,
      price: "$199",
      enrollmentPercentage: 80,
    },
    {
      id: 3,
      status: "ACTIVE",
      title: "Advanced Social Skills",
      description: "Interaction training with other pets and humans",
      category: "Social Skills",
      duration: "6 weeks • 2 classes per week",
      enrolled: 10,
      capacity: 12,
      price: "$349",
      enrollmentPercentage: 83,
    },
    {
      id: 4,
      status: "ACTIVE",
      title: "Behavior Correction Program",
      description: "Addressing aggressive or anxious behavior patterns",
      category: "Behavior",
      duration: "10 weeks • 2 classes per week",
      enrolled: 6,
      capacity: 8,
      price: "$499",
      enrollmentPercentage: 75,
    },
    {
      id: 5,
      status: "DRAFT",
      title: "Agility Training Fundamentals",
      description: "Introduction to agility courses and obstacles",
      category: "Agility",
      duration: "6 weeks • 1 class per week",
      enrolled: 0,
      capacity: 10,
      price: "$249",
      enrollmentPercentage: 0,
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardHeading
          title="Course Management"
          description="Create and manage your training courses"
        />
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#ff7176] h-[48px] px-4 rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#ff5c62] transition-colors shrink-0"
        >
          <Plus className="w-5 h-5 text-white" />
          <span className="text-white text-[16px] font-['Arial:Regular']">Add New Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] flex flex-col gap-4">
            
            {/* Header: Status and Actions */}
            <div className="flex items-center justify-between w-full h-8">
              <div className={`px-3 py-1 rounded-full text-[12px] font-['Arial:Regular'] ${
                course.status === 'ACTIVE' ? 'bg-[#dcfce7] text-[#008236]' : 'bg-[#f3f4f6] text-[#364153]'
              }`}>
                {course.status}
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-gray-100 transition-colors">
                  <Edit3 className="w-[16px] h-[16px] text-[#4a5565]" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-red-50 transition-colors">
                  <Trash2 className="w-[16px] h-[16px] text-red-500" />
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1">
              <h3 className="text-[#101828] text-[16px] font-['Arial:Bold']">
                {course.title}
              </h3>
              <p className="text-[#4a5565] text-[14px] font-['Arial:Regular']">
                {course.description}
              </p>
            </div>

            {/* Meta tags */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 h-5">
                <Tag className="w-4 h-4 text-[#4a5565]" />
                <span className="text-[#4a5565] text-[14px] font-['Arial:Regular']">{course.category}</span>
              </div>
              <div className="flex items-center gap-2 h-5">
                <Clock className="w-4 h-4 text-[#4a5565]" />
                <span className="text-[#4a5565] text-[14px] font-['Arial:Regular']">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 h-5">
                <Users className="w-4 h-4 text-[#4a5565]" />
                <span className="text-[#4a5565] text-[14px] font-['Arial:Regular']">{course.enrolled} / {course.capacity} enrolled</span>
              </div>
              <div className="flex items-center gap-2 h-5">
                <DollarSign className="w-4 h-4 text-[#101828]" />
                <span className="text-[#101828] text-[14px] font-['Arial:Bold']">{course.price}</span>
              </div>
            </div>

            {/* Enrollment Progress */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[#4a5565] text-[12px] font-['Arial:Regular']">Enrollment</span>
                <span className="text-[#4a5565] text-[12px] font-['Arial:Regular']">{course.enrollmentPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-[#e5e7eb] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff7176] rounded-full" 
                  style={{ width: `${course.enrollmentPercentage}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            <button className="mt-2 w-full h-[36px] bg-[#f9fafb] rounded-[10px] flex items-center justify-center gap-2.5 hover:bg-gray-100 transition-colors">
              <Eye className="w-4 h-4 text-[#364153]" />
              <span className="text-[#364153] text-[16px] font-['Arial:Regular']">View Details</span>
            </button>

          </div>
        ))}
      </div>

      <AddNewCourseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
