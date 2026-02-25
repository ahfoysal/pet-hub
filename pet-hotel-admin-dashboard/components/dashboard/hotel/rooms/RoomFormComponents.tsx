"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, Check, Upload } from "lucide-react";

// Section Container with Title and Divider
export const FormSection = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <div className="space-y-4 py-4 border-b border-[#e5e7eb] last:border-0 font-arimo">
    <div>
      <h3 className="text-[16px] font-medium text-[#0a0a0a]">{title}</h3>
      {description && <p className="text-[12px] text-[#4a5565] mt-1">{description}</p>}
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Labeled Input with Figma Styles
export const FormInput = ({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[12px] font-normal text-[#0a0a0a]">
      {label} {required && <span className="text-[#ff7176]">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-[14px] py-[10px] border border-[#d1d5dc] rounded-[8px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 placeholder:text-[#0a0a0a]/30 ${props.className || ""}`}
    />
  </div>
);

// Labeled Textarea with Figma Styles
export const FormTextarea = ({ label, required, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; required?: boolean }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[12px] font-normal text-[#0a0a0a]">
      {label} {required && <span className="text-[#ff7176]">*</span>}
    </label>
    <textarea
      {...props}
      className={`w-full px-[14px] py-[10px] border border-[#d1d5dc] rounded-[8px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 placeholder:text-[#0a0a0a]/30 resize-none min-h-[100px] ${props.className || ""}`}
    />
  </div>
);

// Room Type Selector Card
export const RoomTypeCard = ({ label, description, selected, onClick }: { label: string; description: string; selected: boolean; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex-1 p-4 border rounded-[10px] cursor-pointer transition-all ${
      selected ? "border-[#ff7176] bg-[#fff5f5]" : "border-[#e5e7eb] hover:bg-gray-50"
    }`}
  >
    <h4 className="text-[14px] font-medium text-[#0a0a0a]">{label}</h4>
    <p className="text-[12px] text-[#4a5565] mt-1">{description}</p>
  </div>
);

// Amenity Selection Pill
export const AmenityCheckbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
  <label 
    className={`flex items-center gap-2 px-3 py-2 border rounded-[8px] cursor-pointer transition-all w-full sm:w-[calc(50%-8px)] ${
      checked ? "border-[#ff7176]/50 bg-white" : "border-[#e5e7eb] bg-white"
    }`}
  >
    <div 
      onClick={(e) => { e.preventDefault(); onChange(); }}
      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
        checked ? "bg-[#ff7176] border-[#ff7176]" : "bg-[#f2f4f8] border-[#d1d5dc]"
      }`}
    >
      {checked && <Check size={12} className="text-white" />}
    </div>
    <span className="text-[13px] text-[#4a5565]">{label}</span>
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
  </label>
);

// Image Uploader Placeholder (Matching Figma Area)
export const ImageArea = ({ onAdd }: { onAdd: () => void }) => (
  <div 
    onClick={onAdd}
    className="w-full h-[120px] border border-[#d1d5dc] rounded-[8px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 bg-white"
  >
    <div className="flex items-center gap-2 text-[#4a5565]">
      <Upload size={20} />
      <span className="text-[14px] font-medium">Add Image</span>
    </div>
  </div>
);
