// Common types shared across the application

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface SuccessResponse {
  message: string;
  status: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface CursorPagination {
  cursor: string | null;

  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
