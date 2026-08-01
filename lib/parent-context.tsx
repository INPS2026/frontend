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
import type { ParentAccount, ParentLoginResponse } from '@/types/auth';
import type { LoginPayload } from '@/components/login-form';

type ParentContext = {
  user: ParentAccount | null;
  login: (data: LoginPayload) => Promise<void>;
};

const parentContext = createContext<ParentContext | undefined>(undefined);

export const ParentContextProvider = ({ children }: PropsWithChildren) => {
  const apiClient = useMemo(() => createBrowserApiClient(), []);

  const [user, setUser] = useState<ParentAccount | null>(null);

  const login = async (data: LoginPayload) => {
    const res = await clientRequest<ParentLoginResponse>(apiClient, {
      url: '/api/parent/login',
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

  const value: ParentContext = { user, login };

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
