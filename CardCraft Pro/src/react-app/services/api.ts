// API Service for connecting React to .NET Core API Gateway

// Use full URL in development, relative path in production
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? (import.meta.env.VITE_API_URL || 'http://localhost:5021/api') : '/api';

// Add CORS debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', isDevelopment ? 'Development' : 'Production');

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface User {
  user_Id: number; // Changed from id to user_Id
  username: string; // Added username field
  name?: string; // Optional name field for compatibility
  email: string;
  password_hash?: string; // Added password_hash field
  is_premium?: boolean; // Changed from isPremium to is_premium
  is_admin?: boolean; // Changed from isAdmin to is_admin
  created_at: string; // Changed from createdAt to created_at
  updated_at?: string; // Added updated_at field
}

export interface CardTemplate {
  Template_Id: number;
  Category_Id: number;
  Title: string;
  Card_Template_Description: string;
  File_Path: string;
  ImageUrl: string;
  Is_premium: boolean;
  Created_at: string;
  Updated_at: string;
}

export interface CreateCardTemplate {
  name: string;
  description: string;
  templateData: string;
  categoryId: number;
  isPremium: boolean;
}

import { PaymentDto } from './paymentService';

export interface Payment {
  id: number;
  userId: number;
  accountNumber: number;
  cvv: number;
  expiryDate: string;
  amount: number;
  paymentDate: string;
  status?: string;
  processedDate?: string;
  transactionId?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Generic request method with error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Ensure endpoint doesn't start with a slash to prevent double slashes
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const url = `${this.baseURL}/${normalizedEndpoint}`;
      
      console.log('API Request URL:', url);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      console.log('API Request:', {
        url,
        method: options.method || 'GET',
        headers: config.headers,
        baseURL: this.baseURL,
        endpoint,
        body: options.body ? JSON.parse(options.body as string) : 'No body'
      });

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        const contentType = response.headers.get('content-type') || '';
        console.error('API Error Response:', {
          url,
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: errorText,
        });

        let errorJson: {
          message?: string;
          title?: string;
          detail?: string;
          errors?: string[] | Record<string, string[]>;
        } | undefined = undefined;
        if (errorText && contentType.toLowerCase().includes('json')) {
          try {
            errorJson = JSON.parse(errorText);
          } catch {
            errorJson = undefined;
          }
        }

        const message =
          errorJson?.message ||
          errorJson?.title ||
          errorJson?.detail ||
          (typeof errorJson === 'string' ? errorJson : undefined) ||
          (errorText ? errorText.slice(0, 500) : undefined) ||
          `HTTP error! status: ${response.status}`;

        const errors = (() => {
          if (Array.isArray(errorJson?.errors)) return errorJson.errors;
          if (errorJson?.errors && typeof errorJson.errors === 'object') {
            const entries = Object.entries(errorJson.errors as Record<string, string[]>);
            const flattened: string[] = [];
            for (const [field, msgs] of entries) {
              if (Array.isArray(msgs)) {
                for (const m of msgs) flattened.push(`${field}: ${String(m)}`);
              } else if (msgs != null) {
                flattened.push(`${field}: ${String(msgs)}`);
              }
            }
            return flattened;
          }
          return undefined;
        })();

        const normalizedErrors = (() => {
          const base = errors
            ?.map((e: string) => (typeof e === 'string' ? e : JSON.stringify(e)))
            .filter(Boolean);

          if (base && base.length > 0) return base;
          if (errorText) return [errorText.slice(0, 500)];
          return undefined;
        })();

        return {
          success: false,
          message,
          errors: normalizedErrors,
        };
      }

      if (response.status === 204) {
        return {
          success: true,
          data: undefined,
        };
      }

      const rawText = await response.text();
      const data = rawText ? (JSON.parse(rawText) as T) : undefined;
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      // Ensure endpoint doesn't start with a slash to prevent double slashes (same as request method)
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const url = `${this.baseURL}/${normalizedEndpoint}`;
      const token = localStorage.getItem('authToken');
      
      console.log('API Upload URL:', url);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Add additional form data if provided
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        console.error('Validation errors:', errorData.errors);
        console.error('Error type:', errorData.type);
        console.error('Error title:', errorData.title);
        console.error('Error traceId:', errorData.traceId);
        throw new Error(errorData.message || errorData.title || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('File Upload Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// API Service Functions
export const apiService = {
  // User Service
  users: {
    // Basic CRUD operations
    getProfile: () =>
      apiClient.get<User>('UserServiceAPI/v1/Users'),
      
    updateProfile: (userData: Partial<User>) =>
      apiClient.put<User>('UserServiceAPI/v1/profile', userData),
    
    // Admin user management endpoints
    getAllUsers: () =>
      apiClient.get<User[]>('UserServiceAPI/v1/users'),
    
    getUserById: (id: string) =>
      apiClient.get<User>(`UserServiceAPI/v1/users/${id}`),
    
    deleteUser: (id: string) =>
      apiClient.delete(`UserServiceAPI/v1/users/${id}`),
      
    // Authentication endpoints
    login: async (credentials: { email: string; password: string }) => {
      console.log('Login attempt with:', credentials.email);
      
      // Backend now handles both email and username automatically
      const response = await apiClient.post<{ token: string; user: User }>('login', {
        Username: credentials.email, // Send email as username - backend will handle it
        Password: credentials.password
      });
      
      console.log('Login response:', response.success ? 'Success' : 'Failed');
      
      return response;
    },
      
    register: (userData: { 
      username: string; 
      email: string; 
      password: string; 
      firstName?: string; 
      lastName?: string; 
      phoneNumber?: string;
    }) =>
      apiClient.post<{ user: User }>('register', userData),
      
    toggleUserStatus: (id: string, isActive: boolean) =>
      apiClient.put(`UserServiceAPI/v1/users/${id}/status`, { isActive }),
    
    upgradeToPremium: (id: string, expiryDate: string) =>
      apiClient.put(`UserServiceAPI/v1/users/${id}/premium`, { expiryDate }),
  },

  // Card Templates Service
  cards: {
    // Basic CRUD operations
    getTemplates: (category?: string) =>
      apiClient.get<CardTemplate[]>(`cards/templates${category ? `?category=${category}` : ''}`),
    
    getTemplateById: (id: string) =>
      apiClient.get<CardTemplate>(`cards/templates/${id}`),
      
    createTemplate: (templateData: CreateCardTemplate) =>
      apiClient.post<CardTemplate>('cards/templates', templateData),
      
    updateTemplate: (id: string, templateData: Partial<CardTemplate> | { Title?: string; Card_Template_Description?: string; CategoryId?: number; Is_premium?: boolean; File_Path?: string; }) =>
      apiClient.put<CardTemplate>(`cards/templates/${id}`, templateData),
      
    deleteTemplate: (id: string) =>
      apiClient.delete(`cards/templates/${id}`),
    
    // Category operations
    getCategories: () =>
      apiClient.get<{category_Id: number; category_Name: string; category_Description: string; templateCount: number; created_at: string; updated_at: string}[]>('cards/categories'),
    
    createCategory: (categoryData: { name: string; description: string }) =>
      apiClient.post<{category_Id: number; category_Name: string; category_Description: string}>('cards/categories', {
        category_Name: categoryData.name,
        category_Description: categoryData.description,
        name: categoryData.name,
        description: categoryData.description,
        Name: categoryData.name,
        Description: categoryData.description,
        categoryName: categoryData.name,
        CategoryName: categoryData.name,
      }),
    
    updateCategory: (id: string, categoryData: { name: string; description: string }) =>
      apiClient.put<{category_Id: number; category_Name: string; category_Description: string}>(`cards/categories/${encodeURIComponent(id)}`, {
        category_Name: categoryData.name,
        category_Description: categoryData.description,
        name: categoryData.name,
        description: categoryData.description,
        Name: categoryData.name,
        Description: categoryData.description,
        categoryName: categoryData.name,
        CategoryName: categoryData.name,
      }),
    
    deleteCategory: (id: string) =>
      apiClient.delete(`cards/categories/${encodeURIComponent(id)}`),
    
    uploadBackgroundImage: (file: File, _templateId: string, existingImagePath?: string) => {
      console.log('=== UPLOAD DEBUG ===');
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      console.log('ExistingImagePath:', existingImagePath);
      console.log('TemplateId:', _templateId);
      
      const formData = new FormData();
      formData.append('file', file);
      if (existingImagePath) {
        formData.append('existingImagePath', existingImagePath);
        console.log('Added existingImagePath to FormData:', existingImagePath);
      } else {
        console.log('No existingImagePath provided');
      }
      
      // Use a simple upload endpoint
      console.log('Calling upload with endpoint: upload');
      console.log('=== END UPLOAD DEBUG ===');
      
      return apiClient.uploadFile<{imageUrl: string}>(
        `upload`,
        file,
        { existingImagePath }
      );
    },
  },

  // Payment Service
  payments: {
    // Basic CRUD operations
    getPaymentStatus: (paymentId: string) =>
      apiClient.get<{status: string; amount: number; paidAt?: string}>(`payments/${paymentId}/status`),
    
    getUserPayments: () =>
      apiClient.get<Payment[]>('payments'),
    
    // Admin operations
    getAllPayments: () =>
      apiClient.get<Payment[]>('payments'),
    
    createPayment: (paymentData: { 
    userId: number; 
    accountNumber: number;
    cvv: number;
    expiryDate: string;
    amount: number;
  }) =>
      apiClient.post<PaymentDto>('payments', paymentData),
  },

  // Review Service
  reviews: {
    // Basic CRUD operations
    getReviews: (templateId?: string) =>
      apiClient.get<Array<{id: string; userId: string; templateId: string; rating: number; comment: string; createdAt: string; isApproved: boolean; userName: string; userEmail: string; templateName: string}>>(
        `reviews${templateId ? `?templateId=${templateId}` : ''}`
      ),
    
    getDashboardData: () =>
      apiClient.get<{totalReviews: number; verifiedReviews: number; pendingReviews: number; averageRating: number; ratingDistribution: object}>('dashboard/statistics'),
    
    // Admin review management
    getAllReviews: () =>
      apiClient.get<Array<{id: string; userId: string; templateId: string; rating: number; comment: string; createdAt: string; isApproved: boolean; userName: string; userEmail: string; templateName: string}>>('reviews'),
    
    approveReview: (id: string) =>
      apiClient.put(`reviews/${id}/approve`, {}),
    
    unapproveReview: (id: string) =>
      apiClient.put(`reviews/${id}/unapprove`, {}),
    
    deleteReview: (id: string) =>
      apiClient.delete(`reviews/${id}`),
  },
  
  // Contact Service
  contact: {
    // Basic CRUD operations for contact messages
    getMessages: () =>
      apiClient.get<ContactMessage[]>('contactus'),
    
    getMessageById: (id: string) =>
      apiClient.get<ContactMessage>(`contactus/${id}`),
    
    updateMessageStatus: (id: string, status: ContactMessage['status']) =>
      apiClient.put<ContactMessage>(`contactus/${id}/status`, { status }),
    
    deleteMessage: (id: string) =>
      apiClient.delete(`contactus/${id}`),
    
    submitContactForm: (contactData: { name: string; email: string; subject: string; message: string }) =>
      apiClient.post<ContactMessage>('contactus', contactData)
  }
};

export default apiService;
