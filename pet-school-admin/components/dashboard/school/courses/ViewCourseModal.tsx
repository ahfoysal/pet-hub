import React, { useEffect } from "react";
import { X, Clock, Check } from "lucide-react";

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
}

export default function ViewCourseModal({
  isOpen,
  onClose,
  course,
}: ViewCourseModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#c4c4c4] bg-opacity-80 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border border-[#f3f4f6] rounded-[14px] shadow-xl w-full max-w-[896px] max-h-[90vh] flex flex-col z-10 overflow-hidden">
        
        {/* Header - Sticky */}
        <div className="p-[30px] pb-6 shrink-0 relative flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h2 className="text-[24px] font-['Arial:Bold'] font-bold text-[#101828] leading-[32px]">
                {course.title}
              </h2>
              {course.status === "ACTIVE" ? (
                <span className="bg-[#dcfce7] text-[#008236] text-[12px] font-['Arial:Regular'] px-3 py-1 rounded-full">
                  ACTIVE
                </span>
              ) : (
                <span className="bg-[#f3f4f6] text-[#364153] text-[12px] font-['Arial:Regular'] px-3 py-1 rounded-full">
                  DRAFT
                </span>
              )}
            </div>
            <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">
              <span className="font-['Arial:Bold'] font-bold text-[#101828]">Course Objective: </span>
              {course.category}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="px-[30px] pb-[30px] overflow-y-auto flex-1 custom-scrollbar">
          <form className="flex flex-col gap-6">
            
            {/* Course Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Course Description</label>
              <textarea 
                readOnly
                value={course.description}
                className="w-full h-[90px] p-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] resize-none focus:border-[#ff7176] transition-colors"
                style={{ lineHeight: "24px" }}
              />
            </div>

            {/* 2 Column Row: Course Duration, Total Number of Classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Course Duration *</label>
                <input 
                  type="text" 
                  readOnly
                  value={course.duration.split(' • ')[0]}
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] focus:border-[#ff7176] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Total Number of Classes *</label>
                <input 
                  type="text" 
                  readOnly
                  value={`${course.enrolled} / ${course.capacity}`}
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] focus:border-[#ff7176] transition-colors"
                />
              </div>
            </div>

            {/* Available Schedules */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Available Schedules</label>
              <div className="flex flex-col gap-3">
                <div className="w-full h-[48px] bg-[#f9fafb] rounded-[10px] flex items-center px-4 gap-3">
                   <Clock className="w-5 h-5 text-[#4a5565]" />
                   <span className="text-[#364153] text-[16px] font-['Arial:Regular']">Mon-Fri 9AM</span>
                </div>
                <div className="w-full h-[48px] bg-[#f9fafb] rounded-[10px] flex items-center px-4 gap-3">
                   <Clock className="w-5 h-5 text-[#4a5565]" />
                   <span className="text-[#364153] text-[16px] font-['Arial:Regular']">Sat-Sun 10AM</span>
                </div>
              </div>
            </div>

            {/* 2 Column Row: Price, Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Price ($) *</label>
                <input 
                  type="text" 
                  readOnly
                  value={course.price.replace('$', '')}
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] focus:border-[#ff7176] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Maximum Student Capacity *</label>
                <input 
                  type="text" 
                  readOnly
                  value={course.capacity}
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] focus:border-[#ff7176] transition-colors"
                />
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="flex flex-col gap-3 pt-2">
              <label className="text-[14px] text-[#364153] font-['Arial:Regular']">What You'll Learn</label>
              <div className="flex flex-col gap-3">
                {[
                  "Professional training techniques",
                  "Positive reinforcement methods",
                  "Understanding pet behavior and psychology",
                  "Hands-on practice with guidance",
                  "Certificate of completion"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#008236]" />
                    <span className="text-[#4a5565] text-[14px] font-['Arial:Regular']">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
