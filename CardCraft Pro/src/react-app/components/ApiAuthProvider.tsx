import { createContext, useContext } from 'react';
import { useAuth } from '@/react-app/hooks/useApi';

// Auth context for API authentication
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

// Protected Route component
export const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: string; 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access this page.</p>
          <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Go to Login
          </a>
        </div>
      </div>
    );
  }
  
  // In a real app, you'd check user.role against requiredRole
  // For demo, we'll allow access to all authenticated users
  // In a real app, you'd check user.isAdmin or user.role === 'admin'
  if (requiredRole === 'admin' && !user?.isAdmin && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <a href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};
