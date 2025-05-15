
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define interface for user
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

// Define interface for authentication context
interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Define interface for AuthProvider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Define interface for JWT token payload
interface TokenPayload {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  exp: number;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Function to parse JWT token
  const parseJwt = (token: string): TokenPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    const payload = parseJwt(token);
    if (!payload) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  };

  // Function to handle token refresh
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  // Function to get authenticated user from token
  const getUserFromToken = (): User | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    if (isTokenExpired(token)) {
      return null;
    }

    const payload = parseJwt(token);
    if (!payload) return null;

    return {
      id: payload.userId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  };

  // Function to login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      const userInfo = getUserFromToken();
      setUser(userInfo);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
      throw error;
    }
  };

  // Function to signup
  const signup = async (email: string, password: string, firstName?: string, lastName?: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) {
        throw new Error('Signup failed. This email may already be registered.');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      const userInfo = getUserFromToken();
      setUser(userInfo);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Signup failed. Please try again.');
      throw error;
    }
  };

  // Function to logout
  const logout = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast.success('You have been logged out.');
    navigate('/login');
  };

  // Function to update user profile
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('You must be logged in to update your profile.');
        return;
      }

      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile.');
      }

      const updatedData = await response.json();
      setUser((prev) => prev ? { ...prev, ...updatedData } : null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
      throw error;
    }
  };

  // Function to update email
  const updateEmail = async (email: string): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('You must be logged in to update your email.');
        return;
      }

      const response = await fetch('http://localhost:3000/api/users/email', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to update email.');
      }

      toast.info('Verification email sent to your new address. Please verify to complete the change.');
    } catch (error) {
      console.error('Update email error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update email. Please try again.');
      throw error;
    }
  };

  // Effect to initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (token) {
          if (isTokenExpired(token)) {
            const refreshed = await refreshToken();
            if (!refreshed) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              setUser(null);
            } else {
              setUser(getUserFromToken());
            }
          } else {
            setUser(getUserFromToken());
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        updateEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
