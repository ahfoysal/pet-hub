export type UserRole = "PET_SITTER";

import {
  LayoutDashboard,
  DollarSign,
  Home,
  Package,
  Calendar,
  Settings,
  TrendingUp,
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
    href: "/sitter",
    icon: LayoutDashboard,
    roles: ["PET_SITTER"],
  },
  {
    label: "Analytics",
    href: "/sitter/analytics",
    icon: TrendingUp,
    roles: ["PET_SITTER"],
  },
  {
    label: "My Services",
    href: "/sitter/my-service",
    icon: Home,
    roles: ["PET_SITTER"],
  },
  {
    label: "Packages",
    href: "/sitter/packages",
    icon: Package,
    roles: ["PET_SITTER"],
  },
  {
    label: "Bookings",
    href: "/sitter/bookings",
    icon: Calendar,
    roles: ["PET_SITTER"],
  },
  {
    label: "Finance",
    href: "/sitter/finance",
    icon: DollarSign,
    roles: ["PET_SITTER"],
  },
  {
    label: "Community",
    href: "/sitter/community",
    imageSrc: "/images/dashboard/sidebar/community.png",
    roles: ["PET_SITTER"],
  },
];

export const getVisibleMenuItems = (userRole: UserRole | null) => {
  if (!userRole) return [];
  return menuItemsConfig.filter((item) => item.roles.includes(userRole));
};

export const getDefaultDashboardRoute = (userRole: UserRole | null): string => {
  return "/sitter";
};
