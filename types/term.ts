import z from 'zod';
import { ApiResponse } from './api';

export const TERMS = ['FIRST_TERM', 'SECOND_TERM', 'THIRD_TERM'] as const;
export type TermEnum = (typeof TERMS)[number];

export type TermStatus = 'CURRENT' | 'UPCOMING' | 'COMPLETED';

export const addTermSchema = z
  .object({
    term: z.enum(TERMS),
    startDate: z.date('Start date is required'),
    endDate: z.date('End date is required'),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type AddTermInput = z.input<typeof addTermSchema>;
export type AddTermOutput = z.output<typeof addTermSchema>;

export type Term = {
  id: string;
  term: TermEnum;
  status: TermStatus;
  startDate: string;
  endDate: string;
  sessionId: string;
};

export type GetActiveTermResponse = ApiResponse<Term>;
