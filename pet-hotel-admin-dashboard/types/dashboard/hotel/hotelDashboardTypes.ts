// Hotel dashboard stats & charts types

export interface StatValue {
  value: number;
  growth: string;
}

export interface DashboardStats {
  totalBookings: StatValue;
  activeBookings: StatValue;
  completedBookings: StatValue;
  upcomingCheckins: StatValue;
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
