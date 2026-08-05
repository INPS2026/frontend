'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useQuery } from '@tanstack/react-query';
import {
  GetEnrollmentsForClassroomParams,
  GetEnrollmentsForClassroomResponse,
} from '@/types/enrollment';

const keys = {
  all: ['admin-enrollments'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (id: string, params: unknown) =>
    [...keys.lists(), { id, params }] as const,
};

// Get all enrollments for a class
const getEnrollmentsForClassroom = async (
  classroomId: string,
  params?: GetEnrollmentsForClassroomParams,
) => {
  return clientRequest<GetEnrollmentsForClassroomResponse>(adminClient, {
    url: `/api/admin/enrollment/class/${classroomId}`,
    method: 'GET',
    params,
  });
};

export const useGetEnrollmentsForClassroom = (
  classroomId: string,
  params?: GetEnrollmentsForClassroomParams,
) => {
  return useQuery({
    queryKey: keys.list(classroomId, params),
    queryFn: async () => getEnrollmentsForClassroom(classroomId, params),
    enabled: !!classroomId,
  });
};
