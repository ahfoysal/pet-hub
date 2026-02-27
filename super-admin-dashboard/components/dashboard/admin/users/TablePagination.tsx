// Figma Node: 11722:3977 — Pagination Component
// Architectural Intent: Reusable page-based pagination matching Figma design with Previous/Next buttons and numbered page pills

"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export default function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 20,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first 3, last 3, and current page with ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const showingFrom = (currentPage - 1) * itemsPerPage + 1;
  const showingTo = totalItems
    ? Math.min(currentPage * itemsPerPage, totalItems)
    : currentPage * itemsPerPage;

  return (
    <div className="border-t border-[#eaecf0] flex items-center justify-between px-6 py-3 bg-white">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#d0d5dd] bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[14px] font-medium font-['Inter',sans-serif] transition-colors ${
          currentPage === 1
            ? "text-[#d0d5dd] cursor-not-allowed"
            : "text-[#344054] hover:bg-[#f9fafb] cursor-pointer"
        }`}
      >
        <ChevronLeft size={20} />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-0.5">
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <div
              key={`ellipsis-${idx}`}
              className="w-10 h-10 flex items-center justify-center rounded-lg"
            >
              <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#667085]">
                ...
              </span>
            </div>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-medium font-['Inter',sans-serif] transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-[#f9f5ff] text-[#7f56d9]"
                  : "text-[#667085] hover:bg-[#f9fafb]"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#d0d5dd] bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[14px] font-medium font-['Inter',sans-serif] transition-colors ${
          currentPage === totalPages
            ? "text-[#d0d5dd] cursor-not-allowed"
            : "text-[#344054] hover:bg-[#f9fafb] cursor-pointer"
        }`}
      >
        Next
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
