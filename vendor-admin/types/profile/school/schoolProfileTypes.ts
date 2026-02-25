// School profile related types

export interface SchoolProfileSetupRequest {
  name: string;
  phone: string;
  email: string;
  description: string;
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
  images: string[];
}

export interface SchoolProfileSetupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    description: string;
    address: {
      streetAddress: string;
      city: string;
      country: string;
      postalCode: string;
    };
    images: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface SchoolProfileApiResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    description: string;
    address: {
      streetAddress: string;
      city: string;
      country: string;
      postalCode: string;
    };
    images: string[];
    createdAt: string;
    updatedAt: string;
  };
}