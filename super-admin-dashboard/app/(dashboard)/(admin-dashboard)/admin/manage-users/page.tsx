/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useGetAllUsersQuery,
  useGetBannedUsersQuery,
  useGetSuspendedUsersQuery,
  useReactivateUserMutation,
  useBanUserMutation,
  useSuspendUserMutation,
  useDeleteUserMutation,
} from "@/redux/features/api/dashboard/admin/manageUsers/manageUsersApi";
import type {
  PlatformUser,
  SuspendDuration,
} from "@/types/dashboard/admin/manageUsers/manageUsersType";
import { SUSPEND_DURATION_LABELS } from "@/types/dashboard/admin/manageUsers/manageUsersType";
import { useToast } from "@/contexts/ToastContext";
import { useSession } from "next-auth/react";
import {
  ShieldBan,
  Clock,
  UserX,
  UserCheck,
  Search,
  AlertCircle,
  Loader2,
  X,
  Ban,
  Timer,
  CalendarClock,
  Users,
  MoreVertical,
  Shield,
  Trash2,
} from "lucide-react";
import Image from "next/image";

type ActiveTab = "all" | "banned" | "suspended";

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PET_OWNER: { label: "Pet Owner", color: "text-blue-700", bg: "bg-blue-50" },
  PET_SITTER: {
    label: "Pet Sitter",
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
  PET_HOTEL: { label: "Pet Hotel", color: "text-teal-700", bg: "bg-teal-50" },
  PET_SCHOOL: {
    label: "Pet School",
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
  VENDOR: { label: "Vendor", color: "text-emerald-700", bg: "bg-emerald-50" },
  ADMIN: { label: "Admin", color: "text-red-700", bg: "bg-red-50" },
};

export default function AdminManageUsersPage() {
  const { status } = useSession();
  const { showToast } = useToast();

  // ── Tab & search state ────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  // ── Modal state ───────────────────────────────────────────────
  const [showBanModal, setShowBanModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [banReason, setBanReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] =
    useState<SuspendDuration>("ONE_WEEK");

  // ── Action menu state ─────────────────────────────────────────
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // ── API hooks ─────────────────────────────────────────────────
  const {
    data: allUsersData,
    isLoading: isAllLoading,
    isError: isAllError,
    refetch: refetchAll,
  } = useGetAllUsersQuery(undefined, { skip: status === "loading" });

  const {
    data: bannedData,
    isLoading: isBannedLoading,
    isError: isBannedError,
    refetch: refetchBanned,
  } = useGetBannedUsersQuery(undefined, { skip: status === "loading" });

  const {
    data: suspendedData,
    isLoading: isSuspendedLoading,
    isError: isSuspendedError,
    refetch: refetchSuspended,
  } = useGetSuspendedUsersQuery(undefined, { skip: status === "loading" });

  const [reactivateUser, { isLoading: isReactivating }] =
    useReactivateUserMutation();
  const [banUser, { isLoading: isBanning }] = useBanUserMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // ── Derived data ──────────────────────────────────────────────
  const allUsers = allUsersData?.data ?? [];
  const bannedUsers = bannedData?.data?.data ?? [];
  const suspendedUsers = suspendedData?.data?.data ?? [];

  const filteredAllUsers = allUsers.filter(
    (u) =>
      (filterRole === "ALL" || u.role === filterRole) &&
      (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())),
  );
  const filteredBanned = bannedUsers.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredSuspended = suspendedUsers.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ── Actions ───────────────────────────────────────────────────
  const openBanModal = (user: PlatformUser) => {
    setSelectedUser(user);
    setBanReason("");
    setShowBanModal(true);
    setOpenMenuId(null);
  };

  const openSuspendModal = (user: PlatformUser) => {
    setSelectedUser(user);
    setSuspendReason("");
    setSuspendDuration("ONE_WEEK");
    setShowSuspendModal(true);
    setOpenMenuId(null);
  };
  
  const openDeleteModal = (user: PlatformUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleReactivate = async (userId: string) => {
    try {
      const result = await reactivateUser(userId).unwrap();
      showToast(result.message || "User reactivated successfully!", "success");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to reactivate user", "error");
    }
  };

  const handleBanSubmit = async () => {
    if (!selectedUser) return;
    if (!banReason.trim()) {
      showToast("Please enter a reason for banning", "error");
      return;
    }
    try {
      const result = await banUser({
        userId: selectedUser.id,
        reason: banReason.trim(),
      }).unwrap();
      showToast(result.message || "User banned successfully!", "success");
      setShowBanModal(false);
      setSelectedUser(null);
      setBanReason("");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to ban user", "error");
    }
  };

  const handleSuspendSubmit = async () => {
    if (!selectedUser) return;
    if (!suspendReason.trim()) {
      showToast("Please enter a reason for suspension", "error");
      return;
    }
    try {
      const result = await suspendUser({
        userId: selectedUser.id,
        reason: suspendReason.trim(),
        suspendDuration,
      }).unwrap();
      showToast(result.message || "User suspended successfully!", "success");
      setShowSuspendModal(false);
      setSelectedUser(null);
      setSuspendReason("");
      setSuspendDuration("ONE_WEEK");
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to suspend user", "error");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const result = await deleteUser(selectedUser.id).unwrap();
      showToast(result.message || "User deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to delete user", "error");
    }
  };

  // ── Format helpers ────────────────────────────────────────────
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isExpired = (dateStr: string) => new Date(dateStr) < new Date();

  const getRoleConfig = (role: string) =>
    ROLE_CONFIG[role] || {
      label: role,
      color: "text-gray-700",
      bg: "bg-gray-50",
    };

  // ── Loading / Error ───────────────────────────────────────────
  const isLoading =
    activeTab === "all"
      ? isAllLoading
      : activeTab === "banned"
        ? isBannedLoading
        : isSuspendedLoading;
  const isError =
    activeTab === "all"
      ? isAllError
      : activeTab === "banned"
        ? isBannedError
        : isSuspendedError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading users…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load users
          </h2>
          <p className="text-gray-500 mb-5">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => {
              refetchAll();
              refetchBanned();
              refetchSuspended();
            }}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-5 sm:space-y-6 pb-8"
      onClick={() => setOpenMenuId(null)}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold">
          Manage Users
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          View all platform users and manage access controls
        </p>
      </div>

      {/* ── Stats Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {allUsers.length}
              </p>
            </div>
            <div className="p-3.5 bg-blue-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Banned</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {bannedUsers.length}
              </p>
            </div>
            <div className="p-3.5 bg-red-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <ShieldBan className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Suspended</p>
              <p className="text-2xl font-bold text-amber-500 mt-2">
                {suspendedUsers.length}
              </p>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs + Search + Table ──────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div
          className="px-5 sm:px-6 py-4"
          style={{ borderBottom: "1px solid #f3f4f6" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Tab buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchTerm("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users className="h-4 w-4" />
                All Users
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-full font-semibold ${
                    activeTab === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {allUsers.length}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("banned");
                  setSearchTerm("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "banned"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ShieldBan className="h-4 w-4" />
                Banned
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-full font-semibold ${
                    activeTab === "banned"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {bannedUsers.length}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("suspended");
                  setSearchTerm("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "suspended"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Clock className="h-4 w-4" />
                Suspended
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-full font-semibold ${
                    activeTab === "suspended"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {suspendedUsers.length}
                </span>
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                  style={{ border: "none" }}
                />
              </div>
              {activeTab === "all" && (
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full sm:w-48 px-4 py-2.5 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all appearance-none cursor-pointer text-gray-700"
                  style={{ border: "none" }}
                >
                  <option value="ALL">All Roles</option>
                  <option value="PET_OWNER">Pet Owners</option>
                  <option value="PET_SITTER">Pet Sitters</option>
                  <option value="PET_HOTEL">Pet Hotels</option>
                  <option value="PET_SCHOOL">Pet Schools</option>
                  <option value="VENDOR">Vendors</option>
                  <option value="ADMIN">Admins</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* ─── ALL USERS TAB ────────────────────────────────── */}
        {activeTab === "all" && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table
                className="w-full"
                style={{ borderCollapse: "collapse", border: "none" }}
              >
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllUsers.length > 0 ? (
                    filteredAllUsers.map((user, index) => {
                      const role = getRoleConfig(user.role);
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50/50 transition-colors"
                          style={{
                            borderTop:
                              index !== 0 ? "1px solid #f3f4f6" : "none",
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {user.image ? (
                                  <Image
                                    src={user.image}
                                    alt={user.fullName}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm font-semibold text-gray-400">
                                    {user.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {user.fullName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${role.bg} ${role.color}`}
                            >
                              {role.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.role !== "ADMIN" ? (
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(
                                      openMenuId === user.id ? null : user.id,
                                    );
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  <MoreVertical className="h-4 w-4 text-gray-500" />
                                </button>
                                {openMenuId === user.id && (
                                  <div
                                    className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg z-20 py-1.5 overflow-hidden"
                                    style={{
                                      border: "1px solid #f3f4f6",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => openSuspendModal(user)}
                                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                    >
                                      <Timer className="h-4 w-4" />
                                      Suspend User
                                    </button>
                                      <button
                                        onClick={() => openBanModal(user)}
                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                      >
                                        <Ban className="h-4 w-4" />
                                        Ban User
                                      </button>
                                      <button
                                        onClick={() => openDeleteModal(user)}
                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-gray-100"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete User
                                      </button>
                                    </div>
                                  )}
                                </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-400">
                                <Shield className="h-3.5 w-3.5" />
                                Admin
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-base font-medium text-gray-600">
                          No users found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm
                            ? "Try adjusting your search"
                            : "No users on the platform yet"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden">
              {filteredAllUsers.length > 0 ? (
                filteredAllUsers.map((user, index) => {
                  const role = getRoleConfig(user.role);
                  return (
                    <div
                      key={user.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                      style={{
                        borderTop: index !== 0 ? "1px solid #f3f4f6" : "none",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.fullName}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-gray-400">
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {user.fullName}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full shrink-0 ${role.bg} ${role.color}`}
                            >
                              {role.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                      {user.role !== "ADMIN" && (
                        <div className="flex items-center gap-2 mt-3 ml-13">
                          <button
                            onClick={() => openSuspendModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-all cursor-pointer"
                          >
                            <Timer className="h-3.5 w-3.5" />
                            Suspend
                          </button>
                          <button
                            onClick={() => openBanModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all cursor-pointer"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Ban
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-base font-medium text-gray-600">
                    No users found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "No users on the platform yet"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── BANNED USERS TAB ─────────────────────────────── */}
        {activeTab === "banned" && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table
                className="w-full"
                style={{ borderCollapse: "collapse", border: "none" }}
              >
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanned.length > 0 ? (
                    filteredBanned.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/50 transition-colors"
                        style={{
                          borderTop: index !== 0 ? "1px solid #f3f4f6" : "none",
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                              <UserX className="h-5 w-5 text-red-400" />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {user.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                            {user.banReason}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleReactivate(user.id)}
                            disabled={isReactivating}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <UserCheck className="h-4 w-4" />
                            Reactivate
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-base font-medium text-gray-600">
                          No banned users found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm
                            ? "Try adjusting your search"
                            : "No users are currently banned"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden">
              {filteredBanned.length > 0 ? (
                filteredBanned.map((user, index) => (
                  <div
                    key={user.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    style={{
                      borderTop: index !== 0 ? "1px solid #f3f4f6" : "none",
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <UserX className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.fullName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Banned
                      </span>
                    </div>

                    <div className="bg-red-50/50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Reason
                      </p>
                      <p className="text-sm text-gray-700">{user.banReason}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Joined {formatDate(user.createdAt)}
                      </span>
                      <button
                        onClick={() => handleReactivate(user.id)}
                        disabled={isReactivating}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <UserCheck className="h-4 w-4" />
                        Reactivate
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-base font-medium text-gray-600">
                    No banned users found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "No users are currently banned"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── SUSPENDED USERS TAB ──────────────────────────── */}
        {activeTab === "suspended" && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table
                className="w-full"
                style={{ borderCollapse: "collapse", border: "none" }}
              >
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Suspended Until
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuspended.length > 0 ? (
                    filteredSuspended.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/50 transition-colors"
                        style={{
                          borderTop: index !== 0 ? "1px solid #f3f4f6" : "none",
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                              <Clock className="h-5 w-5 text-amber-400" />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {user.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                            {user.suspendReason}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <CalendarClock className="h-4 w-4 text-gray-400" />
                            <span
                              className={`text-sm font-medium ${
                                isExpired(user.suspendUntil)
                                  ? "text-emerald-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {formatDateTime(user.suspendUntil)}
                            </span>
                            {isExpired(user.suspendUntil) && (
                              <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                                Expired
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleReactivate(user.id)}
                            disabled={isReactivating}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <UserCheck className="h-4 w-4" />
                            Reactivate
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-base font-medium text-gray-600">
                          No suspended users found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm
                            ? "Try adjusting your search"
                            : "No users are currently suspended"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block lg:hidden">
              {filteredSuspended.length > 0 ? (
                filteredSuspended.map((user, index) => (
                  <div
                    key={user.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                    style={{
                      borderTop: index !== 0 ? "1px solid #f3f4f6" : "none",
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.fullName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          isExpired(user.suspendUntil)
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isExpired(user.suspendUntil)
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        ></span>
                        {isExpired(user.suspendUntil) ? "Expired" : "Suspended"}
                      </span>
                    </div>

                    <div className="bg-amber-50/50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Reason
                      </p>
                      <p className="text-sm text-gray-700">
                        {user.suspendReason}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          Until {formatDate(user.suspendUntil)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleReactivate(user.id)}
                        disabled={isReactivating}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <UserCheck className="h-4 w-4" />
                        Reactivate
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-base font-medium text-gray-600">
                    No suspended users found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "No users are currently suspended"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Ban User Modal ────────────────────────────────── */}
      {showBanModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBanModal(false)}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #f3f4f6" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-xl">
                  <Ban className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ban User
                </h3>
              </div>
              <button
                onClick={() => setShowBanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Selected User Card */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {selectedUser.image ? (
                      <Image
                        src={selectedUser.image}
                        alt={selectedUser.fullName}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-500">
                        {selectedUser.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {selectedUser.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedUser.email}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${getRoleConfig(selectedUser.role).bg} ${getRoleConfig(selectedUser.role).color}`}
                    >
                      {getRoleConfig(selectedUser.role).label}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Banning
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter the reason for banning this user…"
                  rows={3}
                  className="w-full px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none"
                  style={{ border: "none" }}
                />
              </div>

              <div className="bg-red-50 rounded-xl p-3.5">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700">
                    Banning will permanently restrict this user&apos;s access to
                    the platform until manually reactivated by an admin.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="px-6 py-4 flex justify-end gap-2"
              style={{ borderTop: "1px solid #f3f4f6" }}
            >
              <button
                onClick={() => setShowBanModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBanSubmit}
                disabled={isBanning}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isBanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Banning…
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4" /> Confirm Ban
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Suspend User Modal ────────────────────────────── */}
      {showSuspendModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSuspendModal(false)}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #f3f4f6" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <Timer className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Suspend User
                </h3>
              </div>
              <button
                onClick={() => setShowSuspendModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Selected User Card */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {selectedUser.image ? (
                      <Image
                        src={selectedUser.image}
                        alt={selectedUser.fullName}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-500">
                        {selectedUser.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {selectedUser.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedUser.email}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${getRoleConfig(selectedUser.role).bg} ${getRoleConfig(selectedUser.role).color}`}
                    >
                      {getRoleConfig(selectedUser.role).label}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suspension Duration
                </label>
                <select
                  value={suspendDuration}
                  onChange={(e) =>
                    setSuspendDuration(e.target.value as SuspendDuration)
                  }
                  className="w-full px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all cursor-pointer"
                  style={{ border: "none" }}
                >
                  {(
                    Object.entries(SUSPEND_DURATION_LABELS) as [
                      SuspendDuration,
                      string,
                    ][]
                  ).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Suspension
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Enter the reason for suspending this user…"
                  rows={3}
                  className="w-full px-4 py-3 text-sm bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none"
                  style={{ border: "none" }}
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-3.5">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-800">
                    This user will be temporarily restricted from accessing the
                    platform for the selected duration.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="px-6 py-4 flex justify-end gap-2"
              style={{ borderTop: "1px solid #f3f4f6" }}
            >
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendSubmit}
                disabled={isSuspending}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSuspending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Suspending…
                  </>
                ) : (
                  <>
                    <Timer className="h-4 w-4" /> Confirm Suspend
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Delete User Modal ─────────────────────────────── */}
      {showDeleteModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #f3f4f6" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-xl">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete User Account
                </h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {selectedUser.image ? (
                      <Image
                        src={selectedUser.image}
                        alt={selectedUser.fullName}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-500">
                        {selectedUser.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {selectedUser.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-red-800">
                      Warning: Permanent Action
                    </h4>
                    <p className="text-xs text-red-700 mt-1 leading-relaxed">
                      This will permanently delete the user account from both
                      the database and Firebase Authentication. This action
                      cannot be undone. All associated data (KYC, profiles,
                      etc.) will also be removed.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center px-4">
                Are you sure you want to delete this user?
              </p>
            </div>

            {/* Modal Footer */}
            <div
              className="px-6 py-4 flex justify-end gap-2"
              style={{ borderTop: "1px solid #f3f4f6" }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
