'use client';

import { clientRequest } from '@/lib/api-client';
import { parentClient } from './parent-client';
import { useQuery } from '@tanstack/react-query';
import { GetChildProfileResponse, GetChildrenResponse } from '@/types/student';
import { ApiResponse } from '@/types/api';

const keys = {
  all: ['parent-children'],
  profile: (studentId: string) => [...keys.all, 'child-profile', studentId],
  fees: (studentId: string) => [...keys.all, 'outstanding-fees', studentId],
  payments: (studentId: string) => [...keys.all, 'payment-history', studentId],
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

// Get a child's full profile
const getChildProfile = async (studentId: string) => {
  return clientRequest<GetChildProfileResponse>(parentClient, {
    url: `/api/parent/children/${studentId}`,
    method: 'GET',
  });
};

export const useGetChildProfile = (studentId: string) => {
  return useQuery({
    queryKey: keys.profile(studentId),
    queryFn: async () => getChildProfile(studentId),
    enabled: !!studentId,
  });
};

// Get outstanding fees for a child
const getOutstandingFees = async (studentId: string) => {
  return clientRequest<
    ApiResponse<{ totalOutstanding: number; invoice: unknown[] }>
  >(parentClient, {
    url: `/api/parent/children/${studentId}/fees`,
    method: 'GET',
  });
};

export const useGetOutstandingFees = (studentId: string) => {
  return useQuery({
    queryKey: keys.fees(studentId),
    queryFn: async () => getOutstandingFees(studentId),
    enabled: !!studentId,
  });
};

// Get payment history
const getPaymentHistory = async (studentId: string) => {
  return clientRequest<ApiResponse<unknown[]>>(parentClient, {
    url: `/api/parent/children/${studentId}/payments`,
    method: 'GET',
  });
};

export const useGetPaymentHistory = (studentId: string) => {
  return useQuery({
    queryKey: keys.payments(studentId),
    queryFn: async () => getPaymentHistory(studentId),
    enabled: !!studentId,
  });
};
