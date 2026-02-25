import { Trainer } from "./SchoolTrainersTypes";

export type DiscountType = "PERCENTAGE" | "FLAT";
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type Schedule = {
  id: string;
  courseId: string;
  days: string[];
  time: string;
  availableSeats: number;
  totalSeats: number;
  createdAt: string;
};

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SchoolCourse {
  id: string;
  schoolId: string;
  trainerId: string;
  name: string;
  details: string;
  courseObjective: string;
  outcomes: string[];
  price: number;
  courseFor: string;
  location: string;
  discount?: number;
  discountType?: DiscountType | null;
  duration: number; // in weeks
  classPerWeek: number;
  courseLevel: CourseLevel;
  thumbnailImg?: string | null; // backend string
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  schedules: Schedule[];
  trainer?: Trainer;
  totalSeats?: number;
  availableSeats?: number;
  totalEnrolled?: number;
  avgRating?: number;
  createdAt?: string;
  updatedAt?: string;
}

// GET courses response
export interface GetSchoolCoursesResponse {
  success: boolean;
  message: string;
  data: {
    data: SchoolCourse[];
    meta: PaginationMeta;
  };
}

// POST create course response
export interface CreateSchoolCourseResponse {
  success: boolean;
  message: string;
  data: SchoolCourse;
}

// Form values for frontend
export interface CreateSchoolCoursePayload {
  name: string;
  details: string;
  courseObjective: string;
  outcomes: string[];
  price: number;
  courseFor: string;
  location: string;
  discount?: number;
  discountType?: DiscountType;
  duration: number; // in weeks
  classPerWeek: number;
  trainerId: string;
  courseLevel: CourseLevel;
  image?: File | null;
  startDate: string;
  endDate: string;
  schedules: Schedule[];
}

export interface UpdateSchoolCourseResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    schoolId: string;
    trainerId: string;
    name: string;
    details: string;
    courseObjective: string;
    thumbnailImg?: string | null;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    price: number;
    discount?: number;
    discountType?: DiscountType | null;
    duration: number; // in weeks
    classPerWeek: number;
    location: string;
    courseFor: string;
    outcomes: string[];
    courseLevel: CourseLevel;
    avgRating?: number;
    createdAt: string;
    updatedAt: string;
  };
}
