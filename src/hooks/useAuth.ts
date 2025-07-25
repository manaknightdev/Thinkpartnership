import { useState, useEffect } from 'react';
import AuthAPI from '@/services/AuthAPI';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}

export const useAuth = () => {
  // Initialize with localStorage check for faster initial render
  const [authState, setAuthState] = useState<AuthState>(() => {
    const hasToken = AuthAPI.isAuthenticated();
    const userData = AuthAPI.getUserData();

    return {
      isAuthenticated: hasToken,
      isLoading: hasToken, // Only show loading if we have a token to verify
      user: userData,
    };
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        if (!AuthAPI.isAuthenticated()) {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
          return;
        }

        // Verify token with backend
        const profileResponse = await AuthAPI.getProfile();
        if (profileResponse.error || !profileResponse.user) {
          // Token is invalid, clear auth data
          AuthAPI.clearAuthData();
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        } else {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: profileResponse.user,
          });
        }
      } catch (error) {
        // Token is invalid, clear auth data
        AuthAPI.clearAuthData();
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = (authResponse: any) => {
    AuthAPI.storeAuthData(authResponse);
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: authResponse.user_id,
        email: authResponse.email,
        first_name: authResponse.first_name,
        last_name: authResponse.last_name,
        role: authResponse.role,
      },
    });
  };

  const logout = () => {
    AuthAPI.clearAuthData();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
};
