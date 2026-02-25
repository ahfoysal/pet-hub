export interface RolesCountResponse {
  success: boolean;
  message: string;
  data: {
    [key: string]: number;
  };
}

export interface RecentKycItem {
  id: string;
  status: string;
  createdAt: string;
  fullName: string;
  roleType: string;
}

export interface RecentKycResponse {
  success: boolean;
  message: string;
  data: RecentKycItem[];
}

export interface DashboardStats {
  activeProviders: number;
  petOwners: number;
  kycPending: number;
  payoutPending: number;
  openReports: number;
}

export interface BookingTrend {
  month: string;
  bookings: number;
}

export interface RevenueFlow {
  month: string;
  revenue: number;
}

export interface RecentActivity {
  id: string;
  type: "REGISTRATION" | "KYC_APPROVAL" | "PAYOUT" | "REPORT";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "info" | "warning" | "error";
}
export interface PetOwnerItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  totalBookings: number;
  reportsFiled: number;
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
  createdAt: string;
}

export interface PetSitterItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  totalServices: number;
  totalPackages: number;
  rating: number;
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
  createdAt: string;
}

export interface PetOwnersResponse {
  success: boolean;
  message: string;
  data: {
    items: PetOwnerItem[];
    nextCursor: string | null;
  };
}

export interface PetSittersResponse {
  success: boolean;
  message: string;
  data: {
    items: PetSitterItem[];
    nextCursor: string | null;
  };
}
