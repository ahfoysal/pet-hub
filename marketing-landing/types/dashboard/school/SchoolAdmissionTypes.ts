export type UUID = string;

export type AdmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PetProfile {
  id: UUID;
  petName: string;
  petType: string;
  breed: string;
  profileImg: string | null;
}

export interface User {
  id: UUID;
  fullName: string;
  image: string | null;
}

export interface CourseBasic {
  id: UUID;
  name: string;
}

export interface CourseDetails {
  id: UUID;
  avgRating: number;
  name: string;
  courseObjective: string;
  classPerWeek: number;
  duration: number;
  price: number;
}

export interface Schedule {
  id: UUID;
  time: string;
}

export interface GetAllAdmissionItem {
  id: UUID;
  paymentId: UUID | null;
  petProfile: PetProfile;
  user: User;
  course: CourseBasic;
  schedule: Schedule;
  status: AdmissionStatus;
  createdAt: string;
}

export interface GetAllAdminAdmissionResponse {
  success: boolean;
  message: string;
  data: GetAllAdmissionItem[];
}

export interface GetAdmissionByIdData {
  id: UUID;
  petProfile: PetProfile;
  status: AdmissionStatus;
  course: CourseDetails;
  createdAt: string;
}

export interface GetAdmissionByIdResponse {
  success: boolean;
  message: string;
  data: GetAdmissionByIdData;
}

export interface ManageAdmissionRequest {
  status: "APPROVED" | "REJECTED";
}

export interface ManageAdmissionResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
