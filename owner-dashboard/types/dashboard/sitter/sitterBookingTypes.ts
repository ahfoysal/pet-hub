// Pet Sitter Booking Types

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "LATE"
  | "REQUEST_TO_COMPLETE"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type BookingType = "PACKAGE" | "SERVICE";

export interface BookingPet {
  name: string;
  image: string;
  age: string;
}

export interface BookingPetSitterAddress {
  id: string;
  petSitterId: string;
  streetAddress: string;
  city: string;
  country: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingPetSitter {
  name: string;
  image: string;
  address: BookingPetSitterAddress | null;
}

export interface BookingCancelInfo {
  reason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
}

export interface BookingCompletionInfo {
  completionNote?: string;
  files?: string[];
  completedAt?: string;
}

// List item from GET /pet-sitter-booking/pet-sitter/my-bookings
export interface SitterBookingListItem {
  id: string;
  bookingType: BookingType;
  price: number;
  grandTotal: number;
  platformFee: number;
  image: string;
  petOwnerName: string;
  status: BookingStatus;
  bookingStatus: BookingStatus;
  pets: BookingPet[];
  servicesInPackage: string[];
  dateTime: string;
  cancelInfo: BookingCancelInfo | null;
}

// Full detail from GET /pet-sitter-booking/{id}
export interface SitterBookingDetail {
  name: string;
  image: string;
  bookingType: BookingType;
  location: string;
  dateTime: string;
  bookingStatus: BookingStatus;
  petSitter: BookingPetSitter;
  pets: BookingPet[];
  servicesInPackage: string[];
  price: number;
  grandTotal: number;
  platformFee: number;
  cancelInfo: BookingCancelInfo | null;
  completionInfo: BookingCompletionInfo | null;
}

// API Responses
export interface SitterBookingsApiResponse {
  success: boolean;
  message: string;
  data: {
    data: SitterBookingListItem[];
    nextCursor: string | null;
  };
}

export interface SitterBookingDetailResponse {
  success: boolean;
  message: string;
  data: SitterBookingDetail;
}

export interface SitterBookingActionResponse {
  success: boolean;
  message: string;
}

// Query params for listing bookings
export interface SitterBookingListParams {
  limit?: number;
  cursor?: string;
  status?: BookingStatus | "";
  bookingType?: BookingType | "";
}
