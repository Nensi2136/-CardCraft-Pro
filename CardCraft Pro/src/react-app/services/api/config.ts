// API Configuration
const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  // Use environment variable if set, otherwise default to local development URL
  BASE_URL: isDevelopment 
    ? 'http://localhost:5021/api' 
    : '/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000, // 30 seconds
  
  // API endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: '/login',
      REGISTER: '/register',
      PROFILE: '/auth/me',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    
    // User management endpoints
    USERS: {
      BASE: '/users',
      BY_ID: (id: string | number) => `/users/${id}`,
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
    },
    
    // Template endpoints
    TEMPLATES: {
      BASE: '/templates',
      BY_ID: (id: string) => `/templates/${id}`,
      CATEGORIES: '/templates/categories',
      SEARCH: '/templates/search',
      FEATURED: '/templates/featured',
    },
    
    // Payment endpoints
    PAYMENTS: {
      BASE: '/payments',
      CREATE_INTENT: '/payments/create-intent',
      VERIFY: (id: string) => `/payments/${id}/verify`,
      HISTORY: '/payments/history',
    },
    
    // Review endpoints
    REVIEWS: {
      BASE: '/reviews',
      TEMPLATE_REVIEWS: (templateId: string) => `/reviews/template/${templateId}`,
      USER_REVIEWS: '/reviews/user',
    },
  },
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'userData',
  },
} as const;
