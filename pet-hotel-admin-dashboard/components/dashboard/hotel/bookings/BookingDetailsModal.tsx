import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Home,
  CreditCard,
} from "lucide-react";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function BookingDetailsModal({
  isOpen,
  onClose,
  booking,
}: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-black text-gray-900 font-nunito flex items-center gap-3">
                Booking Reference
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  #{booking.id?.slice(-8).toUpperCase()}
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto flex-1 space-y-8">
            {/* Status Strip */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${getStatusColor(booking.status)}`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 opacity-70" />
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-70 font-arimo">
                    Current Status
                  </p>
                  <p className="font-black font-nunito text-lg">
                    {booking.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pet Owner Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest font-arimo flex items-center gap-2">
                  <User className="w-4 h-4" /> Guest Information
                </h3>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                    {booking.owner?.user?.image ? (
                      <img
                        src={booking.owner.user.image}
                        alt={booking.owner.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 font-nunito">
                      {booking.owner?.fullName || "Guest User"}
                    </p>
                    <p className="text-xs text-gray-500 font-arimo">
                      {booking.owner?.user?.email || "No email provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest font-arimo flex items-center gap-2">
                  <Home className="w-4 h-4" /> Accommodation
                </h3>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="font-bold text-gray-900 font-nunito mb-1">
                    {booking.room?.roomName ||
                      `Room ${booking.room?.roomNumber}`}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-gray-500 font-arimo">
                    <p>
                      Type:{" "}
                      {booking.room?.roomType?.replace("_", " ") || "Standard"}
                    </p>
                    <p>Rate: ${booking.room?.price || 0} / night</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Duration */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest font-arimo flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Stay Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">
                    Check In
                  </p>
                  <p className="font-bold text-gray-900 font-nunito text-lg">
                    {new Date(booking.checkIn).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100">
                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-1">
                    Check Out
                  </p>
                  <p className="font-bold text-gray-900 font-nunito text-lg">
                    {new Date(booking.checkOut).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest font-arimo flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Details
              </h3>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-arimo text-gray-500">
                    Number of Pets
                  </span>
                  <span className="font-bold font-nunito text-gray-900">
                    {booking.bookingItems?.length || 1}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-arimo text-gray-500">
                    Payment Status
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${booking.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {booking.paymentStatus || "PENDING"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="font-black font-arimo text-gray-900 uppercase tracking-wider">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black font-nunito text-primary">
                    ${booking.totalPrice || booking.totalAmount || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
