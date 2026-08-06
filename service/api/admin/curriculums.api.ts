'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AssignMultipleSubjectsToClassResponse,
  AssignSingleSubjectResponse,
  GetSubjectsAssignedToClassroomResponse,
} from '@/types/curriculum';

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

// Assign single subject to class
const assignSingleSubject = async ({
  classroomId,
  subjectId,
  data,
}: {
  classroomId: string;
  subjectId: string;
  data: { termId: string };
}) => {
  return clientRequest<AssignSingleSubjectResponse>(adminClient, {
    url: `/api/admin/subjects/classes/${classroomId}/subjects/${subjectId}`,
    method: 'POST',
    data,
  });
};

export const useAssignSingleSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignSingleSubject,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.classroomId] });
    },
  });
};

// Assign multiple subjects to a class for a term
const assignMultipleSubjects = async ({
  classroomId,
  data,
}: {
  classroomId: string;
  data: { termId: string; subjectIds: string[] };
}) => {
  return clientRequest<AssignMultipleSubjectsToClassResponse>(adminClient, {
    url: `/api/admin/subjects/classes/${classroomId}/subjects/bulk`,
    method: 'POST',
    data,
  });
};

export const useAssignMultipleSubjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignMultipleSubjects,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.classroomId] });
    },
  });
};
