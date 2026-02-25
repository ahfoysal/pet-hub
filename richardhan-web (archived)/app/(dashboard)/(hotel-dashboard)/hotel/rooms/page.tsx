"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  BedDouble,
  CheckCircle2,
  Wrench,
  DollarSign,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  PawPrint,
  Users,
} from "lucide-react";
import { useGetMyRoomsQuery } from "@/redux/features/api/dashboard/hotel/room/hotelRoomApi";
import { RoomType } from "@/types/dashboard/hotel/hotelRoomTypes";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreateRoomModal from "@/components/dashboard/hotel/rooms/CreateRoomModal";
import EditRoomModal from "@/components/dashboard/hotel/rooms/EditRoomModal";
import RoomDetailsModal from "@/components/dashboard/hotel/rooms/RoomDetailsModal";
import DeleteRoomModal from "@/components/dashboard/hotel/rooms/DeleteRoomModal";
import { useSession } from "next-auth/react";

const ROOM_TYPES = [
  { value: "PET_ONLY", label: "Pet Only" },
  { value: "PET_WITH_ACCO", label: "Pet with Accommodation" },
] as const;
const ROOM_STATUSES = [
  { value: "AVAILABLE", label: "Available" },
  { value: "BOOKED", label: "Booked" },
  { value: "MAINTENANCE", label: "Maintenance" },
] as const;

export default function RoomsManagementPage() {
  const { status } = useSession();
  const { data, isLoading, isError, refetch } = useGetMyRoomsQuery(undefined, {
    skip: status === "loading",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomType | null>(null);
  const [detailsRoomId, setDetailsRoomId] = useState<string | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const rooms = data?.data ?? [];

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const searchTarget = `${r.roomName || ""} ${r.roomNumber}`.toLowerCase();
      const matchSearch = searchTarget.includes(searchQuery.toLowerCase());
      const matchType = !filterType || r.roomType === filterType;
      const matchStatus = !filterStatus || r.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [rooms, searchQuery, filterType, filterStatus]);

  // Stats
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE").length;
  const bookedRooms = rooms.filter((r) => r.status === "BOOKED").length;
  const avgPrice =
    rooms.length > 0
      ? (rooms.reduce((sum, r) => sum + (r.price || 0), 0) / rooms.length).toFixed(2)
      : "0.00";

  const statusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-50 text-emerald-600";
      case "BOOKED":
        return "bg-blue-50 text-blue-600";
      case "MAINTENANCE":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatRoomType = (type: string) => {
    const found = ROOM_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  const formatStatus = (status: string) => {
    const found = ROOM_STATUSES.find((s) => s.value === status);
    return found ? found.label : status;
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BedDouble className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load rooms
          </h2>
          <p className="text-gray-500 mb-5">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Rooms",
      value: totalRooms,
      icon: BedDouble,
      bgClass: "bg-blue-50",
      textClass: "text-blue-500",
    },
    {
      label: "Available",
      value: availableRooms,
      icon: CheckCircle2,
      bgClass: "bg-emerald-50",
      textClass: "text-emerald-500",
    },
    {
      label: "Booked",
      value: bookedRooms,
      icon: Wrench,
      bgClass: "bg-blue-50",
      textClass: "text-blue-500",
    },
    {
      label: "Avg Price",
      value: `$${avgPrice}`,
      icon: DollarSign,
      bgClass: "bg-purple-50",
      textClass: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground font-bold">
            Room Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your hotel rooms and availability
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm sm:self-start"
        >
          <Plus size={18} />
          <span>Add Room</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="order-2 sm:order-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {card.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div
                className={`order-1 sm:order-2 p-2.5 sm:p-3.5 ${card.bgClass} rounded-xl w-fit transition-transform duration-300 group-hover:scale-110`}
              >
                <card.icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${card.textClass}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
              style={{ border: "none" }}
            />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm appearance-none"
              style={{ border: "none" }}
            >
              <option value="">All Types</option>
              {ROOM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm appearance-none"
              style={{ border: "none" }}
            >
              <option value="">All Status</option>
              {ROOM_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BedDouble className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {rooms.length === 0 ? "No rooms yet" : "No results found"}
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            {rooms.length === 0
              ? "Start by adding your first room."
              : "Try adjusting your search or filters."}
          </p>
          {rooms.length === 0 && (
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Add Room
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="hover:bg-gray-50/50 transition-colors"
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {room.images?.[0] ? (
                            <img
                              src={room.images[0]}
                              alt={room.roomName || room.roomNumber}
                              className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <BedDouble className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {room.roomName || `Room ${room.roomNumber}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              #{room.roomNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {formatRoomType(room.roomType)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <PawPrint size={13} className="text-gray-400" />
                            {room.petCapacity}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users size={13} className="text-gray-400" />
                            {room.humanCapacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        ${room.price}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(
                            room.status
                          )}`}
                        >
                          {formatStatus(room.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailsRoomId(room.id)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setEditRoom(room)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteRoom({
                                id: room.id,
                                name:
                                  room.roomName || `Room ${room.roomNumber}`,
                              })
                            }
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  {room.images?.[0] ? (
                    <img
                      src={room.images[0]}
                      alt={room.roomName || room.roomNumber}
                      className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <BedDouble className="h-7 w-7 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {room.roomName || `Room ${room.roomNumber}`}
                        </h3>
                        <p className="text-xs text-gray-500">
                          #{room.roomNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {formatRoomType(room.roomType)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(
                          room.status
                        )}`}
                      >
                        {formatStatus(room.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          ${room.price}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <PawPrint size={11} /> {room.petCapacity}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDetailsRoomId(room.id)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditRoom(room)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteRoom({
                              id: room.id,
                              name:
                                room.roomName || `Room ${room.roomNumber}`,
                            })
                          }
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <CreateRoomModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
      <EditRoomModal
        isOpen={!!editRoom}
        onClose={() => setEditRoom(null)}
        room={editRoom}
      />
      <RoomDetailsModal
        isOpen={!!detailsRoomId}
        onClose={() => setDetailsRoomId(null)}
        roomId={detailsRoomId}
      />
      <DeleteRoomModal
        isOpen={!!deleteRoom}
        onClose={() => setDeleteRoom(null)}
        room={deleteRoom}
      />
    </div>
  );
}
