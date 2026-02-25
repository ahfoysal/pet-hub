"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useGetMyRoomsQuery } from "@/redux/features/api/dashboard/hotel/room/hotelRoomApi";
import { RoomType } from "@/types/dashboard/hotel/hotelRoomTypes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateRoomModal from "@/components/dashboard/hotel/rooms/CreateRoomModal";
import EditRoomModal from "@/components/dashboard/hotel/rooms/EditRoomModal";
import RoomDetailsModal from "@/components/dashboard/hotel/rooms/RoomDetailsModal";
import DeleteRoomModal from "@/components/dashboard/hotel/rooms/DeleteRoomModal";
import { useSession } from "next-auth/react";
import { 
  PageHeader, 
  SearchBar, 
  TableContainer, 
  ActionButton 
} from "@/components/dashboard/shared/DashboardUI";

export default function RoomsManagementPage() {
  const { status: sessionStatus } = useSession();
  const { data, isLoading, isError, refetch } = useGetMyRoomsQuery(undefined, {
    skip: sessionStatus === "loading",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomType | null>(null);
  const [detailsRoomId, setDetailsRoomId] = useState<string | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<{ id: string; name: string } | null>(null);

  const rooms = data?.data ?? [];

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const searchTarget = `${r.roomName || ""} ${r.roomNumber}`.toLowerCase();
      return searchTarget.includes(searchQuery.toLowerCase());
    });
  }, [rooms, searchQuery]);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load rooms</h2>
          <button onClick={() => refetch()} className="px-5 py-2.5 bg-[#ff7176] text-white rounded-xl font-medium">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-[25px] pb-10 px-2 font-arimo bg-[#f2f4f8]">
      <PageHeader 
        title="Room Management" 
        subtitle="Manage your Room catalog" 
        action={
          <ActionButton onClick={() => setShowCreate(true)} icon="/assets/add-plus.svg">
            Add Rooms
          </ActionButton>
        }
      />

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search products..." />

      <TableContainer 
        title="All Room"
        footer={
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 px-[14px] py-[8px] bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors">
              <Image src="/assets/prev-arrow.svg" alt="Prev" width={20} height={20} />
              Previous
            </button>
            <div className="flex items-center gap-[2px]">
              {[1, 2, 3, "...", 8, 9, 10].map((page, i) => (
                <button key={i} className={`w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-medium transition-colors ${page === 1 ? "bg-[#f9f5ff] text-[#7f56d9]" : "text-[#667085] hover:bg-gray-50"}`}>
                  {page}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-[14px] py-[8px] bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors">
              Next
              <Image src="/assets/next-arrow.svg" alt="Next" width={20} height={20} />
            </button>
          </div>
        }
      >
        <table className="w-full border-collapse">
          <thead className="bg-[#f9fafb]">
            <tr>
              {["Name", "Room Type", "Capacity", "Pet Capacity", "Price / Night", "Status", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-[12px] font-medium text-[#667085] border-b border-[#eaecf0]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50/50 transition-colors h-[72px]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-[#c7b9da]" />
                      {room.images?.[0] && <Image src={room.images[0]} alt={room.roomName || room.roomNumber} fill className="object-cover" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-[#101828] line-clamp-1">{room.roomName || `Room ${room.roomNumber}`}</span>
                      <span className="text-[14px] font-normal text-[#667085]">PRD-001</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] text-[#667085]">{room.roomType === "PET_ONLY" ? "Single Room" : "Double Room"}</td>
                <td className="px-6 py-4 text-[14px] text-[#667085]">{room.humanCapacity} Adult{room.humanCapacity > 1 ? "s" : ""}</td>
                <td className="px-6 py-4 text-[14px] text-[#667085]">{room.petCapacity} Pet{room.petCapacity > 1 ? "s" : ""}</td>
                <td className="px-6 py-4 text-[14px] text-[#667085]">${room.price}</td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-[6px] px-[8px] py-[2px] rounded-full mix-blend-multiply ${room.status === "AVAILABLE" ? "bg-[#ecfdf3] text-[#027a48]" : "bg-[rgba(255,113,118,0.2)] text-[#ff7176]"}`}>
                    <Image src={room.status === "AVAILABLE" ? "/assets/dot-available.svg" : "/assets/dot-occupied.svg"} alt={room.status} width={8} height={8} />
                    <span className="text-[12px] font-medium">{room.status === "AVAILABLE" ? "Available" : "Occupied"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setDetailsRoomId(room.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Image src="/assets/view-eye.svg" alt="View" width={20} height={20} /></button>
                    <button onClick={() => setEditRoom(room)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Image src="/assets/edit-pencil.svg" alt="Edit" width={20} height={20} /></button>
                    <button onClick={() => setDeleteRoom({ id: room.id, name: room.roomName || `Room ${room.roomNumber}` })} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Image src="/assets/delete-trash.svg" alt="Delete" width={20} height={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>

      {/* Modals remain the same */}
      <CreateRoomModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
      {editRoom && <EditRoomModal isOpen={!!editRoom} onClose={() => setEditRoom(null)} room={editRoom} />}
      {detailsRoomId && <RoomDetailsModal isOpen={!!detailsRoomId} onClose={() => setDetailsRoomId(null)} roomId={detailsRoomId} />}
      {deleteRoom && <DeleteRoomModal isOpen={!!deleteRoom} onClose={() => setDeleteRoom(null)} room={deleteRoom} />}
    </div>
  );
}
