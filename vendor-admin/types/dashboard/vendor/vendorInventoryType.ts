// Stats
export interface VendorStats {
  totalProducts: number;
  totalStock: number;
  totalUnitsSold: number;
  totalRevenue: number;
  averageRating: number;
  totalTransactions: number;
  totalPayouts: number;
  totalOrders: number;
  totalPendingOrders: number;
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

export interface InventoryItem {
  orderId: string;
  productName: string;
  customerName: string;
  quantity: number;
  amount: number;
  date: string;
  stock: number;
  status: string;
}

export interface BestSellingProduct {
  rank: number;
  productId: string;
  productName: string;
  productImage: string;
  unitsSold: number;
  revenue: number;
}

export interface VendorInventoryData {
  stats: VendorStats;
  bestSellingProducts: BestSellingProduct[];
  inventorySummary: InventorySummary;
  recentActivity: RecentActivity[];
  detailedList: InventoryItem[];
}

// API response wrapper
export interface VendorInventoryResponse {
  success: boolean;
  message: string;
  data: VendorInventoryData;
}
