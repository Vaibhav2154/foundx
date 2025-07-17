"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/api/auth.service';
import { showError } from '@/utils/toast';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
  login: (token: string, userData: any) => void;
  logout: () => Promise<void>;
  user: any | null;
  getUserData: () => any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/sign-in', '/sign-up', '/', '/options', '/build-startup'];

  const getUserData = (): any | null => {
    try {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = getUserData();
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, userData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userData._id);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('startUpId');
        localStorage.removeItem('notificationSettings');
      }
      setUser(null);
      setIsAuthenticated(false);
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const isAuth = await checkAuth();
      
      if (!isAuth && !publicRoutes.includes(pathname)) {
        showError('Please sign in to access this page');
        router.push('/sign-in');
      }
      
      if (isAuth && (pathname === '/sign-in' || pathname === '/sign-up')) {
        router.push('/startup');
      }
    };

    initAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      checkAuth, 
      login, 
      logout, 
      user, 
      getUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
