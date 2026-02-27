"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, rightElement }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] sm:text-[30px] font-medium text-[#101828] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[14px] sm:text-[16px] text-[#475467] font-normal">
            {subtitle}
          </p>
        )}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

interface TableContainerProps {
  title?: string;
  children: React.ReactNode;
  headerElement?: React.ReactNode;
}

export const TableContainer: React.FC<TableContainerProps> = ({ title, children, headerElement }) => {
  return (
    <div className="w-full bg-white rounded-[12px] border border-[#eaecf0] shadow-sm overflow-hidden mt-6">
      {(title || headerElement) && (
        <div className="px-6 py-5 border-b border-[#eaecf0] flex items-center justify-between">
          {title && (
            <h2 className="text-[18px] font-medium text-[#101828]">
              {title}
            </h2>
          )}
          {headerElement}
        </div>
      )}
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
};
