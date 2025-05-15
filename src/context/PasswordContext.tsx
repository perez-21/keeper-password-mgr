
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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

  // Load passwords on component mount
  useEffect( () => {

    const getPasswords = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/passwords");
        const data = await response.json();
        const decryptedPasswords = data.map((pass: PasswordEntry) => ({
          ...pass,
          password: decrypt(pass.password),
        }));
        setPasswords(decryptedPasswords);
      } catch (error) {
        console.error('Failed to fetch passwords:', error);
      }
    }
    getPasswords();
    
  }, []);


  const addPassword = async (password: Omit<PasswordEntry, 'id'>) => {

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
        body: JSON.stringify({...encryptedPassword, userId: 'bae06cc4-dacc-4b73-a72b-9a60acb23ec2'})
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

    try {
      const encryptedPassword = {
        ...passwordUpdate,
        password: encrypt(passwordUpdate.password),
      }

      const response = await fetch(`http://localhost:3000/api/passwords/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({...encryptedPassword, userId: 'bae06cc4-dacc-4b73-a72b-9a60acb23ec2'})
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
