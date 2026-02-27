import SitterOverviewCards from "@/components/dashboard/sitter/dashboard/overview/SitterOverviewCards";
import SitterBookingTrends from "@/components/dashboard/sitter/dashboard/overview/SitterBookingTrends";
import SitterBookingRatio from "@/components/dashboard/sitter/dashboard/overview/SitterBookingRatio";
import SitterPerformanceTables from "@/components/dashboard/sitter/dashboard/overview/SitterPerformanceTables";
import SitterRecentBookings from "@/components/dashboard/sitter/dashboard/overview/SitterRecentBookings";
import SitterTopCustomers from "@/components/dashboard/sitter/dashboard/overview/SitterTopCustomers";

export default function SitterDashboard() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[1107px] mx-auto pb-10">
      <SitterOverviewCards />
      <SitterRecentBookings />
    </div>
  );
}

