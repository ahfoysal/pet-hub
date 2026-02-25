// Sitter profile related types

export interface SitterProfileSetupRequest {
  designation: string;
  bio: string;
  yearsOfExperience: number;
  languages: string[];
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface SitterProfileSetupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    designation: string;
    bio: string;
    yearsOfExperience: number;
    languages: string[];
    address: {
      streetAddress: string;
      city: string;
      country: string;
      postalCode: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface SitterProfileApiResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    designation: string;
    bio: string;
    yearsOfExperience: number;
    languages: string[];
    address: {
      streetAddress: string;
      city: string;
      country: string;
      postalCode: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}