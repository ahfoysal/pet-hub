"use client";

import {
  useGetOwnerRecentBookingsQuery,
  useGetOwnerBookingSummaryQuery,
  useGetTopSittersForOwnerQuery,
  useGetTopServicesAndPackagesQuery,
} from "@/redux/features/api/dashboard/owner/summary/ownerSummaryApi";
import {
  Card,
  CardBody,
  Spinner,
  Avatar,
  Chip,
  Button,
} from "@nextui-org/react";
import {
  Activity,
  Calendar,
  Star,
  TrendingUp,
  History,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";

export default function OwnerDashboardHome() {
  const { data: summaryData, isLoading: isLoadingSummary } =
    useGetOwnerBookingSummaryQuery();
  const { data: recentBookingsData, isLoading: isLoadingRecent } =
    useGetOwnerRecentBookingsQuery();
  const { data: topSittersData, isLoading: isLoadingSitters } =
    useGetTopSittersForOwnerQuery();
  const { data: topServicesData, isLoading: isLoadingServices } =
    useGetTopServicesAndPackagesQuery();

  const summary = summaryData?.data || {
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalAmountSpent: 0,
  };
  const recentBookings = recentBookingsData?.data || [];
  const topSitters = topSittersData?.data || [];
  const topServices = topServicesData?.data || [];

  if (
    isLoadingSummary ||
    isLoadingRecent ||
    isLoadingSitters ||
    isLoadingServices
  ) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner
          size="lg"
          color="primary"
          label="Loading Dashboard Analytics..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-default-900">
          Welcome Back! 👋
        </h1>
        <p className="text-default-500">
          Here&apos;s a summary of your pet&apos;s activities and bookings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border border-default-100">
          <CardBody className="p-4 flex flex-row items-center gap-4">
            <div className="p-3 bg-primary-50 text-primary rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Bookings</p>
              <h3 className="text-2xl font-bold">{summary.totalBookings}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-default-100">
          <CardBody className="p-4 flex flex-row items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-default-500">Active Bookings</p>
              <h3 className="text-2xl font-bold">{summary.activeBookings}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-default-100">
          <CardBody className="p-4 flex flex-row items-center gap-4">
            <div className="p-3 bg-green-50 text-green-500 rounded-xl">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-default-500">Completed</p>
              <h3 className="text-2xl font-bold">
                {summary.completedBookings}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm border border-default-100">
          <CardBody className="p-4 flex flex-row items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-default-500">Amount Spent</p>
              <h3 className="text-2xl font-bold">
                ${summary.totalAmountSpent.toFixed(2)}
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm border border-default-100 h-full max-h-125 overflow-auto">
            <CardBody className="p-0">
              <div className="border-b border-default-100 p-4 sticky top-0 bg-white z-10 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recent Bookings
                </h3>
                <Button size="sm" variant="light" color="primary">
                  View All
                </Button>
              </div>
              <div className="divide-y divide-default-100">
                {recentBookings.length === 0 ? (
                  <div className="p-8 text-center text-default-400">
                    No recent bookings found.
                  </div>
                ) : (
                  recentBookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="p-4 hover:bg-default-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={booking.pet?.image || ""}
                          name={booking.pet?.name || "P"}
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {booking.service?.name || "Service Booking"}
                          </p>
                          <p className="text-xs text-default-400">
                            {format(
                              new Date(booking.startDate),
                              "MMM dd, yyyy",
                            )}{" "}
                            • {booking.sitter?.name}
                          </p>
                        </div>
                      </div>
                      <Chip
                        size="sm"
                        color={
                          booking.status === "COMPLETED"
                            ? "success"
                            : booking.status === "IN-PROGRESS"
                              ? "primary"
                              : booking.status === "CANCELLED"
                                ? "danger"
                                : "warning"
                        }
                        variant="flat"
                      >
                        {booking.status}
                      </Chip>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Top Performers Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border border-default-100">
            <CardBody className="p-0">
              <div className="border-b border-default-100 p-4 bg-default-50/50">
                <h3 className="text-md font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning" />
                  Top Sitters
                </h3>
              </div>
              <div className="divide-y divide-default-100 p-2">
                {topSitters.length === 0 ? (
                  <div className="p-4 text-center text-sm text-default-400">
                    No top sitters yet.
                  </div>
                ) : (
                  topSitters.slice(0, 4).map((sitter: any) => (
                    <div
                      key={sitter.id}
                      className="p-2 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={sitter.user?.image || ""}
                          name={sitter.user?.name || "S"}
                          size="sm"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {sitter.user?.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-warning">
                            <Star className="w-3 h-3 fill-warning" />
                            <span>{sitter.rating || "5.0"}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        radius="full"
                        variant="flat"
                        color="primary"
                      >
                        Book
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm border border-default-100">
            <CardBody className="p-0">
              <div className="border-b border-default-100 p-4 bg-default-50/50">
                <h3 className="text-md font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-success" />
                  Favorite Services
                </h3>
              </div>
              <div className="p-4 gap-2 flex flex-wrap">
                {topServices.length === 0 ? (
                  <div className="text-center w-full text-sm text-default-400">
                    No service data.
                  </div>
                ) : (
                  topServices.slice(0, 5).map((service: any) => (
                    <Chip
                      key={service.id}
                      variant="flat"
                      color="secondary"
                      size="sm"
                    >
                      {service.name}
                    </Chip>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
