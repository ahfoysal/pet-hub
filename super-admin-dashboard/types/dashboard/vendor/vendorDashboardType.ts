export interface VendorDashboardResponse {
  success: boolean;
  message: string;
  data: {
    totalProducts: number;
    totalStock: number;
    totalUnitsSold: number;
    totalRevenue: number;
    averageRating: number;
    charts: {
      revenueChart: {
        labels: string[];
        data: number[];
      };
      unitsSoldChart: {
        labels: string[];
        data: number[];
      };
      ratingChart: {
        labels: string[];
        data: number[];
      };
    };
  };
}
