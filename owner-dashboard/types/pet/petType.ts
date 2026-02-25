export interface PetProfile {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  gender: string;
  characteristics: string[];
  medicalHistory: string;
  vaccinationStatus: string;
  image?: string;
  ownerId: string;
}
