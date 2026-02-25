import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, ChevronDown, Upload, Calendar, X, Trash2 } from "lucide-react";

/**
 * Shared Page Header Component
 */
export const PageHeader = ({ 
  title, 
  subtitle, 
  action 
}: { 
  title: string; 
  subtitle: string; 
  action?: React.ReactNode 
}) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-arimo">
    <div className="flex flex-col gap-[6.5px]">
      <h1 className="text-[24.3px] font-arimo font-normal text-[#0a0a0a] leading-tight">{title}</h1>
      <p className="text-[#4a5565] text-[13px] font-arimo leading-[19.5px]">{subtitle}</p>
    </div>
    {action && <div className="shrink-0 w-full md:w-auto">{action}</div>}
  </div>
);

/**
 * Shared Stat Card Component
 */
export interface StatCardProps {
  title: string;
  value: string | number;
  indicator?: string | number;
  indicatorColor?: string;
  trendIcon?: React.ReactNode;
  icon: string | React.ReactNode;
  iconBg: string;
  isPositive?: boolean;
}

export const StatCard = ({ title, value, indicator, indicatorColor, trendIcon, icon, iconBg, isPositive = true }: StatCardProps) => (
  <div className="bg-white border-[#e5e7eb] border-[0.77px] border-solid p-[20px] rounded-[11.375px] shadow-[0px_0.77px_1.55px_0px_rgba(0,0,0,0.1),0px_0.77px_2.38px_0px_rgba(0,0,0,0.1)] flex flex-col gap-[15px] transition-all hover:translate-y-[-2px] hover:shadow-md h-[144px] justify-between font-arimo">
    <div className="flex flex-col gap-[9.75px]">
      <div className="flex items-center gap-[9.75px]">
        <div className={`w-[32px] h-[32px] ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
          {typeof icon === "string" ? (
            <Image src={icon} alt={title} width={18} height={18} />
          ) : icon}
        </div>
        <p className="text-[#0a0a0a] text-[14px] font-arimo leading-none opacity-90">{title}</p>
      </div>
      <p className="text-[#4a5565] text-[30px] font-arimo font-normal leading-tight">{value}</p>
    </div>
    {(indicator !== undefined) && (
      <div className="flex items-center gap-1 opacity-75">
        {trendIcon}
        <span className={`${indicatorColor || (isPositive ? "text-[#008236]" : "text-red-600")} text-[14px] font-arimo whitespace-nowrap`}>{indicator}</span>
      </div>
    )}
  </div>
);

/**
 * Unified Status Badge Component
 */
export const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toUpperCase();
  const isCompleted = s === "DELIVERED" || s === "SUCCESS" || s === "COMPLETED" || s === "ACTIVE" || s === "PUBLISHED";
  const isWarning = s === "PENDING" || s === "UPCOMING" || s === "PROCESSING";
  const isDanger = s === "CANCELLED" || s === "FAILED" || s === "OUT_OF_STOCK" || s === "INACTIVE";

  let bg = "bg-[#ff7176]/10 text-[#ff7176]";
  let dot = "bg-[#ff7176]";

  if (isCompleted) {
    bg = "bg-[#ecfdf3] text-[#027a48]";
    dot = "bg-[#027a48]";
  } else if (isWarning) {
    bg = "bg-amber-50 text-amber-700";
    dot = "bg-amber-500";
  } else if (isDanger) {
    bg = "bg-red-50 text-red-700";
    dot = "bg-red-500";
  }

  return (
    <div className={`flex items-center gap-[6px] px-[8px] py-[2px] rounded-[16px] w-fit ${bg}`}>
      <div className={`w-[8px] h-[8px] rounded-full ${dot}`} />
      <span className="text-[12px] font-medium font-inter">{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</span>
    </div>
  );
};

/**
 * Shared Chart Card Container
 */
export const ChartCard = ({ 
  title, 
  children, 
  legend,
  minHeight = "min-h-[350px]"
}: { 
  title: string; 
  children: React.ReactNode; 
  legend?: React.ReactNode;
  minHeight?: string;
}) => (
  <div className={`bg-white border-[#e5e7eb] border-[0.775px] border-solid rounded-[10.8px] p-6 shadow-[0px_0.775px_2.325px_0px_rgba(0,0,0,0.1)] font-arimo flex flex-col ${minHeight} transition-all hover:shadow-md`}>
    <div className="mb-6">
      <h2 className="text-[#0a0a0a] text-[16px] font-normal font-arimo">{title}</h2>
    </div>
    <div className="flex-1 w-full min-h-[240px]">
      {children}
    </div>
    {legend && <div className="mt-4">{legend}</div>}
  </div>
);

/**
 * Shared Table Section Component
 */
export const TableContainer = ({ 
  title, 
  children, 
  action, 
  footer,
  badge
}: { 
  title: string; 
  children: React.ReactNode; 
  action?: React.ReactNode;
  footer?: React.ReactNode;
  badge?: string | number;
}) => (
  <div className="bg-white border border-[#eaecf0] rounded-[8px] shadow-[0px_0.775px_2.325px_0px_rgba(0,0,0,0.1)] overflow-hidden font-arimo transition-all hover:shadow-md">
    <div className="px-[24px] py-[20px] border-b border-[#eaecf0] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
      <div className="flex items-center gap-2">
        <h2 className="text-[18px] font-medium text-[#101828] font-arimo leading-[28px]">{title}</h2>
        {badge !== undefined && (
          <div className="bg-[#f9f5ff] px-[10px] py-[4px] rounded-[16px]">
            <span className="text-[#ff7176] text-[10px] font-Montserrat font-medium leading-none">{badge}</span>
          </div>
        )}
      </div>
      {action}
    </div>
    <div className="overflow-x-auto">
      {children}
    </div>
    {footer && <div className="px-6 py-4 border-t border-[#eaecf0] bg-white">{footer}</div>}
  </div>
);

/**
 * Shared Pagination Component
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between w-full py-3 px-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center gap-2 px-[14px] py-[8px] border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer font-inter shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
      >
        <ChevronLeft size={20} className="text-[#344054]" />
        <span>Previous</span>
      </button>

      <div className="hidden md:flex items-center gap-0.5">
        {getPageNumbers().map((num, i) => (
          <button
            key={i}
            onClick={() => typeof num === 'number' && onPageChange(num)}
            disabled={num === '...'}
            className={`w-10 h-10 flex items-center justify-center rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer
              ${currentPage === num 
                ? 'bg-[#f9f5ff] text-[#7f56d9]' 
                : 'text-[#667085] hover:bg-gray-50'
              } ${num === '...' ? 'cursor-default' : ''}`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center gap-2 px-[14px] py-[8px] border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer font-inter shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
      >
        <span>Next</span>
        <ChevronRight size={20} className="text-[#344054]" />
      </button>
    </div>
  );
};

/**
 * Shared Search Bar Component
 */
export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search..." 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
}) => (
  <div className="bg-white border-[#e5e7eb] border-[0.775px] border-solid rounded-[10.8px] p-[13px] shadow-[0px_0.775px_2.325px_0px_rgba(0,0,0,0.1)]">
    <div className="relative flex items-center">
      <div className="absolute left-[12px] pointer-events-none">
        <Search size={18} className="text-[#667085]" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-[38px] pr-3 py-[6px] border border-[#d1d5dc] rounded-[7.7px] text-[12.4px] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 text-[#0a0a0a] placeholder:text-[#0a0a0a]/50 bg-white font-arimo font-normal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

/**
 * Common Button Style
 */
export const ActionButton = ({ 
  children, 
  onClick, 
  icon,
  className = "",
  disabled = false
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`bg-[#ff7176] text-white px-6 py-[10px] rounded-[10px] flex items-center justify-center gap-2 shadow-md hover:bg-[#ff7176]/90 transition-all font-arimo font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {icon}
    <span className="text-[16px]">{children}</span>
  </button>
);

/**
 * Labeled Form Group
 */
export const FormGroup = ({ 
  label, 
  required, 
  children, 
  sublabel,
  className = ""
}: { 
  label: string; 
  required?: boolean; 
  children: React.ReactNode; 
  sublabel?: string;
  className?: string;
}) => (
  <div className={`flex flex-col gap-[8px] w-full font-arimo ${className}`}>
    <div className="flex items-center gap-1">
      <label className="text-[14px] font-normal text-[#0a0a0a]">{label}</label>
      {required && <span className="text-[#fb2c36] text-[14px]">*</span>}
    </div>
    {children}
    {sublabel && <p className="text-[12px] text-[#6a7282] mt-[1px]">{sublabel}</p>}
  </div>
);

/**
 * Premium Text Input
 */
export const TextInput = ({ 
  placeholder, 
  value, 
  onChange, 
  type = "text",
  prefix,
  suffix,
  name
}: { 
  placeholder?: string; 
  value: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  name?: string;
}) => (
  <div className="flex items-center border border-[#d1d5dc] rounded-[10px] px-[16px] py-[8px] focus-within:ring-2 focus-within:ring-[#ff7176]/20 focus-within:border-[#ff7176] transition-all bg-white font-arimo">
    {prefix && <span className="mr-2 text-[#6a7282]">{prefix}</span>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full outline-none text-[16px] text-[#0a0a0a] placeholder:text-[#0a0a0a]/50"
    />
    {suffix && <span className="ml-2">{suffix}</span>}
  </div>
);

/**
 * Premium Text Area
 */
export const TextArea = ({ 
  placeholder, 
  value, 
  onChange, 
  rows = 4,
  name
}: { 
  placeholder?: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  name?: string;
}) => (
  <textarea
    rows={rows}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full border border-[#d1d5dc] rounded-[10px] px-[16px] py-[8px] outline-none text-[16px] text-[#0a0a0a] placeholder:text-[#0a0a0a]/50 focus:ring-2 focus:ring-[#ff7176]/20 focus:border-[#ff7176] transition-all font-arimo resize-none"
  />
);

/**
 * Custom FIGMA DROPDOWN
 */
export const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select",
  multi = false
}: { 
  options: { label: string; value: string }[]; 
  value: any; 
  onChange: (val: any) => void;
  placeholder?: string;
  multi?: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (val: string) => {
    if (multi && Array.isArray(value)) return value.includes(val);
    return value === val;
  };

  const handleSelect = (val: string) => {
    if (multi && Array.isArray(value)) {
      const newValue = value.includes(val) 
        ? value.filter(v => v !== val) 
        : [...value, val];
      onChange(newValue);
    } else {
      onChange(val);
      setIsOpen(false);
    }
  };

  const selectedLabel = React.useMemo(() => {
    if (multi && Array.isArray(value)) {
      return value.length > 0 ? `${value.length} Selected` : placeholder;
    }
    const option = options.find(o => o.value === value);
    return option ? option.label : placeholder;
  }, [value, options, placeholder, multi]);

  return (
    <div className="relative w-full font-arimo" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-[#c0c0c0] rounded-[10px] px-[16px] py-[8px] bg-[#fdfdfd] hover:bg-gray-50 transition-colors"
      >
        <span className={`text-[14px] ${value ? 'text-[#0a0a0a]' : 'text-[#0a0a0a]/50'}`}>
          {selectedLabel}
        </span>
        <ChevronDown size={20} className={`text-[#0a0a0a] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-[#c0c0c0] rounded-[10px] shadow-lg overflow-hidden max-h-[250px] overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`px-[16px] py-[10px] text-[14px] cursor-pointer transition-colors flex items-center justify-between
                ${isSelected(opt.value) ? 'bg-[#ff7176]/10 text-[#ff7176]' : 'text-[#0a0a0a] hover:bg-gray-50'}`}
            >
              <span>{opt.label}</span>
              {isSelected(opt.value) && multi && (
                <div className="w-2 h-2 rounded-full bg-[#ff7176]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Form Chip Collection component (ChipInput)
 */
export const ChipInput = ({ 
  chips, 
  onAdd, 
  onRemove, 
  placeholder 
}: { 
  chips: string[]; 
  onAdd: (val: string) => void; 
  onRemove: (index: number) => void;
  placeholder?: string;
}) => {
  const [input, setInput] = useState("");
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, idx) => (
          <div key={idx} className="flex items-center gap-[8px] px-[8px] py-[2px] bg-white rounded-[4px] border border-[#d1d5dc] shadow-sm animate-in zoom-in duration-200">
            <span className="text-[14px] text-[#0a0a0a] font-normal">{chip}</span>
            <button type="button" onClick={() => onRemove(idx)} className="hover:text-red-600 transition-colors">
              <X size={14} className="text-[#6a7282]" />
            </button>
          </div>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full border border-[#d1d5dc] rounded-[10px] px-[16px] py-[8px] outline-none text-[16px] text-[#0a0a0a] placeholder:text-[#0a0a0a]/50 focus:ring-2 focus:ring-[#ff7176]/20 focus:border-[#ff7176] transition-all font-arimo"
        />
        <button 
          onClick={() => { if(input.trim()) { onAdd(input.trim()); setInput(""); } }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ff7176] text-[14px] font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );
};

/**
 * Enhanced Image Upload Area with Previews
 */
export const ImageUploadArea = ({ 
  onUpload, 
  imagePreviews = [], 
  onRemoveImage,
  multiple = false,
  sublabel 
}: { 
  onUpload: (files: FileList | null) => void; 
  imagePreviews?: string[];
  onRemoveImage?: (index: number) => void;
  multiple?: boolean;
  sublabel?: string;
}) => (
  <div className="space-y-4 font-arimo">
    <div className="flex flex-wrap gap-4">
      {imagePreviews.map((preview, idx) => (
        <div key={idx} className="relative w-[197.5px] h-[128px] rounded-[10px] overflow-hidden border border-[#d1d5dc] group">
          <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
          {onRemoveImage && (
            <button 
              onClick={() => onRemoveImage(idx)}
              className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
      <label className="w-[197.5px] h-[128px] border-2 border-dashed border-[#d1d5dc] rounded-[10px] flex flex-col items-center justify-center gap-[8px] cursor-pointer hover:border-[#ff7176] transition-colors group bg-[#fdfdfd]">
        <Upload size={24} className="text-[#4a5565] group-hover:text-[#ff7176] transition-colors" />
        <span className="text-[14px] text-[#4a5565] font-normal">Add Image</span>
        <input 
          type="file" 
          multiple={multiple}
          className="hidden" 
          onChange={(e) => onUpload(e.target.files)}
          accept="image/*"
        />
      </label>
    </div>
    {sublabel && <p className="text-[12px] text-[#6a7282] whitespace-pre-wrap">{sublabel}</p>}
  </div>
);
