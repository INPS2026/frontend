'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateStaffResponse,
  GetAllStaffResponse,
  GetStaffByIdResponse,
  StaffFormOutput,
  UpdateStaffResponse,
} from '@/types/staff';

type GetStaffParams = {
  role?: string;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
};

const keys = {
  all: ['admin-staffs'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (params?: unknown) => [...keys.lists(), params] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id] as const,
};

// Get all staffs (paginated)
const getAllStaffs = async (params?: GetStaffParams) => {
  return clientRequest<GetAllStaffResponse>(adminClient, {
    url: `/api/admin/staff`,
    method: 'GET',
    params,
  });
};

export const useGetAllStaffs = (params?: GetStaffParams) => {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: async () => getAllStaffs(params),
  });
};

// Get staff by staffId
const getStaffStaffId = async (staffId: string) => {
  return clientRequest<GetStaffByIdResponse>(adminClient, {
    url: `/api/admin/staff/${staffId}`,
    method: 'GET',
  });
};

export const useGetStaffById = (staffId: string) => {
  return useQuery({
    queryKey: keys.detail(staffId),
    queryFn: async () => getStaffStaffId(staffId),
    enabled: !!staffId,
  });
};

// Create staff
const createStaff = async (data: StaffFormOutput) => {
  return clientRequest<CreateStaffResponse>(adminClient, {
    url: `/api/admin/staff`,
    method: 'POST',
    data,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
};

// Update staff
const updateStaff = async ({
  staffId,
  data,
}: {
  staffId: string;
  data: StaffFormOutput;
}) => {
  return clientRequest<UpdateStaffResponse>(adminClient, {
    url: `/api/admin/staff/${staffId}`,
    method: 'PATCH',
    data,
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
};
