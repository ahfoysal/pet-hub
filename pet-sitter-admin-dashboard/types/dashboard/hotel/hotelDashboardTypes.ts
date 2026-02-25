// Hotel dashboard stats & charts types

export interface DashboardStats {
  totalActiveBookings: number;
  avgOccupancyRate: number;
  avgStayDurationDays: number;
  totalRevenue: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface DashboardCharts {
  monthlyBookingTrend: ChartData;
  weeklyOccupancyRate: ChartData;
  roomTypeDistribution: ChartData;
}

export interface DashboardData {
  stats: DashboardStats;
  charts: DashboardCharts;
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data?: DashboardData;
}
