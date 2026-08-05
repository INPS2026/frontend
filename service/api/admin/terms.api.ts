import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useQuery } from '@tanstack/react-query';
import { GetActiveTermResponse } from '@/types/term';

const keys = {
  all: ['admin-terms'] as const,
  lists: () => [...keys.all, 'list'] as const,
  details: () => [keys.all, 'detail'] as const,
};

// Get current active term
const getActiveTerm = async () => {
  return clientRequest<GetActiveTermResponse>(adminClient, {
    url: `/api/admin/config/terms/current`,
    method: 'GET',
  });
};

export const useGetActiveTerm = () => {
  return useQuery({
    queryKey: keys.details(),
    queryFn: getActiveTerm,
  });
};
