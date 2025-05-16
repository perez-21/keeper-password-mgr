import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '@/config';

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
}

interface PasswordContextType {
  passwords: PasswordEntry[];
  addPassword: (password: Omit<PasswordEntry, 'id'>) => void;
  updatePassword: (id: string, password: Partial<PasswordEntry>) => void;
  deletePassword: (id: string) => void;
  getPassword: (id: string) => PasswordEntry | undefined;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

// Simple encryption/decryption functions for demonstration purposes
// TODO: In a real app, you would use a proper encryption library
const encrypt = (text: string): string => {
  return btoa(text);
};

const decrypt = (text: string): string => {
  try {
    return atob(text);
  } catch (e) {
    return text;
  }
};

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const { user, isAuthenticated, isLoaded } = useAuth();
  
  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };
  
  // Load passwords when component mounts and user is signed in
  useEffect(() => {
    if (!isLoaded || !isAuthenticated || !user) return;
    
    const getPasswords = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/passwords`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch passwords');
        }
        
        const data = await response.json();
        const decryptedPasswords = data.map((pass: PasswordEntry) => ({
          ...pass,
          password: decrypt(pass.password),
        }));
        setPasswords(decryptedPasswords);
      } catch (error) {
        console.error('Failed to fetch passwords:', error);
        toast.error('Failed to load your passwords');
      }
    }
    
    getPasswords();
  }, [isLoaded, isAuthenticated, user]);

  const addPassword = async (password: Omit<PasswordEntry, 'id'>) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be signed in to add passwords');
      return;
    }

    try {
      const encryptedPassword = {
        ...password,
        password: encrypt(password.password),
      }
      
      const response = await fetch(`${API_BASE_URL}/passwords`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({...encryptedPassword, userId: user?.id})
      });
      
      if (!response.ok) {
        throw new Error('Failed to save passwords');
      }
      
      const data = await response.json();

      setPasswords((prevPasswords) => [...prevPasswords, { ...data, password: decrypt(data.password)}]);
      toast.success('Password saved successfully');  
      
    } catch (error) {
      console.error('Failed to save password:', error);
      toast.error('Failed to save password');
    }
  };

  const updatePassword = async (id: string, passwordUpdate: Partial<PasswordEntry>) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be signed in to update passwords');
      return;
    }

    try {
      const encryptedPassword = {
        ...passwordUpdate,
        password: encrypt(passwordUpdate.password),
      }

      const response = await fetch(`${API_BASE_URL}/passwords/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({...encryptedPassword, userId: user?.id})
      });
      
      if (!response.ok) {
        throw new Error('Failed to update password');
      }
      
      const data = await response.json();
      setPasswords((prevPasswords) => [...(prevPasswords.filter((pass) => pass.id !== id)), { ...data, password: decrypt(data.password)}]);
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('Failed to update password');
    }
  };

  const deletePassword = async (id: string) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be signed in to delete passwords');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/passwords/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete password');
      }
      
      setPasswords((prevPasswords) => prevPasswords.filter((pass) => pass.id !== id));
      toast.success('Password deleted successfully');
    } catch (error) {
      console.error('Failed to delete password:', error);
      toast.error('Failed to delete password');
    }
  };

  const getPassword = (id: string) => {
    return passwords.find((pass) => pass.id === id);
  };

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        addPassword,
        updatePassword,
        deletePassword,
        getPassword,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswords = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePasswords must be used within a PasswordProvider');
  }
  return context;
};
