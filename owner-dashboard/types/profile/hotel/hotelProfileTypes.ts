// Hotel profile settings related types

export interface HotelProfileSetupRequest {
  name: string;
  email: string;
  phone: string;
  description: string;
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
  dayStartingTime: string;
  dayEndingTime: string;
  nightStartingTime: string;
  nightEndingTime: string;
  images: string[];
}

export interface HotelProfileSetupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    description: string;
    address: {
      streetAddress: string;
      city: string;
      country: string;
      postalCode: string;
    };
    dayStartingTime: string;
    dayEndingTime: string;
    nightStartingTime: string;
    nightEndingTime: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface HotelProfileApiResponse {
  success: boolean;
  message?: string;
  data?: HotelProfileType;
}


// Hotel profile page  related types

export interface HotelProfileType {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  images: string[];
  dayStartingTime: string;
  dayEndingTime: string;
  nightStartingTime: string;
  nightEndingTime: string;
  status: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  analytics: null;
  createdAt: string;
  updatedAt: string;
  addresses: Array<{
    id: string;
    city: string;
    country: string;
    streetAddress: string;
    postalCode: string;
  }>;
}
