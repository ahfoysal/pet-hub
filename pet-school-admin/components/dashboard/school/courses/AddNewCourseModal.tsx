import React, { useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";

interface AddNewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNewCourseModal({
  isOpen,
  onClose,
}: AddNewCourseModalProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#c4c4c4] bg-opacity-80 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border border-[#f3f4f6] rounded-[14px] shadow-xl w-full max-w-[896px] max-h-[90vh] flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-[30px] pb-0 shrink-0">
          <h2 className="text-[24px] font-['Arial:Bold'] font-bold text-[#101828] leading-[32px]">
            Add New Course
          </h2>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-[30px] overflow-y-auto flex-1 custom-scrollbar">
          <form className="flex flex-col gap-6">
            
            {/* Course Title */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Course Title *</label>
              <input 
                type="text" 
                placeholder="e.g., Basic Obedience Training"
                className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] placeholder:text-[#0a0a0a80] focus:border-[#ff7176] transition-colors"
              />
            </div>

            {/* Course Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Course Description *</label>
              <textarea 
                placeholder="Describe what this course covers..."
                className="w-full h-[90px] p-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] placeholder:text-[#0a0a0a80] resize-none focus:border-[#ff7176] transition-colors"
                style={{ lineHeight: "24px" }}
              />
            </div>

            {/* 2 Column Row: Training Type, Course Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Training Type *</label>
                <div className="relative w-full h-[42px]">
                  <select className="w-full h-full px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] appearance-none focus:border-[#ff7176] transition-colors">
                    <option value="" disabled selected className="text-[#0a0a0a80]">Select type</option>
                    <option value="obedience">Obedience</option>
                    <option value="hygiene">Hygiene</option>
                    <option value="social">Social Skills</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Course Duration *</label>
                <input 
                  type="text" 
                  placeholder="e.g., 6 weeks"
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] placeholder:text-[#0a0a0a80] focus:border-[#ff7176] transition-colors"
                />
              </div>
            </div>

            {/* 2 Column Row: Weekly Class Freq, Total Classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Weekly Class Frequency *</label>
                <input 
                  type="text" 
                  placeholder="e.g., 2 classes per week"
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] placeholder:text-[#0a0a0a80] focus:border-[#ff7176] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Total Number of Classes *</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] placeholder:text-[#0a0a0a80] focus:border-[#ff7176] transition-colors [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Class Time */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Class Time *</label>
              <input 
                type="text" 
                placeholder="e.g., 10:00 AM - 11:30 AM"
                className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] placeholder:text-[#0a0a0a80] focus:border-[#ff7176] transition-colors"
              />
            </div>

            {/* 2 Column Row: Price, Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Price ($) *</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] placeholder:text-[#0a0a0a80] focus:border-[#ff7176] transition-colors [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Maximum Student Capacity *</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full h-[42px] px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] placeholder:text-[#0a0a0a80] focus:border-[#ff7176] transition-colors [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Course Status */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-[#364153] font-['Arial:Regular']">Course Status *</label>
              <div className="relative w-full h-[42px]">
                <select className="w-full h-full px-4 rounded-[10px] border border-[#d1d5dc] bg-white outline-none text-[16px] text-[#0a0a0a] font-['Arial:Regular'] appearance-none focus:border-[#ff7176] transition-colors">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Example Box */}
            <div className="w-full bg-[#eff6ff] border border-[#bedbff] rounded-[10px] p-4 flex items-center h-[54px] shrink-0">
               <p className="text-[14px] text-[#193cb8] font-['Arial:Bold']">
                 <span className="font-bold">Example: </span>
                 <span className="font-['Arial:Regular'] font-normal">Toilet Training for Pets — 2 classes per week</span>
               </p>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-[30px] pt-[24px] flex gap-4 shrink-0 bg-white">
          <button 
            className="flex-[3] h-[48px] bg-[#ff7176] text-white text-[16px] font-['Arial:Regular'] rounded-[10px] hover:bg-[#ff5c62] transition-colors flex items-center justify-center"
          >
            Create Course
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="flex-[1] min-w-[96px] h-[48px] bg-[#f3f4f6] text-[#364153] text-[16px] font-['Arial:Regular'] rounded-[10px] hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
