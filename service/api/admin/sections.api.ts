'use client';

import { clientRequest } from '@/lib/api-client';
import { NewSectionFormOutput } from '@/types/section';
import { adminClient } from './admin-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classroomKeys } from './classrooms.api';

// Create new section
const createSection = async ({
  classroomId,
  data,
}: {
  classroomId: string;
  data: NewSectionFormOutput;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/classes/${classroomId}/sections`,
    method: 'POST',
    data,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSection,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: classroomKeys.item(variables.classroomId),
      });
    },
  });
};
