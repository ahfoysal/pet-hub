export interface ProviderCategoryLevel {
  id: string;
  name: string;
  bookingThreshold: number;
  benefits: string | null;
}

export interface PlatformSettings {
  id: string;
  platformFee: string;
  commissionRate: string;
  freeCancellationWindow: number;
  refundPercentage: string;
  isKycAutomatic: boolean;
  isEmailNotificationEnabled: boolean;
  isTwoFactorEnabled: boolean;
  providerCategoryLevels: ProviderCategoryLevel[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettingsHistoryUpdatedBy {
  id: string;
  fullName: string;
  email: string;
}

export interface PlatformSettingsHistoryItem {
  id: string;
  platformFeeOld: string | null;
  platformFeeNew: string | null;
  commissionRateOld: string | null;
  commissionRateNew: string | null;
  updatedAt: string;
  version: number;
  updatedBy: PlatformSettingsHistoryUpdatedBy;
}

export interface GetPlatformSettingsResponse {
  success: boolean;
  message: string;
  data: PlatformSettings;
}

export interface UpdatePlatformSettingsRequest {
  platformFee?: number;
  commissionRate?: number;
  freeCancellationWindow?: number;
  refundPercentage?: number;
  isKycAutomatic?: boolean;
  isEmailNotificationEnabled?: boolean;
  isTwoFactorEnabled?: boolean;
  providerCategoryLevels?: Partial<ProviderCategoryLevel>[];
}

export interface UpdatePlatformSettingsResponse {
  success: boolean;
  message: string;
}

export interface GetPlatformSettingsHistoryParams {
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface GetPlatformSettingsHistoryResponse {
  success: boolean;
  message: string;
  data: {
    items: PlatformSettingsHistoryItem[];
    nextCursor: string | null;
  };
}
