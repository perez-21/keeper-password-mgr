
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';

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
  const { user, isSignedIn, isLoaded } = useUser();
  
  // Load passwords when component mounts and user is signed in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    
    const getPasswords = async () => {
      try {
        // Add the user ID to the fetch request
        const response = await fetch("http://localhost:3000/api/passwords");
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
  }, [isLoaded, isSignedIn, user]);

  const addPassword = async (password: Omit<PasswordEntry, 'id'>) => {
    if (!isSignedIn || !user) {
      toast.error('You must be signed in to add passwords');
      return;
    }

    try {
      const encryptedPassword = {
        ...password,
        password: encrypt(password.password),
      }
      
      const response = await fetch("http://localhost:3000/api/passwords", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({...encryptedPassword, userId: user.id})
      });
      
      if (!response.ok) {
        throw new Error('Failed to save passwords');
      }
      
      const data = await response.json();

      setPasswords((prevPasswords) => [...prevPasswords, { ...data, password: decrypt(data.password)}]);
      console.log('Password saved:', data);
      toast.success('Password saved successfully');  
      
    } catch (error) {
      console.error('Failed to save password:', error);
      toast.error('Failed to save password');
    }
  };

  const updatePassword = async (id: string, passwordUpdate: Partial<PasswordEntry>) => {
    if (!isSignedIn || !user) {
      toast.error('You must be signed in to update passwords');
      return;
    }

    try {
      const encryptedPassword = {
        ...passwordUpdate,
        password: passwordUpdate.password ? encrypt(passwordUpdate.password) : undefined,
      }

      const response = await fetch(`http://localhost:3000/api/passwords/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({...encryptedPassword, userId: user.id})
      });
      
      if (!response.ok) {
        throw new Error('Failed to update password');
      }
      
      const data = await response.json();
      setPasswords((prevPasswords) => 
        prevPasswords.map(pass => 
          pass.id === id ? { ...data, password: decrypt(data.password)} : pass
        )
      );
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('Failed to update password');
    }
  };

  const deletePassword = async (id: string) => {
    if (!isSignedIn || !user) {
      toast.error('You must be signed in to delete passwords');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/passwords/${id}`, {
        method: 'DELETE',
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
