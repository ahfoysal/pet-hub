export interface Trainer {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  specialization: string[];
  image: string;
  totalCourses: number;
  totalStudents: number;
}

export interface TrainersStats {
  totalTrainers: number;
  totalStudents: number;
  avgRating: number;
}

export interface GetSchoolTrainersResponse {
  success: boolean;
  message: string;
  data: {
    stats: TrainersStats;
    trainers: Trainer[];
  };
}

// Post Request
// POST create trainer response
export interface CreateSchoolTrainerResponse {
  success: boolean;
  message: string;
  data: Trainer;
}

// Form values (frontend only)
export interface CreateSchoolTrainerPayload {
  name: string;
  email: string;
  phone: string;
  image: File;
}
