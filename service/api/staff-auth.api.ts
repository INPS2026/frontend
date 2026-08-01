import { clientRequest } from '@/lib/api-client';
import type { RefreshStaffTokenResponse } from '@/types/auth';
import { adminClient } from './admin/admin-client';

export const refreshStaffToken = async (refreshToken: string) => {
  const response = await clientRequest<RefreshStaffTokenResponse>(adminClient, {
    url: '/api/staff/refresh-token',
    method: 'POST',
    data: { refreshToken },
  });
  return response;
};
