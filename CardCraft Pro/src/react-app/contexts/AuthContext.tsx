import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { apiService, User } from "../services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isPremium: boolean;
  loading: boolean;
  login: (email: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  navigateToLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.is_admin || false;
  const isUser = !isAdmin;
  const isPremium = user?.is_premium || false;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const currentUser = localStorage.getItem('currentUser');

      if (token && userRole && currentUser) {
        const userData = JSON.parse(currentUser);
        setUser(userData);
      } else {
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear corrupted data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'admin' | 'user'): Promise<boolean> => {
    try {
      // Use the real API login endpoint
      const response = await apiService.users.login({ email, password });
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store real authentication data
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        setUser(user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = (redirectPath?: string) => {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('premiumPaymentCompleted');
    
    setUser(null);
    
    // Redirect to login page if path provided
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  };

  const navigateToLogin = () => {
    // Redirect to login page
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    isPremium,
    loading,
    login,
    logout,
    checkAuth,
    navigateToLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-slate-600 mb-4">Please log in to access this page.</p>
          <a 
            href={fallbackPath} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (requiredRole) {
    if (requiredRole === 'admin' && !isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-slate-600 mb-4">Admin access required for this page.</p>
            <a 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </a>
          </div>
        </div>
      );
    }
    if (requiredRole === 'user' && !isUser) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-slate-600 mb-4">User access required for this page.</p>
            <a 
              href="/admin/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
