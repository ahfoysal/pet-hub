export interface PetProfile {
  id: string;
  petName: string;
  petType: string;
  breed: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: string;
  dateOfBirth: string;
  color: string;
  weight: string;
  profileImg: string | null;
  recentImages: string[];
  rabiesStatus: "DUE" | "UPDATED" | "NOT_UPDATED" | "UNKNOWN";
  dhppStatus: "UPDATED" | "DUE" | "NOT_UPDATED" | "UNKNOWN";
  bordetellaStatus: "UPDATED" | "DUE" | "NOT_UPDATED" | "UNKNOWN";
  allergies: string;
  temperament: string;
  isGoodWithKids: boolean;
  isGoodWithOtherPets: boolean;
  feedingInstructions: string;
  specialNotes: string;
  vetDoctorName: string;
  vetDoctorPhone: string;
  ownerId: string;
  ownerUserId: string;
  ownerName: string;
  ownerImage: string | null;
  ownerUserName: string;
}

export interface PetProfileResponse {
  success: boolean;
  message: string;
  data: PetProfile;
}
