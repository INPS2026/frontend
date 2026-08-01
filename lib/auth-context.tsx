'use client';

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { clientRequest, createBrowserApiClient } from './api-client';
import { TokenService } from './token-service';
import type { LoginResponse, Staff } from '@/types/auth';
import type { LoginPayload } from '@/components/login-form';

type AuthContext = {
  user: Staff | null;
  login: (data: LoginPayload) => Promise<void>;
};

const authContext = createContext<AuthContext | undefined>(undefined);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const apiClient = useMemo(() => createBrowserApiClient(), []);

  const [user, setUser] = useState<Staff | null>(null);

  const login = async (data: LoginPayload) => {
    const res = await clientRequest<LoginResponse>(apiClient, {
      url: '/api/staff/login',
      method: 'POST',
      data,
    });

    if (res.success) {
      setUser(res.user);
      TokenService.set({
        accessToken: res.token,
        refreshToken: res.refreshToken,
      });
    }
  };

  const value: AuthContext = { user, login };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(authContext);

  if (!ctx) {
    throw Error('useAuthContext must be called inside AuthContextProvider');
  }

  return ctx;
};
