'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useQuery } from '@tanstack/react-query';
import { GetSubjectsAssignedToClassroomResponse } from '@/types/curriculum';

const keys = {
  all: ['admin-curriculum'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (id: string, params?: unknown) => [keys.lists(), id, { params }],
};

// Get all subjects assigned to a class for term
const getSubjectsAssignedToClassroom = async (
  classroomId: string,
  termId: string,
) => {
  return clientRequest<GetSubjectsAssignedToClassroomResponse>(adminClient, {
    url: `/api/admin/subjects/classes/${classroomId}/subjects`,
    method: 'GET',
    params: { termId },
  });
};

export const useGetSubjectsAssignedToClassroom = (
  classroomId: string,
  termId: string,
) => {
  return useQuery({
    queryKey: keys.list(classroomId, termId),
    queryFn: async () => getSubjectsAssignedToClassroom(classroomId, termId),
    enabled: !!classroomId && !!termId,
  });
};
