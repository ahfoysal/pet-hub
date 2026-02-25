// Hotel room management related types

export interface RoomFormData {
  roomNumber: string;
  description: string;
  roomAmenities: string[];
  roomType: string;
  status: string;
  petCapacity: number;
  humanCapacity?: number;
  price: number;
  images: string[];
}

export interface CreateRoomRequest {
  roomNumber: string;
  description: string;
  roomAmenities: string[];
  roomType: string;
  status: string;
  petCapacity: number;
  humanCapacity?: number;
  price: number;
  images: string[];
}

export interface UpdateRoomRequest {
  roomNumber?: string;
  description?: string;
  roomAmenities?: string[];
  roomType?: string;
  status?: string;
  petCapacity?: number;
  humanCapacity?: number;
  price?: number;
  images?: string[];
  prevImages?: string[];
}

export interface RoomApiResponse {
  success: boolean;
  message: string;
  data?: RoomType;
}

export interface RoomsApiResponse {
  success: boolean;
  message: string;
  data?: RoomType[];
}

export interface RoomType {
  id: string;
  hotelProfileId: string;
  roomName: string | null;
  roomNumber: string;
  images: string[];
  description: string;
  roomAmenities: string[];
  roomType: string;
  status: string;
  petCapacity: number;
  humanCapacity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}