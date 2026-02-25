import { X, Users, PawPrint, Tag } from "lucide-react";
// Assuming the room type is similar to `any` or `RoomType`. Use `any` for now and it will be type-safe enough.

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: any; // We receive full room object from list query
}

export default function RoomDetailsModal({
  isOpen,
  onClose,
  room,
}: RoomDetailsModalProps) {
  if (!isOpen || !room) return null;

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
    switch (type) {
      case "PET_ONLY":
        return "Pet Only";
      case "PET_WITH_ACCO":
        return "Pet with Accommodation";
      default:
        return type;
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "BOOKED":
        return "Booked";
      case "MAINTENANCE":
        return "Maintenance";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Room Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 flex-1 overflow-y-auto">
            <div className="space-y-5">
              {/* Images */}
              {room.images && room.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {room.images.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img}
                      alt={room.roomName || room.roomNumber}
                      className="h-36 w-36 rounded-xl object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Title + Badges */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {room.roomName || `Room ${room.roomNumber}`}
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {formatRoomType(room.roomType)}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    #{room.roomNumber}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(
                      room.status,
                    )}`}
                  >
                    {formatStatus(room.status)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {room.description && (
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {room.description}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 font-medium">Price</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">
                    ${room.price}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <PawPrint className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500 font-medium">Pets</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">
                    {room.petCapacity}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500 font-medium">Humans</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">
                    {room.humanCapacity}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              {room.roomAmenities && room.roomAmenities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.roomAmenities.map((a: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        <Tag size={10} />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
