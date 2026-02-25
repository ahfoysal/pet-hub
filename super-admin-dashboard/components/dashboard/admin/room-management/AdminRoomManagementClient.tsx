"use client";

import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Home,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { useGetAllRoomsQuery } from "../../../../redux/features/api/dashboard/admin/room/adminRoomApi";
import RoomDetailsModal from "./RoomDetailsModal";

export default function AdminRoomManagementClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: roomData,
    isLoading,
    isFetching,
  } = useGetAllRoomsQuery({
    page,
    limit,
  });

  const rooms = roomData?.data?.items || [];
  const meta = roomData?.data?.meta || { totalItems: 0, totalPages: 1 };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[24px] font-arimo text-[#0a0a0a] leading-[27.92px]">
            Room Management
          </h1>
          <p className="text-[12.41px] text-[#4a5565] font-arimo mt-2 leading-[18.61px]">
            View and monitor rooms across the platform.
          </p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-[10.86px] border border-[#e5e7eb] shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#d1d5dc] rounded-[7.76px] focus:outline-none text-[12.41px] text-[#0a0a0a]/50 font-arimo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#eaecf0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#eaecf0] flex justify-between items-center">
          <h3 className="text-[18px] font-medium text-[#101828] leading-[28px]">
            All Rooms
          </h3>
          {(isLoading || isFetching) && (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <tr>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Pet Capacity
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Price / Night
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-[12px] font-medium text-[#667085] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#ff7176]" />
                    </div>
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-400 font-medium"
                  >
                    No rooms found.
                  </td>
                </tr>
              ) : (
                rooms.map((room: any) => (
                  <tr
                    key={room.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Home className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-[#101828] leading-[20px]">
                          {room.title || "Untitled Room"}
                        </p>
                        <p className="text-[14px] text-[#667085] leading-[20px]">
                          {room.id.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#667085] leading-[20px]">
                      {room.category || room.roomType || "Standard"}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#667085] leading-[20px]">
                      {room.capacityAdults || 1} Adult(s)
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#667085] leading-[20px]">
                      {room.capacityChildren || 0} Child(ren)
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#667085] leading-[20px]">
                      ${room.pricePerNight}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[12px] font-medium ${
                          room.status === "ACTIVE" ||
                          room.status === "AVAILABLE" ||
                          !room.status
                            ? "bg-[#ecfdf3] text-[#027a48]"
                            : "bg-[rgba(255,113,118,0.1)] text-[#ff7176]"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${room.status === "ACTIVE" || room.status === "AVAILABLE" || !room.status ? "bg-[#027a48]" : "bg-[#ff7176]"}`}
                        />
                        {room.status || "AVAILABLE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRoom(room)}
                          className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-[#eaecf0] flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 font-medium">
              Page {page} of {meta.totalPages || 1}
            </span>
          </div>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (meta.totalPages || 1)}
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <RoomDetailsModal
        isOpen={!!selectedRoom}
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}
