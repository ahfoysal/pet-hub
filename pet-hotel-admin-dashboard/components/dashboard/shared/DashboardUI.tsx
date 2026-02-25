"use client";

import React from "react";
import Image from "next/image";

/**
 * Shared Page Header Component
 * Used for titles, subtitles, and primary page-level actions.
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
 * Displays a single metric with icon and trend indicator.
 * Matches Figma Design precisely.
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
  <div className="bg-white border-[#e5e7eb] border-[0.775px] border-solid p-[20px] rounded-[10.848px] shadow-[0px_0.775px_2.325px_0px_rgba(0,0,0,0.1),0px_0.775px_1.55px_0px_rgba(0,0,0,0.1)] flex flex-col gap-[12.4px] transition-all hover:translate-y-[-2px] hover:shadow-md h-auto font-arimo">
    <div className="flex items-start justify-between">
      <div className={`w-[37.2px] h-[37.2px] rounded-[7.7px] flex items-center justify-center ${iconBg}`}>
        <div className="w-[18.6px] h-[18.6px] flex items-center justify-center">
          {typeof icon === "string" ? (
            <Image src={icon} alt={title} width={18.6} height={18.6} />
          ) : icon}
        </div>
      </div>
      {(indicator !== undefined) && (
        <div className={`${isPositive ? 'bg-[#f0fdf4]' : 'bg-red-50'} px-[8px] py-[2px] rounded-full flex items-center gap-1 border ${isPositive ? 'border-green-50' : 'border-red-50'}`}>
          {trendIcon}
          <span className={`${indicatorColor || (isPositive ? "text-[#008236]" : "text-red-600")} text-[9.3px] font-arimo font-medium`}>{indicator}</span>
        </div>
      )}
    </div>
    <div className="flex flex-col">
      <p className="text-[#4a5565] text-[14px] font-arimo leading-none">{title}</p>
      <p className="text-[#0a0a0a] text-[23.2px] font-arimo font-normal mt-[4px]">{value}</p>
    </div>
  </div>
);

/**
 * Unified Status Badge Component
 */
export const StatusBadge = ({ status, type = "default" }: { status: string; type?: "default" | "success" | "warning" | "danger" | "info" }) => {
  const isCompleted = status.toUpperCase() === "DELIVERED" || status.toUpperCase() === "SUCCESS" || status.toUpperCase() === "COMPLETED" || status.toUpperCase() === "ACTIVE";
  const isWarning = status.toUpperCase() === "PENDING" || status.toUpperCase() === "UPCOMING";
  const isDanger = status.toUpperCase() === "CANCELLED" || status.toUpperCase() === "FAILED";

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
  footer 
}: { 
  title: string; 
  children: React.ReactNode; 
  action?: React.ReactNode;
  footer?: React.ReactNode;
}) => (
  <div className="bg-white border border-[#eaecf0] rounded-[8px] shadow-[0px_0.775px_2.325px_0px_rgba(0,0,0,0.1)] overflow-hidden font-arimo transition-all hover:shadow-md">
    <div className="px-[24px] py-[20px] border-b border-[#eaecf0] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
      <h2 className="text-[18px] font-medium text-[#101828] font-arimo leading-[28px]">{title}</h2>
      {action}
    </div>
    <div className="overflow-x-auto">
      {children}
    </div>
    {footer && <div className="px-6 py-4 border-t border-[#eaecf0] bg-white">{footer}</div>}
  </div>
);

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
      <div className="absolute left-[9px] pointer-events-none">
        <Image src="/assets/search-gray.svg" alt="Search" width={15.5} height={15.5} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-[31px] pr-3 py-[6px] border border-[#d1d5dc] rounded-[7.7px] text-[12.4px] focus:outline-none focus:ring-1 focus:ring-[#ff7176]/50 text-[#0a0a0a] placeholder:text-[#0a0a0a]/50 bg-white font-arimo font-normal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

/**
 * Common Button Style for Dashboard Pages
 */
export const ActionButton = ({ 
  children, 
  onClick, 
  icon 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  icon?: string;
}) => (
  <button 
    onClick={onClick}
    className="bg-[#ff7176] text-white px-6 py-[10px] rounded-[10px] flex items-center justify-center gap-2 shadow-md hover:bg-[#ff7176]/90 transition-all font-arimo font-medium cursor-pointer"
  >
    {icon && <Image src={icon} alt="Icon" width={20} height={20} />}
    <span className="text-[16px]">{children}</span>
  </button>
);
