// Stats
export interface VendorStats {
  totalProducts: number;
  totalStock: number;
  totalUnitsSold: number;
  totalRevenue: number;
  averageRating: number;
}

// Inventory summary
export interface InventorySummary {
  inStock: number;
  outOfStock: number;
  published: number;
  unpublished: number;
  averageRating: number;
  lowStockItems: number;
}

// Recent activity
export interface RecentActivity {
  type: "PRODUCT" | string;
  title: string;
  description: string;
  time: string; // ISO date string
}

// Main dashboard data
export interface VendorInventoryData {
  stats: VendorStats;
  bestSellingProducts: unknown[]; // replace with a proper type if available
  inventorySummary: InventorySummary;
  recentActivity: RecentActivity[];
}

// API response wrapper
export interface VendorInventoryResponse {
  success: boolean;
  message: string;
  data: VendorInventoryData;
}
