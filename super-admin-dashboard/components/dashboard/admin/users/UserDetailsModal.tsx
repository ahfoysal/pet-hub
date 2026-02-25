/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  X,
  Mail,
  Phone,
  Calendar,
  Star,
  Briefcase,
  Package,
  ShieldCheck,
  ShieldBan,
  FileWarning,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  variant?: "owner" | "sitter";
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
  variant = "owner",
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null;

  const statusColor =
    user.status === "ACTIVE"
      ? "bg-green-50 text-green-700"
      : user.status === "BANNED"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 font-nunito">
              User Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-6 flex-1 overflow-y-auto space-y-5">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                <Image
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                  alt={user.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 font-nunito">
                  {user.fullName}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${statusColor}`}
                >
                  {user.status === "ACTIVE" ? (
                    <ShieldCheck className="w-3 h-3 mr-1" />
                  ) : (
                    <ShieldBan className="w-3 h-3 mr-1" />
                  )}
                  {user.status}
                </span>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-arimo">
                Contact Information
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-arimo">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-700 font-arimo">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  {user.phone}
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-700 font-arimo">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                Joined {format(new Date(user.createdAt), "MMMM dd, yyyy")}
              </div>
            </div>

            {/* Stats */}
            <div
              className={`grid gap-3 ${variant === "sitter" ? "grid-cols-2" : "grid-cols-2"}`}
            >
              {variant === "owner" && (
                <>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-2xl font-black text-blue-700 font-nunito">
                      {user.totalBookings ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold font-arimo">
                      Bookings
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <FileWarning className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-2xl font-black text-amber-700 font-nunito">
                      {user.reportsFiled ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold font-arimo">
                      Reports
                    </p>
                  </div>
                </>
              )}

              {variant === "sitter" && (
                <>
                  <div className="bg-violet-50 rounded-xl p-4 text-center">
                    <Briefcase className="w-5 h-5 text-violet-500 mx-auto mb-1" />
                    <p className="text-2xl font-black text-violet-700 font-nunito">
                      {user.totalServices ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-violet-400 font-bold font-arimo">
                      Services
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-4 text-center">
                    <Package className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                    <p className="text-2xl font-black text-teal-700 font-nunito">
                      {user.totalPackages ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-teal-400 font-bold font-arimo">
                      Packages
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400 mx-auto mb-1" />
                    <p className="text-2xl font-black text-amber-700 font-nunito">
                      {user.rating?.toFixed(1) ?? "0.0"}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold font-arimo">
                      Rating
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    {user.status === "ACTIVE" ? (
                      <ShieldCheck className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    ) : (
                      <ShieldBan className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    )}
                    <p className="text-2xl font-black text-green-700 font-nunito">
                      {user.status === "ACTIVE" ? "✓" : "✗"}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-green-400 font-bold font-arimo">
                      Verified
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* User ID */}
            <p className="text-center text-[10px] text-gray-300 font-mono tracking-wider">
              ID: {user.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
