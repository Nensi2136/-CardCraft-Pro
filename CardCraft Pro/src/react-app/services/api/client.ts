import { API_CONFIG } from './config';
import { ApiResponse, User, RequestOptions } from '../types/api';

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL.replace(/\/+$/, ''); // Remove trailing slashes
    this.timeout = timeout;
    this.defaultHeaders = {
      ...API_CONFIG.HEADERS,
    };
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        message: data.message || `Request failed with status ${response.status}`,
        errors: data.errors || [],
      };
    }

    return {
      success: true,
      statusCode: response.status,
      data: data,
    };
  }

  /**
   * Make an API request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { body, auth = true, headers = {}, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Prepare headers
    const requestHeaders: HeadersInit = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Add auth token if required
    if (auth) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            message: 'Request timed out. Please check your connection and try again.',
          };
        }
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // HTTP Methods
  public async get<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
    return this.request<T>('GET', endpoint, options);
  }

  public async post<T>(endpoint: string, body?: unknown, options: RequestOptions = {}) {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  public async put<T>(endpoint: string, body?: unknown, options: RequestOptions = {}) {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  public async patch<T>(endpoint: string, body?: unknown, options: RequestOptions = {}) {
    return this.request<T>('PATCH', endpoint, { ...options, body });
  }

  public async delete<T>(endpoint: string, options: RequestOptions = {}) {
    return this.request<T>('DELETE', endpoint, options);
  }

  // Auth methods
  public async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await this.post<{ token: string; user: User }>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials,
      { auth: false }
    );

    if (response.success && response.data) {
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
    }

    return response;
  }

  public logout(): void {
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }

  public async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      return {
        success: false,
        message: 'No refresh token available',
      };
    }

    const response = await this.post<{ token: string }>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
      { auth: false }
    );

    if (response.success && response.data) {
      localStorage.setItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    }

    return response;
  }

  public getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  public isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          statusCode: response.status,
          message: errorText || `HTTP error! status: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        statusCode: response.status,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            statusCode: 408,
            message: 'Request timeout',
          };
        }
        return {
          success: false,
          statusCode: 500,
          message: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        message: 'Unknown error occurred',
      };
    }
  }
}

export const apiClient = new ApiClient();
