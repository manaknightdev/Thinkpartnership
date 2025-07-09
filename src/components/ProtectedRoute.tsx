import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthAPI from '@/services/AuthAPI';
import VendorAuthAPI from '@/services/VendorAuthAPI';
import ClientAPI from '@/services/ClientAPI';
import AdminAPI from '@/services/AdminAPI';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

// Customer Protected Route (existing)
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

// Vendor Protected Route
export const VendorProtectedRoute = ({ children, redirectTo = '/vendor/login' }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if vendor token exists in localStorage
        if (!VendorAuthAPI.isAuthenticated()) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        await VendorAuthAPI.getProfile();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, clear auth data
        VendorAuthAPI.clearAuthData();
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
          <p className="text-gray-600">Loading vendor portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Client Protected Route
export const ClientProtectedRoute = ({ children, redirectTo = '/client/login' }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 ClientProtectedRoute: Checking authentication...');
        console.log('🔑 Client token exists:', !!localStorage.getItem('client_token'));
        console.log('🔐 ClientAPI.isAuthenticated():', ClientAPI.isAuthenticated());

        // Check if client token exists in localStorage
        if (!ClientAPI.isAuthenticated()) {
          console.log('❌ ClientProtectedRoute: Not authenticated, redirecting to login');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        console.log('✅ ClientProtectedRoute: Token exists, verifying with backend...');
        // Verify token with backend
        await ClientAPI.getProfile();
        console.log('✅ ClientProtectedRoute: Backend verification successful');
        setIsAuthenticated(true);
      } catch (error) {
        console.log('❌ ClientProtectedRoute: Backend verification failed:', error);
        // Token is invalid, clear auth data
        ClientAPI.clearAuthData();
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
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading client portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin Protected Route
export const AdminProtectedRoute = ({ children, redirectTo = '/admin/login' }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if admin token exists in localStorage
        if (!AdminAPI.isAuthenticated()) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        await AdminAPI.getProfile();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, clear auth data
        AdminAPI.clearAuthData();
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
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
