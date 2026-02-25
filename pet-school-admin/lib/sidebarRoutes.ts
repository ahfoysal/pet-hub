export type UserRole =
  | "ADMIN"
  | "VENDOR"
  | "PET_SITTER"
  | "PET_HOTEL"
  | "PET_SCHOOL"
  | "PET_OWNER";

// Define the basic menu item interface
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  Globe,
  Wallet,
  TrendingUp,
} from "lucide-react";

export interface MenuItemConfig {
  label: string;
  href: string;
  roles: UserRole[];
  icon?: LucideIcon; // lucide component
  imageSrc?: string; // for image icons
  imageSize?: number;
}

export const menuItemsConfig: MenuItemConfig[] = [
  // ── SCHOOL MENU ───────────────────────────────────────────────
  {
    label: "Dashboard",
    href: "/school",
    icon: Home,
    roles: ["PET_SCHOOL"],
  },
  {
    label: "Analytics",
    href: "/school/analytics",
    icon: TrendingUp,
    roles: ["PET_SCHOOL"],
  },
  {
    label: "Admissions",
    href: "/school/admissions",
    icon: GraduationCap,
    roles: ["PET_SCHOOL"],
  },
  {
    label: "Courses",
    href: "/school/courses",
    icon: BookOpen,
    roles: ["PET_SCHOOL"],
  },
  {
    label: "Class Schedule",
    href: "/school/schedule",
    icon: Calendar,
    roles: ["PET_SCHOOL"],
  },
  {
    label: "Students",
    href: "/school/students",
    icon: GraduationCap,
    roles: ["PET_SCHOOL"],
  },
  {
    label: "Trainers",
    href: "/school/trainers",
    icon: Users,
    roles: ["PET_SCHOOL"],
  },
  {
    label: "Community",
    href: "/school/community",
    icon: Globe,
    roles: ["PET_SCHOOL"],
  },
  {
    label: "Finance",
    href: "/school/finance",
    icon: Wallet,
    roles: ["PET_SCHOOL"],
  },

];

export const getVisibleMenuItems = (userRole: UserRole | null) => {
  if (!userRole) return [];
  return menuItemsConfig.filter((item) => item.roles.includes(userRole));
};

export const getDefaultDashboardRoute = (userRole: UserRole | null): string => {
  if (!userRole) return "/";

  const roleRoutes: Record<UserRole, string> = {
    ADMIN: "/admin",
    VENDOR: "/vendor",
    PET_SITTER: "/sitter",
    PET_HOTEL: "/hotel",
    PET_SCHOOL: "/school",
    PET_OWNER: "/owner",
  };

  return roleRoutes[userRole] || "/";
};
