import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthAPI from '@/services/AuthAPI';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo = '/marketplace/login' }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        if (!AuthAPI.isAuthenticated()) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        await AuthAPI.getProfile();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, clear auth data
        AuthAPI.clearAuthData();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
