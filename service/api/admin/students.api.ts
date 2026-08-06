'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import type {
  GetStudentByAdmissionNoResponse,
  GetStudentsResponse,
  NewStudentFormOutput,
  RegisterStudentResponse,
  Student,
  UpdateStudentRecordResponse,
} from '@/types/student';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface GetStudentParams {
  status?: Student['status'];
  page?: number;
  limit?: number;
}

const keys = {
  all: ['admin-students'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (params: unknown) => [...keys.lists(), { params }] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id],
};

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
    queryKey: keys.list(params),
    queryFn: async () => getStudents(params),
  });
};

// Get a student by admission number
const getStudentByAdmissionNo = async (admissionNo: string) => {
  return clientRequest<GetStudentByAdmissionNoResponse>(adminClient, {
    url: `/api/admin/students/${admissionNo}`,
    method: 'GET',
  });
};

export const useGetStudentByAdmissionNo = (admissionNo: string) => {
  return useQuery({
    queryKey: keys.detail(admissionNo),
    queryFn: async () => getStudentByAdmissionNo(admissionNo),
    enabled: !!admissionNo,
  });
};

// Update student record
const updateStudentRecord = async ({
  admissionNum,
  data,
}: {
  admissionNum: string;
  data: Partial<NewStudentFormOutput>;
}) => {
  return clientRequest<UpdateStudentRecordResponse>(adminClient, {
    url: `/api/admin/students/${admissionNum}`,
    method: 'PATCH',
    data,
  });
};

export const useUpdateStudentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentRecord,
    onSuccess: (response, variables) => {
      queryClient.setQueryData<GetStudentByAdmissionNoResponse | undefined>(
        keys.detail(variables.admissionNum),
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            data: response.data,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: keys.detail(variables.admissionNum),
      });
      queryClient.invalidateQueries({
        queryKey: keys.all,
      });
    },
  });
};
