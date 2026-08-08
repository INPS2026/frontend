import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { GetAllAcademicSessionsResponse } from '@/types/config';
import { useQuery } from '@tanstack/react-query';

const keys = {
  all: ['admin-config'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (params?: unknown) => [...keys.lists(), { params }] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id],
};

// Get all academic sessions (includes terms)
const getAllAcademicSessions = async () => {
  return clientRequest<GetAllAcademicSessionsResponse>(adminClient, {
    url: '/api/admin/config/sessions',
    method: 'GET',
  });
};

export const useGetAllAcademicSessions = () => {
  return useQuery({
    queryKey: keys.list(),
    queryFn: getAllAcademicSessions,
  });
};
