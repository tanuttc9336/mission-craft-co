import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ClientUser } from '@/types/portal';
import { mockUsers } from '@/data/portal-mock-data';
import { trackEvent } from '@/utils/analytics';

interface PortalAuthContextValue {
  user: ClientUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const PortalAuthContext = createContext<PortalAuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('portal_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('portal_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Mock auth — any password works with demo emails
    const found = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem('portal_user', JSON.stringify(found));
      trackEvent('portal_login');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portal_user');
    trackEvent('portal_logout');
  };

  return (
    <PortalAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  return useContext(PortalAuthContext);
}
