'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetPolicyConfigurationResponse } from '@/types/policy';
import { TermEnum } from '@/types/term';
import { PolicyFormOutput } from '@/components/policies/policy-form';

const keys = {
  all: ['admin-policy'] as const,
  lists: () => [...keys.all, 'list'] as const,
};

// Get policy configurations
const getPolicyConfigurations = async () => {
  return clientRequest<GetPolicyConfigurationResponse>(adminClient, {
    url: '/api/admin/config/policy',
    method: 'GET',
  });
};

export const useGetPolicyConfigurations = () => {
  return useQuery({
    queryKey: keys.lists(),
    queryFn: getPolicyConfigurations,
  });
};

// Create policy configuration
const createPolicyConfiguration = async (data: PolicyFormOutput) => {
  return clientRequest(adminClient, {
    url: '/api/admin/config/policy',
    method: 'POST',
    data,
  });
};

export const useCreatePolicyConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPolicyConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};

// Update policy configuration
const updatePolicyConfiguration = async ({
  academicYear,
  term,
  data,
}: {
  academicYear: string;
  term: TermEnum;
  data: PolicyFormOutput;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/policy/${encodeURIComponent(academicYear)}/${encodeURIComponent(term)}`,
    method: 'PATCH',
    data,
  });
};

export const useUpdatePolicyConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePolicyConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};

// Delete policy configuration
const deletePolicyConfiguration = async ({
  academicYear,
  term,
}: {
  academicYear: string;
  term: TermEnum;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/policy/${encodeURIComponent(academicYear)}/${encodeURIComponent(term)}`,
    method: 'DELETE',
  });
};

export const useDeletePolicyConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePolicyConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};
