/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useGetPetOwnersQuery } from "@/redux/features/api/dashboard/admin/dashboard/adminDashboardApi";
import {
  Search,
  Loader2,
  MoreVertical,
  ShieldBan,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Star,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import UserDetailsModal from "./UserDetailsModal";

export default function PetOwnersClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const { data, isLoading, isError } = useGetPetOwnersQuery({
    search: searchTerm,
    limit: 20,
  });

  const owners = data?.data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-nunito">
            Pet Owners (Users)
          </h1>
          <p className="text-sm text-gray-500 font-arimo mt-1">
            Manage and monitor all pet owners registered on the platform.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-arimo text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider font-arimo">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider font-arimo">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider font-arimo">
                  Bookings
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider font-arimo">
                  Reports Filed
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider font-arimo">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider font-arimo">
                  Member Since
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider font-arimo text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-gray-500 font-arimo italic text-sm">
                      Loading pet owners...
                    </p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-red-500 font-arimo"
                  >
                    Failed to load pet owners. Please try again later.
                  </td>
                </tr>
              ) : owners.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 font-arimo"
                  >
                    No pet owners found.
                  </td>
                </tr>
              ) : (
                owners.map((owner) => (
                  <tr
                    key={owner.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <Image
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${owner.fullName}`}
                            alt={owner.fullName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 font-nunito">
                            {owner.fullName}
                          </p>
                          <p className="text-xs text-gray-500 font-arimo">
                            ID: {owner.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-arimo">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{owner.email}</span>
                        </div>
                        {owner.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-arimo">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{owner.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-arimo font-medium text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {owner.totalBookings} Bookings
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-arimo text-sm text-gray-700">
                        {owner.reportsFiled > 0 ? (
                          <span className="text-amber-600 font-semibold">
                            {owner.reportsFiled} Reports
                          </span>
                        ) : (
                          <span className="text-gray-400">No reports</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-arimo ${
                          owner.status === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : owner.status === "BANNED"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {owner.status === "ACTIVE" ? (
                          <UserCheck className="w-3 h-3 mr-1" />
                        ) : (
                          <ShieldBan className="w-3 h-3 mr-1" />
                        )}
                        {owner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-arimo">
                      {format(new Date(owner.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedUser(owner)}
                        className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-gray-400 hover:text-primary flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && !isError && owners.length > 0 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-arimo">
              Showing {owners.length} owners
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-400 cursor-not-allowed font-arimo transition-all"
              >
                Previous
              </button>
              <button
                disabled
                className="px-3 py-1 text-xs border border-gray-200 rounded bg-white text-gray-400 cursor-not-allowed font-arimo transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        variant="owner"
      />
    </div>
  );
}
