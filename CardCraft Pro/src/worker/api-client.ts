// API client for React app to communicate with Cloudflare Workers API gateway

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // User endpoints
  async getUsers() {
    return this.request<{ users: unknown[] }>('/api/users');
  }

  async createUser(userData: unknown) {
    return this.request<{ message: string; user: unknown }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Proxy to external APIs
  async proxyRequest(endpoint: string, options: RequestInit = {}) {
    return this.request<unknown>(`/api/proxy${endpoint}`, options);
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Hook for React components
export function useApi() {
  return {
    healthCheck: () => apiClient.healthCheck(),
    getUsers: () => apiClient.getUsers(),
    createUser: (userData: unknown) => apiClient.createUser(userData),
    proxyRequest: (endpoint: string, options?: RequestInit) => 
      apiClient.proxyRequest(endpoint, options),
  };
}
