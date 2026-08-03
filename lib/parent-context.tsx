'use client';

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { clientRequest, createBrowserApiClient } from './api-client';
import { TokenService } from './token-service';
import type { ParentAccount, ParentLoginResponse } from '@/types/auth';
import type { LoginPayload } from '@/components/login-form';

const PARENT_USER_STORAGE_KEY = 'school_parent_user';

type ParentContext = {
  user: ParentAccount | null;
  isAuthenticated: boolean;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
};

const parentContext = createContext<ParentContext | undefined>(undefined);

export const ParentContextProvider = ({ children }: PropsWithChildren) => {
  const apiClient = useMemo(() => createBrowserApiClient(), []);

  const [user, setUser] = useState<ParentAccount | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore user from localStorage on mount
  // Note: We need to use useEffect here to avoid hydration mismatch between server and client.
  // The server renders with user=null, client needs to restore from localStorage after mount.
  // Calling setState in useEffect is acceptable here to avoid hydration mismatch.

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem(PARENT_USER_STORAGE_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          localStorage.removeItem(PARENT_USER_STORAGE_KEY);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  const login = async (data: LoginPayload) => {
    const res = await clientRequest<ParentLoginResponse>(apiClient, {
      url: '/api/parent/login',
      method: 'POST',
      data,
    });

    if (res.success) {
      setUser(res.user);
      localStorage.setItem(PARENT_USER_STORAGE_KEY, JSON.stringify(res.user));
      TokenService.set({
        accessToken: res.token,
        refreshToken: res.refreshToken,
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(PARENT_USER_STORAGE_KEY);
    TokenService.clear();
  };

  const value: ParentContext = {
    user,
    isAuthenticated: !!TokenService.getAccessToken(),
    login,
    logout,
  };

  // Don't render children until we've initialized from localStorage to avoid hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <parentContext.Provider value={value}>{children}</parentContext.Provider>
  );
};

export const useParentContext = () => {
  const ctx = useContext(parentContext);

  if (!ctx) {
    throw Error('useParentContext must be called inside ParentContextProvider');
  }

  return ctx;
};
