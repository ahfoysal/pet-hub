"use client";

import { useState } from "react";
import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { Search, ChevronDown, Trash2, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import AdmissionDetailsModal from "@/components/dashboard/school/admissions/AdmissionDetailsModal";

export default function AdmissionsPage() {
  const [selectedAdmission, setSelectedAdmission] = useState<{
    id: number;
    initials: string;
    ownerName: string;
    petName: string;
    courseName: string;
    date: string;
    status: "Pending" | "Approved" | "Rejected";
    courseType: string;
    duration: string;
    price: string;
  } | null>(null);

  // Dummy list of applications
  const applications = [
    {
      id: 1,
      initials: "JS",
      ownerName: "John Smith",
      petName: "Max (Golden Retriever)",
      courseName: "Basic Obedience Training",
      date: "February 3, 2025",
      status: "Approved",
      courseType: "Obedience",
      duration: "8 weeks • 2 classes per week",
      price: "$299"
    },
    {
      id: 2,
      initials: "LA",
      ownerName: "Lisa Anderson",
      petName: "Bella (Labrador)",
      courseName: "Toilet Training for Puppies",
      date: "February 4, 2025",
      status: "Pending",
      courseType: "Toilet Training",
      duration: "8 weeks • 2 classes per week",
      price: "$199"
    },
    {
      id: 3,
      initials: "RB",
      ownerName: "Robert Brown",
      petName: "Charlie (Beagle)",
      courseName: "Advanced Social Skills",
      date: "February 4, 2025",
      status: "Pending",
      courseType: "Socialization",
      duration: "10 weeks • 1 class per week",
      price: "$349"
    },
    {
      id: 4,
      initials: "ED",
      ownerName: "Emily Davis",
      petName: "Luna (German Shepherd)",
      courseName: "Behavior Correction",
      date: "February 3, 2025",
      status: "Approved",
      courseType: "Behavior Modification",
      duration: "6 weeks • 2 classes per week",
      price: "$399"
    },
    {
      id: 5,
      initials: "MW",
      ownerName: "Michael Wilson",
      petName: "Rocky (Bulldog)",
      courseName: "Toilet Training for Puppies",
      date: "February 2, 2025",
      status: "Rejected",
      courseType: "Toilet Training",
      duration: "8 weeks • 2 classes per week",
      price: "$199"
    }
  ];

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeading
        title="Admissions Management"
        description="Review and manage course admission requests"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Pending Review */}
        <div className="bg-white rounded-[14px] border border-[#f3f4f6] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-[#fef9c2] p-2 rounded-[10px] w-9 h-9 flex items-center justify-center">
               <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">Pending Review</p>
          </div>
          <h3 className="text-[30px] font-bold text-[#101828] font-['Arial:Bold'] leading-[36px]">2</h3>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-[14px] border border-[#f3f4f6] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-[#dcfce7] p-2 rounded-[10px] w-9 h-9 flex items-center justify-center">
               <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">Approved</p>
          </div>
          <h3 className="text-[30px] font-bold text-[#101828] font-['Arial:Bold'] leading-[36px]">2</h3>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-[14px] border border-[#f3f4f6] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-[#ffe2e2] p-2 rounded-[10px] w-9 h-9 flex items-center justify-center">
               <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-[14px] text-[#4a5565] font-['Arial:Regular']">Rejected</p>
          </div>
          <h3 className="text-[30px] font-bold text-[#101828] font-['Arial:Bold'] leading-[36px]">1</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6 mt-6">
        <div className="flex-1 bg-white border border-[#d1d5dc] rounded-[10px] h-[42px] px-3 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by owner name, pet name..." 
            className="flex-1 bg-transparent border-none outline-none text-[#0a0a0a80] text-[16px] font-['Arial:Regular'] placeholder:text-[#0a0a0a80]"
          />
        </div>
        <button className="w-[160px] h-[42px] bg-white border border-[#d1d5dc] rounded-[10px] flex items-center justify-center gap-2 text-[#6a7282] text-[12px] font-['Arial:Regular']">
          All Status
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Table Area */}
      <div className="mt-6 bg-white rounded-[14px] border border-[#e6e6e6] overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-[#e6e6e6] py-2.5 flex items-center text-[#6a7282] text-[12px] font-['Arial:Regular'] tracking-[0.6px] uppercase px-5">
           <div className="w-[220px]">Name</div>
           <div className="w-[230px]">Pet</div>
           <div className="w-[230px]">Course</div>
           <div className="w-[200px]">Request Date</div>
           <div className="flex-1 text-center">Status</div>
           <div className="flex-1 text-center">ACTION</div>
        </div>

        {/* List of Applications */}
        {applications.map((app, index) => (
          <div 
            key={app.id}
            className={`cursor-pointer py-5 flex items-center px-5 hover:bg-gray-50 transition-colors ${
              index !== applications.length - 1 ? "border-b border-[#e6e6e6]" : ""
            }`}
            onClick={() => setSelectedAdmission(app)}
          >
            <div className="w-[220px] flex items-center gap-2.5 pr-2.5">
               <div className="w-12 h-12 rounded-full bg-[#ff7176] flex items-center justify-center text-white text-[16px] font-['Arial:Bold'] shrink-0">
                 {app.initials}
               </div>
               <span className="text-[#101828] text-[16px] font-['Arial:Bold']">{app.ownerName}</span>
            </div>
            <div className="w-[230px] pr-2.5 text-[#4a5565] text-[14px] font-['Arial:Regular']">
               {app.petName}
            </div>
            <div className="w-[230px] pr-2.5 text-[#101828] text-[16px] font-['Arial:Regular']">
               {app.courseName}
            </div>
            <div className="w-[200px] pr-2.5 text-[#101828] text-[16px] font-['Arial:Regular']">
               {app.date}
            </div>
            <div className="flex-1 flex justify-center">
               <span className={`text-[12px] font-['Arial:Regular'] px-2.5 py-1 rounded-full ${
                 app.status === 'Approved' ? 'bg-[#dcfce7] text-[#00a63e]' :
                 app.status === 'Rejected' ? 'bg-[#ffe2e3] text-[#c10007]' :
                 'bg-[#ffdecd] text-[#ff6900]'
               }`}>
                 {app.status}
               </span>
            </div>
            <div className="flex-1 flex justify-center">
               <div className="flex items-center gap-2">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedAdmission(app);
                   }}
                   className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                 >
                    <Eye className="w-[18px] h-[18px] text-gray-400" />
                 </button>
                 <button 
                   onClick={(e) => e.stopPropagation()}
                   className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                 >
                    <Trash2 className="w-[18px] h-[18px] text-gray-400" />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <AdmissionDetailsModal 
        isOpen={!!selectedAdmission}
        onClose={() => setSelectedAdmission(null)}
        admission={selectedAdmission}
      />
    </div>
  );
}
