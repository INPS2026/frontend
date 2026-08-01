'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import type {
  GetStudentsResponse,
  NewStudentFormOutput,
  RegisterStudentResponse,
  Student,
} from '@/types/student';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface GetStudentParams {
  status?: Student['status'];
  page?: number;
  limit?: number;
}

const keys = {
  all: ['admin-students'],
  students: (params?: GetStudentParams) => [
    ...keys.all,
    'students-list',
    params,
  ],
} as const;

// Register new student
const registerStudent = async (
  data: NewStudentFormOutput,
): RegisterStudentResponse => {
  const formData = new FormData();
  const { parentData, passportPhoto, admissionDocs, ...rest } = data;

  for (const [key, value] of Object.entries(rest)) {
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  formData.append('parentData', JSON.stringify(parentData));

  if (passportPhoto) formData.append('passportPhoto', passportPhoto);
  admissionDocs?.forEach((doc) => formData.append('admissionDocs', doc));

  return clientRequest(adminClient, {
    url: '/api/admin/students',
    method: 'POST',
    data: formData,
  });
};

export const useRegisterStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.all,
      });
    },
  });
};

// Get all students (paginated)
const getStudents = async (params?: GetStudentParams): GetStudentsResponse => {
  return clientRequest(adminClient, {
    url: '/api/admin/students',
    method: 'GET',
    params,
  });
};

export const useGetStudents = (params?: GetStudentParams) => {
  return useQuery({
    queryKey: keys.students(params),
    queryFn: async () => getStudents(params),
  });
};
