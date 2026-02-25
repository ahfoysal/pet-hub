import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change: string;
  trend?: "up" | "down";
};

export default function StatsCard({
  icon: Icon,
  title,
  value,
  change,
  trend = "up",
}: StatsCardProps) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="space-y-2 text-gray-600 text-sm mb-1">
            <div className="p-2 sm:p-3 bg-blue-100 w-fit rounded-lg">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="text-xl">{title}</div>
          </div>

          <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
        </div>

        {/* <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{change}</span>
        </div> */}
      </div>
    </div>
  );
}
