'use client';

import { clientRequest } from '@/lib/api-client';
import { parentClient } from './parent-client';
import { useQuery } from '@tanstack/react-query';
import { GetChildrenResponse } from '@/types/student';

const keys = {
  all: ['parent-children'],
  childProfile: (studentId: string) => [
    ...keys.all,
    'child-profile',
    studentId,
  ],
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
  return clientRequest(parentClient, {
    url: `/api/parent/children/${studentId}`,
    method: 'GET',
  });
};

export const useGetChildProfile = (studentId: string) => {
  return useQuery({
    queryKey: keys.childProfile(studentId),
    queryFn: () => getChildProfile(studentId),
    enabled: !!studentId,
  });
};
