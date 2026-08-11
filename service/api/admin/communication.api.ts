'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CommunicationStatusEnum,
  CommunicationTargetEnum,
  CommunicationTypeEnum,
  GetCommunicationsResponse,
} from '@/types/communication';
import { CommunicationFormValues } from '@/components/communication/communication-form';

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

// Create communication
const createCommunication = async (data: CommunicationFormValues) => {
  return clientRequest(adminClient, {
    url: '/api/admin/communications',
    method: 'POST',
    data,
  });
};

export const useCreateCommunication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};

// Update communication
const updateCommunication = async ({
  communicationId,
  data,
}: {
  communicationId: string;
  data: CommunicationFormValues;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/communications/${communicationId}`,
    method: 'PUT',
    data,
  });
};

export const useUpdateCommunication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCommunication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};
