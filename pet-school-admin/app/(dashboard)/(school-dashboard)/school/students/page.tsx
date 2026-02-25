"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { Search, Filter, Eye } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

// Mock data for students
const studentsData = [
  {
    id: 1,
    owner: "John Smith",
    pet: "Max (Golden Retriever)",
    avatar: "JS",
    avatarBg: "bg-red-400",
    course: "Basic Obedience Training",
    admissionDate: "Jan 15, 2026",
    progress: 65,
    status: "active",
  },
  {
    id: 2,
    owner: "Lisa Anderson",
    pet: "Bella (Labrador)",
    avatar: "LA",
    avatarBg: "bg-red-400",
    course: "Toilet Training for Puppies",
    admissionDate: "Jan 20, 2026",
    progress: 80,
    status: "active",
  },
  {
    id: 3,
    owner: "Robert Brown",
    pet: "Charlie (Beagle)",
    avatar: "RB",
    avatarBg: "bg-red-400",
    course: "Advanced Social Skills",
    admissionDate: "Jan 10, 2026",
    progress: 45,
    status: "active",
  },
  {
    id: 4,
    owner: "Emily Davis",
    pet: "Luna (German Shepherd)",
    avatar: "ED",
    avatarBg: "bg-red-400",
    course: "Behavior Correction",
    admissionDate: "Dec 1, 2025",
    progress: 100,
    status: "completed",
  },
  {
    id: 5,
    owner: "Michael Wilson",
    pet: "Rocky (Bulldog)",
    avatar: "MW",
    avatarBg: "bg-red-400",
    course: "Toilet Training for Puppies",
    admissionDate: "Jan 25, 2026",
    progress: 30,
    status: "dropped",
  },
  {
    id: 6,
    owner: "Sarah Johnson",
    pet: "Daisy (Poodle)",
    avatar: "SJ",
    avatarBg: "bg-red-400",
    course: "Advanced Social Skills",
    admissionDate: "Jan 18, 2026",
    progress: 55,
    status: "active",
  },
];

const statusStyles = {
  active: "bg-[#dcfce7] text-[#008236]",
  completed: "bg-[#e0f2fe] text-[#0369a1]",
  dropped: "bg-[#fee2e2] text-[#b91c1c]",
};

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeading 
        title="Student Management" 
        subtitle="View and manage all enrolled students" 
      />

      {/* Filters Section */}
      <div className="flex items-center gap-3 w-full max-w-[1092px]">
        <div className="flex-grow relative h-[48px] bg-white border border-[#eee] rounded-[8px] flex items-center px-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by owner name, pet name, or course..."
            className="w-full bg-transparent outline-none ml-2 text-[14px] text-black placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="h-[48px] px-3 bg-white border border-[#eee] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>

        <div className="relative h-[48px] bg-white border border-[#eee] rounded-[8px] flex items-center px-4 min-w-[140px] cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-[14px] text-black flex-grow">{selectedStatus}</span>
          <Image src="http://localhost:3845/assets/e273770566b13820a09832d7bcd3245cbf10407f.svg" alt="chevron" width={14} height={14} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] shadow-sm w-full max-w-[1092px] overflow-hidden pt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="px-6 py-4 text-[12px] font-normal text-gray-500 uppercase tracking-wider">Owner / Pet</th>
                <th className="px-6 py-4 text-[12px] font-normal text-gray-500 uppercase tracking-wider">Course Enrolled</th>
                <th className="px-6 py-4 text-[12px] font-normal text-gray-500 uppercase tracking-wider">Admission Date</th>
                <th className="px-6 py-4 text-[12px] font-normal text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-[12px] font-normal text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[12px] font-normal text-gray-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {studentsData.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${student.avatarBg} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-[14px] font-bold">{student.avatar}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-[#101828]">{student.owner}</span>
                        <span className="text-[12px] text-gray-500">{student.pet}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[14px] text-black">
                    {student.course}
                  </td>
                  <td className="px-6 py-6 text-[14px] text-black font-['Arimo:Regular']">
                    {student.admissionDate}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#ff7176] transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-[12px] text-gray-500">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-[14px] text-[12px] font-medium ${statusStyles[student.status as keyof typeof statusStyles]}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center">
                      <button className="flex items-center gap-2 text-[#ff7176] hover:text-[#ff5c62] transition-colors group">
                        <Eye className="w-4 h-4" />
                        <span className="text-[14px]">View</span>
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
