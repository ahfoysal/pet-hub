// Profile settings related types

// Vendor profile setup request and response types
export interface VendorProfileSetupRequest {
  name: string;
  phone: string;
  email: string;
  description: string;
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
  images?: File;
}

export interface VendorProfileSetupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    description: string;
    address: Address;
    createdAt: string;
    updatedAt: string;
  };
}

// Get vendor profile API response
export interface Address {
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
}

// Pet School profile setup request and response types
export interface SchoolProfileSetupRequest {
  designation: string;
  bio: string;
  yearsOfExperience: number;
  languages: string[];
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
  images?: File;
}

export interface SchoolProfileSetupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    designation: string;
    bio: string;
    yearsOfExperience: number;
    languages: string[];
    address: Address;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetProfileApiResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    userName: string;
    email: string;
    role: string;
    fullName: string;
    image?: string;
    phone?: string;
    isEmailVerified: boolean;
    hasProfile?: boolean;
    description?: string;
    address?: Address;
  };
}
