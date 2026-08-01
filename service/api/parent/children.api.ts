'use client';

import { clientRequest } from '@/lib/api-client';
import { parentClient } from './parent-client';
import { useQuery } from '@tanstack/react-query';
import { GetChildrenResponse } from '@/types/student';

const keys = {
  all: ['parent-children'],
} as const;

// Get all children linked to the parent
const getChildren = async () => {
  return clientRequest<GetChildrenResponse>(parentClient, {
    url: '/api/parent/children',
    method: 'GET',
  });
};

export const useGetChildren = () => {
  return useQuery({
    queryKey: keys.all,
    queryFn: getChildren,
  });
};
