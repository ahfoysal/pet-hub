export interface ScheduleItem {
  courseName: string;
  time: string; 
  availableSeats: number;
  totalSeats: number;
}

export interface DaySchedule {
  date: string;
  weekday: string; 
  schedules: ScheduleItem[];
}

export interface NextSchedulesResponse {
  success: boolean;
  message: string;
  data: DaySchedule[];
}

export interface UpcomingSchedule {
  date: string; 
  weekday: string;
  courseName: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
}
