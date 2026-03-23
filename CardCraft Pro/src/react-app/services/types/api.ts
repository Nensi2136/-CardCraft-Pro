// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Template Types
export interface CardTemplate {
  id: number;
  name: string;
  description: string;
  templateData: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt?: string;
  filePath?: string;
  isPremium?: boolean;
  title?: string;
}

// Payment Types
export interface Payment {
  id: string;
  userId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentIntentId: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  id: string;
  userId: number;
  templateId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'id' | 'username' | 'email'>;
}

// API Error Type
export interface ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Query Params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TemplateQueryParams extends PaginationParams {
  category?: string;
  isPremium?: boolean;
  search?: string;
}

// Request Options
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
}
