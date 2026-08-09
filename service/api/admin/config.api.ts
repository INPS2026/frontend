'use client';

import { clientRequest } from '@/lib/api-client';
import { adminClient } from './admin-client';
import {
  CreateAcademicSessionResponse,
  DeleteAcademicSessionResponse,
  GetAllAcademicSessionsResponse,
  UpdateAcademicSessionResponse,
} from '@/types/config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddTermInput, TermStatus } from '@/types/term';

const keys = {
  all: ['admin-config'] as const,
  lists: () => [...keys.all, 'list'] as const,
  list: (params?: unknown) => [...keys.lists(), { params }] as const,
  details: () => [...keys.all, 'detail'] as const,
  detail: (id: string) => [...keys.details(), id],
};

// Get all academic sessions (includes terms)
const getAllAcademicSessions = async () => {
  return clientRequest<GetAllAcademicSessionsResponse>(adminClient, {
    url: '/api/admin/config/sessions',
    method: 'GET',
  });
};

export const useGetAllAcademicSessions = () => {
  return useQuery({
    queryKey: keys.list(),
    queryFn: getAllAcademicSessions,
  });
};

// Create academic session
const createAcademicSession = async (data: { session: string }) => {
  return clientRequest<CreateAcademicSessionResponse>(adminClient, {
    url: `/api/admin/config/sessions`,
    method: 'POST',
    data,
  });
};

export const useCreateAcademicSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAcademicSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.list(),
      });
    },
  });
};

// Update academic session
const updateAcademicSession = async ({
  id,
  data,
}: {
  id: string;
  data: { session: string };
}) => {
  return clientRequest<UpdateAcademicSessionResponse>(adminClient, {
    url: `/api/admin/config/sessions/${id}`,
    method: 'PATCH',
    data,
  });
};

export const useUpdateAcademicSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAcademicSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.list(),
      });
    },
  });
};

// Delete academic session
const deleteAcademicSession = async (id: string) => {
  return clientRequest<DeleteAcademicSessionResponse>(adminClient, {
    url: `/api/admin/config/sessions/${id}`,
    method: 'DELETE',
  });
};

export const useDeleteAcademicSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAcademicSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: keys.list(),
      });
    },
  });
};

// Create new term
const createTerm = async (data: AddTermInput & { sessionId: string }) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/terms`,
    method: 'POST',
    data,
  });
};

export const useCreateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
};

// Update a session's status
const updateSessionStatus = async ({
  sessionId,
  status,
}: {
  sessionId: string;
  status: TermStatus;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/sessions/${sessionId}/status`,
    method: 'PATCH',
    data: { status },
  });
};

export const useUpdateSessionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSessionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
};

// Update a term's status
const updateTermStatus = async ({
  termId,
  status,
}: {
  termId: string;
  status: TermStatus;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/terms/${termId}/status`,
    method: 'PATCH',
    data: { status },
  });
};

export const useUpdateTermStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTermStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
};
