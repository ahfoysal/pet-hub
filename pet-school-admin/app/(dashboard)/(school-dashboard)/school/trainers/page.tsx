"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import { Plus, Mail, Phone, Eye, Edit3, Trash2, Users, BookOpen, Star, TrendingUp } from "lucide-react";
import React from "react";

// Mock data for trainers
const trainersData = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    rating: 4.9,
    status: "Active",
    email: "sarah.j@petschool.com",
    phone: "+1 (555) 123-4567",
    specializations: ["Obedience Training", "Behavior Modification"],
    activeClasses: 4,
    totalStudents: 48,
  },
  {
    id: 2,
    name: "Mike Chen",
    initials: "MC",
    rating: 4.8,
    status: "Active",
    email: "mike.c@petschool.com",
    phone: "+1 (555) 234-5678",
    specializations: ["Puppy Training", "Toilet Training"],
    activeClasses: 3,
    totalStudents: 32,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    initials: "ER",
    rating: 4.9,
    status: "Active",
    email: "emily.r@petschool.com",
    phone: "+1 (555) 345-6789",
    specializations: ["Social Skills", "Agility Training"],
    activeClasses: 3,
    totalStudents: 36,
  },
  {
    id: 4,
    name: "David Kim",
    initials: "DK",
    rating: 5,
    status: "Active",
    email: "david.k@petschool.com",
    phone: "+1 (555) 456-7890",
    specializations: ["Behavior Correction", "Anxiety Management"],
    activeClasses: 2,
    totalStudents: 18,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    initials: "LA",
    rating: 4.7,
    status: "Active",
    email: "lisa.a@petschool.com",
    phone: "+1 (555) 567-8901",
    specializations: ["Puppy Socialization", "Basic Obedience"],
    activeClasses: 2,
    totalStudents: 24,
  },
];

const statsData = [
  { label: "Total Trainers", value: "5", icon: Users, color: "bg-purple-50", iconColor: "text-purple-500" },
  { label: "Active Classes", value: "14", icon: BookOpen, color: "bg-blue-50", iconColor: "text-blue-500" },
  { label: "Total Students", value: "158", icon: TrendingUp, color: "bg-green-50", iconColor: "text-green-500" },
  { label: "Avg Rating", value: "4.9", icon: Star, color: "bg-yellow-50", iconColor: "text-yellow-500" },
];

export default function TrainersPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-start w-full max-w-[1092px]">
        <DashboardHeading 
          title="Trainer Management" 
          subtitle="Manage your training staff and their schedules" 
        />
        <button className="bg-[#ff7176] h-[48px] px-4 rounded-[10px] flex items-center justify-center gap-2 hover:bg-[#ff5c62] transition-colors shrink-0 mt-4">
          <Plus className="w-5 h-5 text-white" />
          <span className="text-white text-[16px] font-['Arial:Regular']">Add New Trainer</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[1092px]">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 flex justify-between items-center shadow-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] text-gray-500 font-['Arial:Regular']">{stat.label}</span>
              <span className="text-[24px] font-bold text-[#101828] font-['Arial:Bold']">{stat.value}</span>
            </div>
            <div className={`w-12 h-12 rounded-[10px] ${stat.color} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1092px]">
        {trainersData.map((trainer) => (
          <div key={trainer.id} className="bg-white border border-[#f3f4f6] rounded-[14px] p-6 shadow-sm flex flex-col gap-4">
            {/* Card Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#ff7176] flex items-center justify-center text-white font-bold text-[18px]">
                  {trainer.initials}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[18px] font-bold text-[#101828] font-['Arial:Bold']">{trainer.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500 mt-0.5">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-[14px] text-[#4a5565] font-['Arial:Regular']">{trainer.rating}</span>
                  </div>
                </div>
              </div>
              <span className="bg-[#dcfce7] text-[#008236] text-[12px] font-medium px-3 py-1 rounded-full">
                {trainer.status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="text-[14px] font-['Arial:Regular']">{trainer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Phone className="w-4 h-4" />
                <span className="text-[14px] font-['Arial:Regular']">{trainer.phone}</span>
              </div>
            </div>

            {/* Specializations */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider font-['Arial:Bold']">Specializations</span>
              <div className="flex flex-wrap gap-2">
                {trainer.specializations.map((spec, index) => (
                  <span key={index} className="bg-red-50 text-[#ff7176] text-[12px] px-3 py-1 rounded-[14px] border border-red-100">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50">
              <div className="flex flex-col">
                <span className="text-[12px] text-gray-400 font-['Arial:Regular']">Active Classes</span>
                <span className="text-[18px] font-bold text-[#101828]">{trainer.activeClasses}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-gray-400 font-['Arial:Regular']">Total Students</span>
                <span className="text-[18px] font-bold text-[#101828]">{trainer.totalStudents}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex-grow bg-[#f9fafb] h-[40px] rounded-[10px] flex items-center justify-center gap-2 text-[#364153] hover:bg-gray-100 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-[14px] font-['Arial:Regular']">View Details</span>
              </button>
              <button className="w-[40px] h-[40px] bg-[#f9fafb] rounded-[10px] flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="w-[40px] h-[40px] bg-[#fdf2f2] rounded-[10px] flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
