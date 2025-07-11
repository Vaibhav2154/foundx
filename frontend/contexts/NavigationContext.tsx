"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader } from '@/components/ui/Loader';

interface NavigationContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  navigate: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const navigate = (href: string) => {
    if (href === pathname) return; // Don't navigate to current page
    
    setIsLoading(true);
    router.push(href);
    
    // Set a timeout to hide loader in case the navigation doesn't trigger the effect
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  // Listen to pathname changes to hide loader
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isLoading, setLoading, navigate }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <Loader variant="dots" size="lg" className="text-blue-500" />
        </div>
      )}
    </NavigationContext.Provider>
  );
};
