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
  LayoutDashboard,
  DollarSign,
  BedDouble,
  UtensilsCrossed,
  Home,
  Package,
  Calendar,
  Users,
  Car,
  BookOpen,
  GraduationCap,
  Settings,
  BarChart3,
  CircleStar,
  MessagesSquare,
  ShieldUser,
  Globe,
  Wallet,
} from "lucide-react";

export interface MenuItemConfig {
  label: string;
  href: string;
  roles: UserRole[];
  icon?: LucideIcon; // lucide component
  imageSrc?: string; // for image icons
  imageSize?: number;
  subItems?: { label: string; href: string; icon?: LucideIcon }[];
}

export const menuItemsConfig: MenuItemConfig[] = [
  // ── ADMIN MENU ───────────────────────────────────────────────
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    label: "Platform Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
  {
    label: "Provider Management",
    href: "#",
    icon: Users,
    roles: ["ADMIN"],
    subItems: [
      { label: "Pet Sitters", href: "/admin/pet-sitters", icon: Users },
      { label: "Pet Schools", href: "/admin/pet-schools", icon: GraduationCap },
      { label: "Pet Hotels", href: "/admin/pet-hotels", icon: BedDouble },
      { label: "Vendors", href: "/admin/vendors", icon: Package },
    ],
  },
  {
    label: "Pet Owners (Users)",
    href: "/admin/pet-owners",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    label: "Payments & Payouts",
    href: "/admin/payments",
    icon: DollarSign,
    roles: ["ADMIN"],
  },
  {
    label: "KYC Verification",
    href: "/admin/kyc",
    icon: ShieldUser,
    roles: ["ADMIN"],
  },
  {
    label: "Reports & Complaints",
    href: "/admin/reports",
    icon: MessagesSquare,
    roles: ["ADMIN"],
  },
  {
    label: "Admin Management",
    href: "/admin/manage-admins",
    icon: Settings,
    roles: ["ADMIN"],
  },
  {
    label: "Community",
    href: "/admin/community",
    imageSrc: "/images/dashboard/sidebar/community.png",
    roles: ["ADMIN"],
  },

  // ── VENDOR MENU ───────────────────────────────────────────────
  {
    label: "Dashboard",
    href: "/vendor",
    icon: LayoutDashboard,
    roles: ["VENDOR"],
  },
  {
    label: "Products",
    href: "/vendor/products",
    icon: BedDouble,
    roles: ["VENDOR"],
  },
  {
    label: "Orders",
    href: "/vendor/orders",
    icon: UtensilsCrossed,
    roles: ["VENDOR"],
  },
  {
    label: "Inventory",
    href: "/vendor/inventory",
    icon: CircleStar, // Using Package instead of CircleStar since CircleStar doesn't exist
    roles: ["VENDOR"],
  },
  {
    label: "Community",
    href: "/vendor/community",
    icon: MessagesSquare,
    roles: ["VENDOR"],
  },

  // ── SITTER MENU ───────────────────────────────────────────────
  {
    label: "Dashboard",
    href: "/sitter",
    icon: LayoutDashboard,
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

  // ── HOTEL MENU ───────────────────────────────────────────────
  {
    label: "Dashboard",
    href: "/hotel",
    icon: LayoutDashboard,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Rooms",
    href: "/hotel/rooms",
    icon: BedDouble,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Food",
    href: "/hotel/food",
    icon: UtensilsCrossed,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Bookings",
    href: "/hotel/bookings",
    icon: Calendar,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Guests",
    href: "/hotel/guests",
    icon: Users,
    roles: ["PET_HOTEL"],
  },
  {
    label: "Services",
    href: "/hotel/services",
    icon: Car,
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
    imageSrc: "/images/dashboard/sidebar/community.png",
    roles: ["PET_HOTEL"],
  },

  // ── SCHOOL MENU ───────────────────────────────────────────────
  {
    label: "Dashboard",
    href: "/school",
    icon: LayoutDashboard,
    roles: ["PET_SCHOOL"],
  },
  // {
  //   label: "Analytics",
  //   href: "/analytics",
  //   icon: TrendingUp,
  //   roles: ["PET_SCHOOL"],
  // },
  {
    label: "Admission",
    href: "/school/admission",
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

  // ── OWNER MENU ───────────────────────────────────────────────
  {
    label: "Dashboard",
    href: "/owner",
    icon: LayoutDashboard,
    roles: ["PET_OWNER"],
  },
  {
    label: "My Pets",
    href: "/owner/pets",
    icon: Users,
    roles: ["PET_OWNER"],
  },
  {
    label: "Bookings",
    href: "/owner/bookings",
    icon: Calendar,
    roles: ["PET_OWNER"],
  },
  {
    label: "Services",
    href: "/owner/services",
    icon: Car,
    roles: ["PET_OWNER"],
  },
  {
    label: "Payments",
    href: "/owner/payments",
    icon: DollarSign,
    roles: ["PET_OWNER"],
  },
  {
    label: "Community",
    href: "/owner/community",
    imageSrc: "/images/dashboard/sidebar/community.png",
    roles: ["PET_OWNER"],
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
