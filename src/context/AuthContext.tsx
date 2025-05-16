import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config';

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

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // Function to fetch user information
  const fetchUserInfo = async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          return null;
        }
        throw new Error('Failed to fetch user info');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  // Function to login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log(`${API_BASE_URL}/auth/login`);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
      localStorage.setItem('accessToken', data.access_token);
      

      const userInfo = await fetchUserInfo();
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
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
      localStorage.setItem('accessToken', data.access_token);

      const userInfo = await fetchUserInfo();
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

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
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

      const response = await fetch(`${API_BASE_URL}/users/email`, {
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
        const userInfo = await fetchUserInfo();
        setUser(userInfo);
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
