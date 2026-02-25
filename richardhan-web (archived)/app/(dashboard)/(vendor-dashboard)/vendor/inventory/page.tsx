"use client";

import DashboardHeading from "@/components/dashboard/common/DashboardHeading";
import BestSellingProducts from "@/components/dashboard/vendor/inventory/BestSellingProducts";
import InventoryOverview from "@/components/dashboard/vendor/inventory/InventoryOverview";
import ProductsTable from "@/components/dashboard/vendor/inventory/ProductsTable";
import RecentActivity from "@/components/dashboard/vendor/inventory/RecentActivity";
import VendorInventoryStatsGrid from "@/components/dashboard/vendor/inventory/VendorInventoryStatsGrid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetVendorInventoryQuery } from "@/redux/features/api/dashboard/vendor/inventory/vendorInventoryApi";
import { useSession } from "next-auth/react";

export default function InventoryPage() {
  const { status } = useSession();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetVendorInventoryQuery(undefined, {
    skip: status === "loading",
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !response?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          {error
            ? `Error: ${(error as any).data?.message || "Failed to load data"}`
            : "No data available"}
        </div>
      </div>
    );
  }

  const { data } = response;
  return (
    <div className="space-y-5 sm:space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DashboardHeading
          title="Inventory Summary"
          description="Track and manage your product inventory"
        />
      </div>
      {/* Stats */}
      <VendorInventoryStatsGrid stats={data.stats} />

      {/* Best Selling */}
      <BestSellingProducts products={data.bestSellingProducts as any[]} />

      {/* Main grid: Overview + Table + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <InventoryOverview summary={data.inventorySummary} />
        <RecentActivity activities={data.recentActivity} />
      </div>
      <ProductsTable />
    </div>
  );
}
