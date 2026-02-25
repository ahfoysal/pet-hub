export interface User {
  id: string;
  fullName: string;
  image: string | null;
}

export interface PetProfile {
  id: string;
  petName: string;
  profileImg: string;
  breed: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  petType: string;
}

export interface Course {
  id: string;
  name: string;
}

export interface EnrollmentData {
  user: User;
  petProfile: PetProfile;
  course: Course;
  enrolledAt: string | null;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export interface GetALlStudentResponse {
  success: boolean;
  message: string;
  data: EnrollmentData[];
}
