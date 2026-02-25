/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetMyRoomsQuery } from "@/redux/features/api/dashboard/hotel/room/hotelRoomApi";
import {
  useGetHotelFacilitiesQuery,
  useCreateHotelFacilityMutation,
  useUpdateHotelFacilityMutation,
  useDeleteHotelFacilityMutation,
} from "@/redux/features/api/dashboard/hotel/services/hotelServiceApi";
import {
  Loader2,
  Plus,
  CheckCircle2,
  XCircle,
  Sparkles,
  Home,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import FacilityModal from "./FacilityModal";
import { toast } from "sonner";

export default function HotelServicesClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: roomData, isLoading: isRoomsLoading } = useGetMyRoomsQuery();
  const { data: facilityData, isLoading: isFacilitiesLoading } =
    useGetHotelFacilitiesQuery();
  const [createFacility] = useCreateHotelFacilityMutation();
  const [updateFacility] = useUpdateHotelFacilityMutation();
  const [deleteFacility] = useDeleteHotelFacilityMutation();

  const rooms = roomData?.data || [];
  const facilities = facilityData?.data || [];

  const handleOpenCreate = () => {
    setEditingFacility(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (facility: any) => {
    setEditingFacility(facility);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingFacility) {
        await updateFacility({
          id: editingFacility.id,
          data: formData,
        }).unwrap();
        toast.success("Service updated successfully!");
      } else {
        await createFacility(formData).unwrap();
        toast.success("Service created successfully!");
      }
      setIsModalOpen(false);
      setEditingFacility(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteFacility(id).unwrap();
      toast.success("Service deleted successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete service");
    }
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 font-nunito tracking-tight italic">
            Our Services
          </h1>
          <p className="text-gray-500 font-arimo mt-3 text-lg">
            Manage your hotel&apos;s accommodation and premium add-on services.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary transition-all active:scale-95 shadow-xl shadow-gray-200 uppercase tracking-widest text-xs"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-2">
        {["all", "accommodation", "premium add-ons"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-sm capitalize transition-all relative ${
              activeTab === tab
                ? "text-primary"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accommodation Section */}
        {(activeTab === "all" || activeTab === "accommodation") && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 font-nunito flex items-center gap-3">
              <Home className="w-6 h-6 text-primary" />
              Room Accommodations
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {isRoomsLoading ? (
                <div className="h-40 flex items-center justify-center bg-gray-50 rounded-4xl border border-dashed border-gray-200">
                  <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
                </div>
              ) : rooms.length === 0 ? (
                <div className="bg-gray-50 p-10 rounded-4xl text-center border border-dashed border-gray-200">
                  <p className="text-gray-400 font-arimo italic">
                    No rooms configured yet.
                  </p>
                </div>
              ) : (
                rooms.map((room: any) => (
                  <div
                    key={room.id}
                    className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                        {room.roomImages?.[0]?.url ? (
                          <img
                            src={room.roomImages[0].url}
                            alt={room.roomType}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Home className="w-6 h-6 opacity-30" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 font-nunito">
                          {room.roomType}
                        </h4>
                        <p className="text-xs text-gray-400 font-arimo mt-1">
                          Base Price:{" "}
                          <span className="text-primary font-bold">
                            ${room.basePrice}/night
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-green-500 font-bold text-xs uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {room.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Extra Services Section — now from API */}
        {(activeTab === "all" || activeTab === "premium add-ons") && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 font-nunito flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              Premium Add-ons
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {isFacilitiesLoading ? (
                <div className="h-40 flex items-center justify-center bg-gray-50 rounded-4xl border border-dashed border-gray-200">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-400 opacity-30" />
                </div>
              ) : facilities.length === 0 ? (
                <div className="bg-amber-50/50 p-10 rounded-4xl text-center border border-dashed border-amber-200">
                  <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-3" />
                  <p className="text-amber-600 font-arimo font-bold">
                    No premium services yet.
                  </p>
                  <p className="text-amber-400 text-sm font-arimo mt-1">
                    Click &quot;Add New Service&quot; to create one.
                  </p>
                </div>
              ) : (
                facilities.map((service: any) => (
                  <div
                    key={service.id}
                    className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-gray-900 font-nunito">
                            {service.name}
                          </h4>
                          <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg tracking-widest">
                            {service.facilityFor}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-arimo mt-1">
                          Starting from:{" "}
                          <span className="text-amber-600 font-bold">
                            ${service.price}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(service)}
                          className="text-[10px] font-bold text-gray-300 hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Featured Service Card */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-300 mt-12">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-black font-nunito italic tracking-tighter">
            Boost Your Revenue
          </h2>
          <p className="mt-4 text-gray-400 font-arimo text-lg leading-relaxed">
            Add premium services like specialized diet plans or 24/7 camera
            access to increase your nightly revenue by up to 25%.
          </p>
          <button className="mt-8 px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20">
            Learn More
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[url('/images/dashboard/hotel-illustration.png')] bg-cover bg-center pointer-events-none grayscale invert"></div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* Facility Modal */}
      <FacilityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFacility(null);
        }}
        onSubmit={handleSubmit}
        facility={editingFacility}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
