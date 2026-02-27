// Pet Sitter Package Types

export interface PackageService {
  id: string;
  name: string;
  price: string;
}

export interface SitterPackage {
  id: string;
  name: string;
  description: string;
  image: string;
  durationInMinutes: number;
  calculatedPrice: string;
  offeredPrice: string;
  isAvailable: boolean;
  services?: PackageService[];
  isOwner?: boolean;
  isDeleted?: boolean;
  petSitterId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SitterPackageListItem {
  id: string;
  name: string;
  description?: string;
  image: string;
  offeredPrice: string;
  calculatedPrice: string;
  durationInMinutes: number;
  isAvailable: boolean;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt: string;
  services?: PackageService[];
}

export interface SitterPackageApiResponse {
  success: boolean;
  message?: string;
  data?: {
    data: SitterPackageListItem[];
    nextCursor: string | null;
  };
}

export interface SitterPackageDetailsResponse {
  success: boolean;
  message?: string;
  data: SitterPackage;
}

export interface CreatePackageResponse {
  success: boolean;
  message?: string;
  data: SitterPackage;
}

export interface TogglePackageResponse {
  success: boolean;
  message: string;
}
