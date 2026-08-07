'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { Term } from '@/types/term';
import { useQuery } from '@tanstack/react-query';
import { GetClassroomFeeStructure } from '@/types/finance';

const keys = {
  all: ['admin-finance'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (id: string, params?: unknown) => [...keys.lists(), id, params],
};

// Get fee structure for a class
const getClassroomFeeStructure = async (
  classroomId: string,
  params: { academicYear: string; term: Term },
) => {
  return clientRequest<GetClassroomFeeStructure>(adminClient, {
    url: `/api/finance/bills/class/${classroomId}`,
    method: 'GET',
    params,
  });
};

export const useGetClassroomFeeStructure = (
  classroomId: string,
  params: { academicYear: string; term: Term },
) => {
  return useQuery({
    queryKey: keys.list(classroomId, params),
    queryFn: () => getClassroomFeeStructure(classroomId, params),
  });
};
