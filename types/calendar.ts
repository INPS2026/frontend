import { ApiResponse } from './api';
import { TermEnum } from './term';

export type HolidayType = 'PUBLIC' | 'SCHOOL' | 'EXAM';

export type Holiday = {
  id: string;
  calendarId: string;
  name: string;
  startDate: string;
  endDate: string;
  type: HolidayType;
  createdAt: string;
  deletedAt: string | null;
};

export type Calendar = {
  id: string;
  academicYear: string;
  term: TermEnum;
  startDate: string;
  endDate: string;
  holidays: Holiday[];
};

export type GetSchoolCalendarsResponse = ApiResponse<Calendar[]>;
