'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useQuery } from '@tanstack/react-query';
import { GetAllStaffResponse } from '@/types/staff';

type GetStaffParams = {
  role?: string;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
};

const keys = {
  all: ['admin-staffs'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (params?: unknown) => [...keys.lists(), params],
};

// Get all staffs (paginated)
const getAllStaffs = async (params?: GetStaffParams) => {
  return clientRequest<GetAllStaffResponse>(adminClient, {
    url: `/api/admin/staff`,
    method: 'GET',
    params,
  });
};

export const useGetAllStaffs = (params?: GetStaffParams) => {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: () => getAllStaffs(params),
  });
};
