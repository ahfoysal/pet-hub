export type UserRole = "PET_HOTEL";

import {
  LayoutDashboard,
  TrendingUp,
  BedDouble,
  UtensilsCrossed,
  Calendar,
  Users,
  Car,
  DollarSign,
  Star,
} from "lucide-react";

export interface MenuItemConfig {
  label: string;
  href: string;
  roles: UserRole[];
  icon?: any;
  imageSrc?: string;
  imageSize?: number;
}

export const menuItemsConfig: MenuItemConfig[] = [
  {
    label: "Dashboard",
    href: "/hotel",
    icon: LayoutDashboard,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Analytics",
    href: "/hotel/analytics",
    icon: TrendingUp,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Rooms",
    href: "/hotel/rooms",
    icon: BedDouble,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Food Menu",
    href: "/hotel/food",
    icon: UtensilsCrossed,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Guests",
    href: "/hotel/guests",
    icon: Users,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Finance",
    href: "/hotel/finance",
    icon: DollarSign,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Community",
    href: "/hotel/community",
    imageSrc: "/assets/community.svg",
    roles: ["PET_HOTEL"],
  },
  {
    label: "Review",
    href: "/hotel/reviews",
    icon: Star,
    roles: ["PET_HOTEL"],
  },
];

export const getVisibleMenuItems = (userRole: UserRole | null) => {
  if (!userRole) return [];
  return menuItemsConfig.filter((item) => item.roles.includes(userRole));
};

export const getDefaultDashboardRoute = (userRole: UserRole | null): string => {
  return "/hotel";
};
