import SitterOverviewCards from "@/components/dashboard/sitter/dashboard/overview/SitterOverviewCards";
import SitterBookingTrends from "@/components/dashboard/sitter/dashboard/overview/SitterBookingTrends";
import SitterBookingRatio from "@/components/dashboard/sitter/dashboard/overview/SitterBookingRatio";
import SitterPerformanceTables from "@/components/dashboard/sitter/dashboard/overview/SitterPerformanceTables";
import SitterRecentBookings from "@/components/dashboard/sitter/dashboard/overview/SitterRecentBookings";
import SitterTopCustomers from "@/components/dashboard/sitter/dashboard/overview/SitterTopCustomers";

export default function SitterDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-default-900 mb-2">Welcome Back!</h1>
        <p className="text-default-500">Here is what is happening with your pet sitting business today.</p>
      </div>

      <SitterOverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <SitterBookingTrends />
        </div>
        <div className="lg:col-span-1">
           <SitterBookingRatio />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <SitterPerformanceTables />
         <div className="flex flex-col gap-6">
            <SitterRecentBookings />
            <SitterTopCustomers />
         </div>
      </div>
    </div>
  );
}

