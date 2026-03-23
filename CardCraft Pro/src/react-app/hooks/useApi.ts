import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiResponse } from '../services/api';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// Hook for user authentication
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      // Restore user data from localStorage
      try {
        const user = JSON.parse(userData);
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setLoading(false);
      }
    } else if (token) {
      // Verify token and get user profile (fallback)
      apiService.users.getProfile().then(response => {
        if (response.success && response.data) {
          const transformedUserData = {
            id: response.data.user_Id?.toString() || '1',
            name: response.data.username || response.data.name || response.data.email?.split('@')[0] || 'User',
            email: response.data.email,
            role: response.data.is_admin ? 'admin' : (response.data.is_premium ? 'Premium User' : 'Free User'),
            isAdmin: response.data.is_admin,
            isPremium: response.data.is_premium,
            created_at: response.data.created_at
          };
          setUser(transformedUserData);
          setIsAuthenticated(true);
          localStorage.setItem('userData', JSON.stringify(transformedUserData));
        }
      }).catch(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    console.log('Login attempt with credentials:', credentials.email);
    
    try {
      const response = await apiService.users.login(credentials);
      console.log('API Response:', response);
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        console.log('Login successful, user data:', userData);
        console.log('User data properties:', Object.keys(userData));
        console.log('Has is_admin:', 'is_admin' in userData);
        console.log('is_admin value:', userData.is_admin);
        console.log('is_premium value:', userData.is_premium);
        
        localStorage.setItem('authToken', token);
        
        // Transform API response to match our app's expected format
        const transformedUserData = {
          id: userData.user_Id?.toString() || '1',
          name: userData.username || userData.name || userData.email?.split('@')[0] || 'User',
          email: userData.email,
          role: userData.is_admin ? 'admin' : (userData.is_premium ? 'Premium User' : 'Free User'),
          isAdmin: userData.is_admin,
          isPremium: userData.is_premium,
          created_at: userData.created_at
        };
        
        console.log('Transformed user data:', transformedUserData);
        
        setUser(transformedUserData);
        setIsAuthenticated(true);
        
        // Store user data in localStorage for persistence and role checking
        localStorage.setItem('userData', JSON.stringify(transformedUserData));
        
        return { success: true };
      } else {
        console.log('API login failed, response:', response);
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed: ' + (error instanceof Error ? error.message : 'Unknown error') };
    }
  }, []);

  const logout = useCallback((redirectPath?: string) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    
    // If a redirect path is provided, navigate there
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  }, []);

  return { user, isAuthenticated, loading, login, logout };
}

// Hook for card templates
export function useCardTemplates(category?: string) {
  return useApi(
    () => apiService.cards.getTemplates(category),
    [category]
  );
}

// Hook for payment processing
export function usePayment() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(async (paymentData: {
    amount: number;
    paymentMethod: string;
    cardDetails?: {
      number?: string;
      exp_month?: number;
      exp_year?: number;
      cvc?: string;
    };
  }) => {
    setProcessing(true);
    setError(null);

    try {
      // Add required userId and currency
      const completePaymentData = {
        userId: 1, // TODO: Get from auth context
        amount: paymentData.amount,
        currency: 'USD',
        paymentMethod: paymentData.paymentMethod,
        paymentDetails: paymentData.cardDetails
      };
      
      const response = await apiService.payments.createPayment(completePaymentData);
      if (response.success) {
        // Store payment completion for premium features
        localStorage.setItem('premiumPaymentCompleted', 'true');
        return { success: true, payment: response.data };
      } else {
        setError(response.message || 'Payment failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setProcessing(false);
    }
  }, []);

  return { processPayment, processing, error };
}

// Hook for file uploads
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File,
    uploadType: 'background' | 'logo',
    additionalData?: Record<string, any>
  ) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      let response;
      
      if (uploadType === 'background') {
        response = await apiService.cards.uploadBackgroundImage(file, additionalData?.templateId || '');
      } else {
        // For logo uploads, you might need a different endpoint
        // This is a placeholder - implement based on your API
        throw new Error('Logo upload not implemented yet');
      }

      if (response.success) {
        setProgress(100);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Upload failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploadFile, uploading, progress, error };
}
