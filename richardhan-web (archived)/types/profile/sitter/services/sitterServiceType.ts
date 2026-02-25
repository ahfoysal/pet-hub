import { CursorPagination, PaginationParams } from "../../../common/commonType";
// sitter serves types

// Get Sitter Services
export interface SitterService {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
  thumbnailImage: string;
  whatsIncluded: string[];
  tags: string[];
  isAvailable: boolean;
  petSitterId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SitterServiceApiResponse {
  success: boolean;
  message?: string;
  data?: {
    data: SitterService[];
    pagination: PaginationParams;
  };
}

// create service type

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  duration?: number;
  file?: File;
  whatsIncluded: string[];
  tags: string[];
}

// update service type
export interface UpdateServiceRequest {
  name: string;
  description: string;
  price: number;
  durationInMinutes?: number;
  file?: File;
  whatsIncluded: string[];
  tags: string[];
}

export interface CreateServiceResponse {
  success: boolean;
  message?: string;
  data: SitterService | null;
}
