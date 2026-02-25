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
  kycStatus?: "APPROVED" | "PENDING" | "REJECTED" | "NOT_SUBMITTED";
  totalEarnings?: number;
  location?: string;
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

export interface PetSchoolItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  totalCourses: number;
  rating: number;
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
  createdAt: string;
  kycStatus?: "APPROVED" | "PENDING" | "REJECTED" | "NOT_SUBMITTED";
  totalEarnings?: number;
  location?: string;
}

export interface PetSchoolsResponse {
  success: boolean;
  message: string;
  data: {
    items: PetSchoolItem[];
    nextCursor: string | null;
  };
}

export interface PetHotelItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  totalRooms: number;
  totalGuests: number;
  rating: number;
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
  createdAt: string;
  kycStatus?: "APPROVED" | "PENDING" | "REJECTED" | "NOT_SUBMITTED";
  totalEarnings?: number;
  location?: string;
}

export interface PetHotelsResponse {
  success: boolean;
  message: string;
  data: {
    items: PetHotelItem[];
    nextCursor: string | null;
  };
}

export interface PetVendorItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  totalProducts: number;
  totalOrders: number;
  rating: number;
  status: "ACTIVE" | "BANNED" | "SUSPENDED";
  createdAt: string;
  kycStatus?: "APPROVED" | "PENDING" | "REJECTED" | "NOT_SUBMITTED";
  totalEarnings?: number;
  location?: string;
}

export interface PetVendorsResponse {
  success: boolean;
  message: string;
  data: {
    items: PetVendorItem[];
    nextCursor: string | null;
  };
}

export interface FinanceStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalRevenue: number;
    totalPlatformFees: number;
    activeUsers: number;
    totalBookings: number;
  };
}

export interface GrowthAnalyticsItem {
  name: string;
  users: number;
  bookings: number;
}

export interface GrowthAnalyticsResponse {
  success: boolean;
  message: string;
  data: GrowthAnalyticsItem[];
}

export interface CategoryAnalyticsItem {
  category: string;
  revenue: number;
  bookings: number;
}

export interface CategoryAnalyticsResponse {
  success: boolean;
  message: string;
  data: CategoryAnalyticsItem[];
}

export interface TransactionItem {
  id: string;
  provider: {
    name: string;
    type: "Pet Sitter" | "Pet Hotel" | "Pet School" | "Vendor";
  };
  serviceType: string;
  bookingId: string;
  completionDate: string;
  amount: number;
  platformFee: number;
  status: "PENDING" | "RELEASED" | "ON_HOLD";
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    items: TransactionItem[];
    nextCursor: string | null;
    total?: number;
  };
}
