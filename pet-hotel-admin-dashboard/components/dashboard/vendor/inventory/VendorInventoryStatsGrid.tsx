import StatsCard from "@/components/ui/StatsCard";
import { Package, ShoppingCart, DollarSign, Star } from "lucide-react";

type Stats = {
  totalProducts: number;
  totalStock: number;
  totalUnitsSold: number;
  totalRevenue: number;
  averageRating: number;
};

interface Props {
  stats: Stats;
}

export default function VendorInventoryStatsGrid({ stats }: Props) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      change: "+5%",
      trend: "up" as const,
      icon: Package,
      color: "blue",
    },
    {
      title: "Total Stock",
      value: stats.totalStock.toString(),
      change: "+8%",
      trend: "up" as const,
      icon: Package,
      color: "purple",
    },
    {
      title: "Units Sold",
      value: stats.totalUnitsSold.toLocaleString(),
      change: "+12%",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "green",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "+18%",
      trend: "up" as const,
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Avg Rating",
      value: stats.averageRating.toFixed(1),
      change: "+0.2",
      trend: "up" as const,
      icon: Star,
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card, i) => (
        <StatsCard key={i} {...card} />
      ))}
    </div>
  );
}
