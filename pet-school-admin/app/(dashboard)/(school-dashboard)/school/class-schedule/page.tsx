"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { ChevronDown, Search, Eye, CheckCircle2, XCircle } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

// Mock data for the schedule
const scheduleData = [
  {
    id: 1,
    date: "wed 15",
    class: "Basic Pet Care",
    trainer: {
      name: "Emma Fox",
      avatar: "http://localhost:3845/assets/2f1190870d753151f58657595136f67c584b5c8c.png"
    },
    time: "9:00 AM - 10:00 AM",
    room: "Room A",
  },
  {
    id: 2,
    date: "wed 15",
    class: "Puppy Training 101",
    trainer: {
      name: "Emma Fox",
      avatar: "http://localhost:3845/assets/d2d5ab7bbd5619b9f30ff5cf5628f4c1ae8f8b9b.png"
    },
    time: "9:00 AM - 10:00 AM",
    room: "Room B",
  },
  {
    id: 3,
    date: "wed 15",
    class: "Cat Grooming Workshop",
    trainer: {
      name: "Emma Fox",
      avatar: "http://localhost:3845/assets/e2dea7440500e6d6fe2bcfcbb6c1348b1a281b65.png"
    },
    time: "9:00 AM - 10:00 AM",
    room: "Room C",
  },
  {
    id: 4,
    date: "wed 15",
    class: "First Aid for Pets",
    trainer: {
      name: "Emma Fox",
      avatar: "http://localhost:3845/assets/c5d4e24cbb3fe93ef64584e74c27eaaab7fdd0c7.png"
    },
    time: "9:00 AM - 10:00 AM",
    room: "Room D",
  },
  {
    id: 5,
    date: "wed 15",
    class: "First Aid for Pets",
    trainer: {
      name: "Emma Fox",
      avatar: "http://localhost:3845/assets/2f1190870d753151f58657595136f67c584b5c8c.png"
    },
    time: "9:00 AM - 10:00 AM",
    room: "Room D",
  },
  {
    id: 6,
    date: "wed 15",
    class: "First Aid for Pets",
    trainer: {
      name: "Emma Fox",
      avatar: "http://localhost:3845/assets/2f1190870d753151f58657595136f67c584b5c8c.png"
    },
    time: "9:00 AM - 10:00 AM",
    room: "Room D",
  },
];

export default function ClassSchedulePage() {
  const [dateRange, setDateRange] = useState({ start: "Apr 15", end: "Apr 21", year: "2025" });
  const [selectedTrainer, setSelectedTrainer] = useState("All Trainers");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeading 
        title="Class Schedule" 
        subtitle="Manage and view all upcoming pet care classes" 
      />

      {/* Filters Section */}
      <div className="flex flex-wrap gap-3 items-center w-full max-w-[1092px]">
        {/* Date Range Card */}
        <div className="bg-white border border-[#eee] rounded-[8px] p-[14px] px-[24px] flex flex-col gap-2 min-w-[280px]">
          <span className="text-[12px] font-['Inter:Regular'] text-black">Date Range</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-2.5 border border-[#eee] rounded-[4px] cursor-pointer">
              <span className="text-[12px] text-black">{dateRange.start}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <span className="text-[12px] text-black">To</span>
            <div className="flex items-center gap-2 px-2.5 py-2.5 border border-[#eee] rounded-[4px] cursor-pointer">
              <span className="text-[12px] text-black">{dateRange.end}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 px-2.5 py-2.5 border border-[#eee] rounded-[4px] cursor-pointer">
              <span className="text-[12px] text-black">{dateRange.year}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Trainers Filter Card */}
        <div className="bg-white border border-[#eee] rounded-[8px] p-[14px] px-[24px] flex flex-col gap-2 w-[191px]">
          <span className="text-[12px] font-['Inter:Regular'] text-black">Trainers</span>
          <div className="flex items-center justify-between px-2.5 py-2.5 border border-[#eee] rounded-[4px] cursor-pointer">
            <span className="text-[12px] text-black">{selectedTrainer}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Course Filter Card */}
        <div className="bg-white border border-[#eee] rounded-[8px] p-[14px] px-[24px] flex flex-col gap-2 w-[191px]">
          <span className="text-[12px] font-['Inter:Regular'] text-black">Course</span>
          <div className="flex items-center justify-between px-2.5 py-2.5 border border-[#eee] rounded-[4px] cursor-pointer">
            <span className="text-[12px] text-black">{selectedCourse}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white border border-[#eee] rounded-[8px] p-[14px] px-[24px] flex flex-col gap-2 flex-grow min-w-[300px]">
          <span className="text-[12px] font-['Inter:Regular'] text-black">Trainers</span>
          <div className="flex items-center gap-2">
            <div className="flex-grow flex items-center px-2.5 py-2.5 border border-[#eee] rounded-[4px]">
              <input 
                type="text" 
                placeholder="Search by class, trainer, or room"
                className="w-full bg-transparent outline-none text-[12px] text-black placeholder:text-[#bfbfbf]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-[#ff7176] text-white text-[12px] px-4 py-2.5 rounded-[4px] hover:bg-[#ff5c62] transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] shadow-sm w-full max-w-[1092px] overflow-hidden">
        <div className="p-6 pb-4 border-b border-[#e5e7eb]">
          <h2 className="text-[20px] font-['Arimo:Regular'] text-[#0a0a0a]">Recent KYC</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="px-6 py-3 text-[14px] font-bold text-[#4a5565] font-['Arimo:Bold'] whitespace-nowrap">Date</th>
                <th className="px-6 py-3 text-[14px] font-bold text-[#4a5565] font-['Arimo:Bold'] whitespace-nowrap">Class</th>
                <th className="px-6 py-3 text-[14px] font-bold text-[#4a5565] font-['Arimo:Bold'] whitespace-nowrap">Trainer</th>
                <th className="px-6 py-3 text-[14px] font-bold text-[#4a5565] font-['Arimo:Bold'] text-center whitespace-nowrap">Time</th>
                <th className="px-6 py-3 text-[14px] font-bold text-[#4a5565] font-['Arimo:Bold'] text-center whitespace-nowrap">Room</th>
                <th className="px-6 py-3 text-[14px] font-bold text-[#4a5565] font-['Arimo:Bold'] text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {scheduleData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-[14.5px] text-[16px] text-[#0a0a0a] font-['Arimo:Regular'] whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-[12px] text-black font-['Arimo:Regular'] min-w-[200px]">
                    {item.class}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                        <Image 
                          src={item.trainer.avatar} 
                          alt={item.trainer.name} 
                          width={40} 
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[14px] font-medium text-[#101828] font-['Inter:Medium'] whitespace-nowrap">
                        {item.trainer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-[14.5px] text-[16px] text-[#0a0a0a] font-['Arimo:Regular'] text-center whitespace-nowrap">
                    {item.time}
                  </td>
                  <td className="px-6 py-4 text-[12px] text-black font-['Arimo:Regular'] text-center whitespace-nowrap">
                    {item.room}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-[10px] transition-colors group">
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-[10px] transition-colors group">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-[10px] transition-colors group">
                        <XCircle className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
