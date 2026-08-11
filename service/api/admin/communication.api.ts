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

// Delete communication
const deleteCommunication = async (communicationId: string) => {
  return clientRequest(adminClient, {
    url: `/api/admin/communications/${communicationId}`,
    method: 'DELETE',
  });
};

export const useDeleteCommunication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};

// Publish communication
const publishCommunication = async (id: string) => {
  return clientRequest(adminClient, {
    url: `/api/admin/communications/${id}/publish`,
    method: 'PATCH',
  });
};

export const usePublishCommunication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishCommunication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};

// Send communication email
const sendCommunicationEmail = async (id: string) => {
  return clientRequest(adminClient, {
    url: `/api/admin/communications/${id}/send`,
    method: 'PATCH',
  });
};

export const useSendCommunicationEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendCommunicationEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};
