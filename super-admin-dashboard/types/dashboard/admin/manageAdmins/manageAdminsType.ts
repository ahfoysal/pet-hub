export interface CreateAdminRequest {
  fullName: string;
  email: string;
}

export interface UpdateAdminRequest {
  adminId: string;
  fullName?: string;
  email?: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role?: string;
  phone: string | null;
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' | 'PENDING';
  createdAt: string;
}

export interface GetAllAdminsResponse {
  success?: boolean;
  message: string;
  data: {
    data: AdminUser[];
    nextCursor: string | null;
    total?: number;
  };
}

export interface AdminAnalyticsData {
  totalAdmins: number;
  activeAdmins: number;
  suspendedAdmins: number;
  totalActionsTaken: number;
}

export interface GetAdminAnalyticsResponse {
  message: string;
  data: AdminAnalyticsData;
}
