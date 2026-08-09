import { TermEnum, TERMS } from '@/types/term';
import { z } from 'zod';

export type HolidayType = 'PUBLIC' | 'SCHOOL' | 'EXAM';

export const calendarFormSchema = z
  .object({
    academicYear: z
      .string()
      .regex(/^\d{4}\/\d{4}$/, 'Must be in the format YYYY/YYYY'),
    term: z.enum(TERMS),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  });

export type CalendarFormInput = z.input<typeof calendarFormSchema>;
export type CalendarFormOutput = z.output<typeof calendarFormSchema>;

export const HOLIDAY_TYPES: HolidayType[] = ['PUBLIC', 'SCHOOL', 'EXAM'];

export const holidayFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    type: z.enum(['PUBLIC', 'SCHOOL', 'EXAM']),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  });

export type HolidayFormInput = z.input<typeof holidayFormSchema>;
export type HolidayFormOutput = z.output<typeof holidayFormSchema>;

export const TERM_ORDER: Record<TermEnum, number> = {
  FIRST_TERM: 0,
  SECOND_TERM: 1,
  THIRD_TERM: 2,
};

export const HOLIDAY_TYPE_STYLES: Record<
  HolidayType,
  { label: string; badge: string; dot: string; dayClassName: string }
> = {
  PUBLIC: {
    label: 'Public Holiday',
    badge: 'border-blue-200 bg-blue-100 text-blue-800',
    dot: 'bg-blue-500',
    dayClassName: 'bg-blue-100 text-blue-900 rounded-md',
  },
  SCHOOL: {
    label: 'School Holiday',
    badge: 'border-green-200 bg-green-100 text-green-800',
    dot: 'bg-green-500',
    dayClassName: 'bg-green-100 text-green-900 rounded-md',
  },
  EXAM: {
    label: 'Exam Period',
    badge: 'border-red-200 bg-red-100 text-red-800',
    dot: 'bg-red-500',
    dayClassName: 'bg-red-100 text-red-900 rounded-md',
  },
};

export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12

  // Nigerian academic calendar: First Term starts ~September.
  // Before September, we're still in the academic year that started last September.
  const startYear = month >= 9 ? year : year - 1;
  return `${startYear}/${startYear + 1}`;
}
