'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useQuery } from '@tanstack/react-query';
import type { GetAllClassroomsResponse } from '@/types/classroom';

type ClassFilterParams = {
  level:
    | 'DAYCARE'
    | 'PRENURSERY'
    | 'NURSERY_1'
    | 'NURSERY_2'
    | 'NURSERY_3'
    | 'PRIMARY_1'
    | 'PRIMARY_2'
    | 'PRIMARY_3'
    | 'PRIMARY_4'
    | 'PRIMARY_5'
    | 'PRIMARY_6';
  status: 'ACTIVE' | 'INACTIVE';
};

const keys = {
  all: ['admin-classrooms'],
  list: (params?: ClassFilterParams) => [...keys.all, 'list', params],
};

// Get all classes
const getAllClassrooms = async (params?: ClassFilterParams) => {
  return clientRequest<GetAllClassroomsResponse>(adminClient, {
    url: '/api/admin/classes',
    method: 'GET',
    params,
  });
};

export const useGetAllClassrooms = (params?: ClassFilterParams) => {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: async () => getAllClassrooms(params),
  });
};
