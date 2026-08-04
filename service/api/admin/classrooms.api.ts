'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  GetAllClassroomsResponse,
  GetClassroomByIdResponse,
  NewClassroomFormInput,
  UpdateClassroomResponse,
} from '@/types/classroom';
import { ClassroomLevel } from '@/lib/constants';

type ClassFilterParams = {
  level: ClassroomLevel;
  status: 'ACTIVE' | 'INACTIVE';
};

const keys = {
  all: ['admin-classrooms'],
  list: (params?: ClassFilterParams) => [...keys.all, 'list', params],
  item: (classroomId: string) => [...keys.all, 'item', classroomId],
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

// Get class by ID
const getClassroomById = async (classroomId: string) => {
  return clientRequest<GetClassroomByIdResponse>(adminClient, {
    url: `/api/admin/classes/${classroomId}`,
    method: 'GET',
  });
};

export const useGetClassroomById = (classroomId: string) => {
  return useQuery({
    queryKey: keys.item(classroomId),
    queryFn: () => getClassroomById(classroomId),
    enabled: !!classroomId,
  });
};

// Update a class
const updateClassroom = async ({
  classroomId,
  data,
}: {
  classroomId: string;
  data: Partial<NewClassroomFormInput>;
}) => {
  return clientRequest<UpdateClassroomResponse>(adminClient, {
    url: `/api/admin/classes/${classroomId}`,
    method: 'PATCH',
    data,
  });
};

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.all,
      });
    },
  });
};

// Delete a class
const deleteClassroom = async (classroomId: string) => {
  return clientRequest(adminClient, {
    url: `/api/admin/classes/${classroomId}`,
    method: 'DELETE',
  });
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.all,
      });
    },
  });
};
