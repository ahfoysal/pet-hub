export interface DashboardChartsResponse {
  success: boolean;
  message: string;
  data: DashboardChartsData;
}

export interface DashboardChartsData {
  stats: DashboardStats;
  enrollmentTrend: EnrollmentTrendItem[];
  courseWiseEnrollments: CourseWiseEnrollment[];
  trainerPerformance: TrainerPerformance[];
  enrollmentStatusDistribution: EnrollmentStatusDistribution[];
}

export interface DashboardStats {
  totalPetsEnrolled: number;
  activeCourses: number;
  ongoingEnrollments: number;
  availableSeatsToday: number;
}

export interface EnrollmentTrendItem {
  date: string;
  count: number;
}

export interface CourseWiseEnrollment {
  courseName: string;
  students: number;
}

export interface TrainerPerformance {
  trainerName: string;
  students: number;
}

export interface EnrollmentStatusDistribution {
  status: string;
  count: number;
}
