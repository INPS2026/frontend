'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useQuery } from '@tanstack/react-query';
import {
  CommunicationStatusEnum,
  CommunicationTargetEnum,
  CommunicationTypeEnum,
  GetCommunicationsResponse,
} from '@/types/communication';

type GetCommunicationsParams = {
  type?: CommunicationTypeEnum;
  status?: CommunicationStatusEnum;
  target?: CommunicationTargetEnum;
  page: number;
  limit: number;
};

const keys = {
  all: ['admin-communications'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (params: unknown) => [...keys.lists(), params] as const,
};

// Get all news and announcements
const getCommunications = async (params: GetCommunicationsParams) => {
  return clientRequest<GetCommunicationsResponse>(adminClient, {
    url: '/api/admin/communications/',
    method: 'GET',
    params,
  });
};

export const useGetCommunications = (params: GetCommunicationsParams) => {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: async () => getCommunications(params),
  });
};
