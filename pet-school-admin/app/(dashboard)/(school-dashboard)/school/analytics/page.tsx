"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import Image from "next/image";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <DashboardHeading
        title="Pet School Dashboard"
        description="Welcome back! Here's your training center overview"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
             <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">Total Revenue</p>
             <div className="bg-[#EBF5FF] p-1.5 rounded-lg flex items-center justify-center">
               <Image src="/assets/c5ab3523f66c0eabe93bf5591bfe28c7c943fc36.svg" alt="Revenue icon" width={20} height={20} className="w-5 h-5" />
             </div>
          </div>
          <h3 className="text-[30px] font-bold text-[#101828] font-['Arial:Bold'] -mt-1">$102K</h3>
          <p className="text-[12px] text-[#00a63e] font-['Arial:Regular']">↑ 18% from last month</p>
        </div>

        {/* Active Students */}
        <div className="bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between w-full">
             <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">Active Students</p>
             <div className="bg-[#fff1d6] p-1.5 rounded-lg flex items-center justify-center">
               <Image src="/assets/952d79cd17bb58097b69766cd5333f20bd5e8cf7.svg" alt="Students icon" width={20} height={20} className="w-5 h-5" />
             </div>
          </div>
          <h3 className="text-[30px] font-bold text-[#101828] font-['Arial:Bold'] -mt-1">324</h3>
          <p className="text-[12px] text-[#ff7176] font-['Arial:Regular']">↑ 14 new this month</p>
        </div>

        {/* Course Completion */}
        <div className="bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm flex flex-col gap-2">
           <div className="flex items-center justify-between w-full">
             <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">Course Completion</p>
             <div className="bg-[#e2fbd7] p-1.5 rounded-lg flex items-center justify-center">
               <Image src="/assets/cfd8f5aa57224213da94a11f20d6abeb8b9c2ca2.svg" alt="Completion icon" width={20} height={20} className="w-5 h-5" />
             </div>
          </div>
          <h3 className="text-[30px] font-bold text-[#101828] font-['Arial:Bold'] -mt-1">87%</h3>
          <p className="text-[12px] text-[#ff7176] font-['Arial:Regular']">↑ 3% improvement</p>
        </div>

        {/* Avg Attendance */}
        <div className="bg-white rounded-xl border border-[#f3f4f6] p-6 shadow-sm flex flex-col gap-2">
           <div className="flex items-center justify-between w-full">
             <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">Avg Attendance</p>
             <div className="bg-[#ffebee] p-1.5 rounded-lg flex items-center justify-center">
               <Image src="/assets/2edfcb8935c1ba1619a9eb2bc7cf4ab83c07fcde.svg" alt="Attendance icon" width={20} height={20} className="w-5 h-5" />
             </div>
          </div>
          <h3 className="text-[30px] font-bold text-[#101828] font-['Arial:Bold'] -mt-1">95%</h3>
          <p className="text-[12px] text-[#00a63e] font-['Arial:Regular']">Excellent participation</p>
        </div>
      </div>

      {/* Main Content Area - Charts */}
      {/* 
        Skipping exact SVG implementations of Recharts to use placeholders 
        for backend integration later, matching the design structure exactly 
      */}
      <div className="mt-8 bg-white border border-[#f3f4f6] rounded-[14px] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]">
        <h3 className="text-[#101828] font-['Arial:Bold'] text-[16px] mb-6">Enrollment & Revenue Trend</h3>
        
        {/* Placeholder for Recharts line chart */}
        <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg">
           <p className="text-gray-400 font-['Inter:Regular']">Enrollment & Revenue Trend Chart (Recharts)</p>
        </div>
        
        {/* Chart Legend */}
        <div className="flex justify-center gap-6 mt-4">
           <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#10b981] rounded-full"></div>
              <span className="text-[#10b981] text-[16px] font-['Arial:Regular']">Revenue ($)</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-[#ff7176] rounded-full"></div>
              <span className="text-[#ff7176] text-[16px] font-['Arial:Regular']">Students</span>
           </div>
        </div>
      </div>

      {/* Split Charts Area */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrollment Trend */}
        <div className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]">
           <h3 className="text-[#101828] font-['Arial:Bold'] text-[16px] mb-6">Student Enrollment Trend</h3>
           {/* Placeholder for Recharts bar chart */}
           <div className="h-[250px] w-full flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg">
             <p className="text-gray-400 font-['Inter:Regular']">Student Enrollment Bar Chart (Recharts)</p>
           </div>
        </div>

        {/* Course Distribution */}
        <div className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)]">
           <h3 className="text-[#101828] font-['Arial:Bold'] text-[16px] mb-6">Course Distribution</h3>
           {/* Placeholder for Recharts pie/donut chart */}
           <div className="h-[250px] w-full flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg">
             <p className="text-gray-400 font-['Inter:Regular']">Course Distribution Donut Chart (Recharts)</p>
           </div>
           <div className="flex justify-center gap-8 mt-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff7176] rounded-full"></div>
                  <span className="text-[#4a5565] text-[12px] font-['Arial:Regular']">Basic Obedience (35%)</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#6b7280] rounded-full"></div>
                  <span className="text-[#4a5565] text-[12px] font-['Arial:Regular']">Advanced (25%)</span>
               </div>
           </div>
        </div>
      </div>

    </div>
  );
}
