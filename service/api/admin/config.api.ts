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
import { AddTermInput, TermEnum, TermStatus } from '@/types/term';
import { GetSchoolCalendarsResponse } from '@/types/calendar';
import { CalendarFormOutput, HolidayFormOutput } from '@/lib/calendar-utils';

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

// Update term's details (dates)
const updateTermDates = async ({
  termId,
  data,
}: {
  termId: string;
  data: Pick<AddTermInput, 'startDate' | 'endDate'>;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/terms/${termId}`,
    method: 'PATCH',
    data,
  });
};

export const useUpdateTermDates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTermDates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
};

// Delete a term
const deleteTerm = async (termId: string) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/terms/${termId}`,
    method: 'DELETE',
  });
};

export const useDeleteTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.list() });
    },
  });
};

// Get school calendars with holidays
const getSchoolCalendars = async (params: {
  academicYear: string | undefined;
  term: TermEnum | undefined;
}) => {
  return clientRequest<GetSchoolCalendarsResponse>(adminClient, {
    url: '/api/admin/config/calendars',
    method: 'GET',
    params,
  });
};

export const useGetSchoolCalendars = (params: {
  academicYear: string | undefined;
  term: TermEnum | undefined;
}) => {
  return useQuery({
    queryKey: keys.list(params),
    queryFn: async () => getSchoolCalendars(params),
    enabled: !!params.academicYear && !!params.term,
  });
};

// Create a new school calendar
const createSchoolCalendar = async (data: CalendarFormOutput) => {
  return clientRequest(adminClient, {
    url: '/api/admin/config/calendars',
    method: 'POST',
    data,
  });
};

export const useCreateSchoolCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchoolCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() }); // was keys.list()
    },
  });
};

// Update school calendar
const updateSchoolCalendar = async ({
  calendarId,
  data,
}: {
  calendarId: string;
  data: CalendarFormOutput;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/calendars/${calendarId}`,
    method: 'PATCH',
    data,
  });
};

export const useUpdateSchoolCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSchoolCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() }); // was keys.list()
    },
  });
};

// Add holiday to calendar
const addHoliday = async (data: HolidayFormOutput & { calendarId: string }) => {
  return clientRequest(adminClient, {
    url: '/api/admin/config/calendars/holidays',
    method: 'POST',
    data,
  });
};

export const useAddHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};

// Update holiday to calendar
const updateHoliday = async ({
  holidayId,
  data,
}: {
  holidayId: string;
  data: HolidayFormOutput;
}) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/calendars/holidays/${holidayId}`,
    method: 'PATCH',
    data,
  });
};

export const useUpdateHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};

// Remove holiday from calendar
const removeHoliday = async (holidayId: string) => {
  return clientRequest(adminClient, {
    url: `/api/admin/config/calendars/holidays/${holidayId}`,
    method: 'DELETE',
  });
};

export const useRemoveHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },
  });
};
