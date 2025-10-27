import { useState, useEffect } from 'react';
import { AuthContext } from './authContext';

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to clear auth data
  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setError(null);
  };

  // Helper function to validate token (basic check)
  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedToken = localStorage.getItem('jwt');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // Validate token before setting state
          if (isTokenValid(storedToken)) {
            try {
              const userData = JSON.parse(storedUser);
              setToken(storedToken);
              setUser(userData);
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              clearAuthData();
            }
          } else {
            // Token is invalid or expired
            console.log('Stored token is invalid or expired');
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = (userData, authToken) => {
    try {
      setError(null);

      // Validate token before storing
      if (!isTokenValid(authToken)) {
        throw new Error('Invalid token provided');
      }

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('jwt', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error during sign in:', error);
      setError(error.message || 'Sign in failed');
      clearAuthData();
    }
  };

  const signOut = () => {
    clearAuthData();
  };

  const value = {
    user,
    token,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user && !!token,
    role: user?.role,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
