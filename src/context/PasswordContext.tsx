
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PasswordContextType {
  passwords: PasswordEntry[];
  addPassword: (password: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePassword: (id: string, password: Partial<PasswordEntry>) => void;
  deletePassword: (id: string) => void;
  getPassword: (id: string) => PasswordEntry | undefined;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

// Simple encryption/decryption functions for demonstration purposes
// In a real app, you would use a proper encryption library
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

  // Load passwords from localStorage on component mount
  useEffect(() => {
    const storedPasswords = localStorage.getItem('whisperkey-passwords');
    if (storedPasswords) {
      try {
        const parsedPasswords = JSON.parse(storedPasswords).map((pass: PasswordEntry) => ({
          ...pass,
          password: decrypt(pass.password),
          createdAt: new Date(pass.createdAt),
          updatedAt: new Date(pass.updatedAt)
        }));
        setPasswords(parsedPasswords);
      } catch (error) {
        console.error('Failed to parse stored passwords:', error);
      }
    }
  }, []);

  // Save passwords to localStorage when they change
  useEffect(() => {
    if (passwords.length > 0) {
      const encryptedPasswords = passwords.map((pass) => ({
        ...pass,
        password: encrypt(pass.password),
      }));
      localStorage.setItem('whisperkey-passwords', JSON.stringify(encryptedPasswords));
    } else {
      localStorage.removeItem('whisperkey-passwords');
    }
  }, [passwords]);

  const addPassword = (password: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newPassword: PasswordEntry = {
      ...password,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setPasswords((prevPasswords) => [...prevPasswords, newPassword]);
  };

  const updatePassword = (id: string, passwordUpdate: Partial<PasswordEntry>) => {
    setPasswords((prevPasswords) =>
      prevPasswords.map((pass) =>
        pass.id === id
          ? { ...pass, ...passwordUpdate, updatedAt: new Date() }
          : pass
      )
    );
  };

  const deletePassword = (id: string) => {
    setPasswords((prevPasswords) => prevPasswords.filter((pass) => pass.id !== id));
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
