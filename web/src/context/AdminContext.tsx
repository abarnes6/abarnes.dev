import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey, verifyApiKey } from '../services/adminApi';

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedKey = getStoredApiKey();
      if (storedKey) {
        const valid = await verifyApiKey(storedKey);
        setIsAuthenticated(valid);
        if (!valid) {
          clearStoredApiKey();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (key: string): Promise<boolean> => {
    const valid = await verifyApiKey(key);
    if (valid) {
      setStoredApiKey(key);
      setIsAuthenticated(true);
    }
    return valid;
  };

  const logout = () => {
    clearStoredApiKey();
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
