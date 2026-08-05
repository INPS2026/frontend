import { ApiResponse } from './api';

export const TERMS = ['FIRST_TERM', 'SECOND_TERM', 'THIRD_TERM'] as const;
export type Term = (typeof TERMS)[number];

export type TermStatus = 'CURRENT';

export type GetActiveTermResponse = ApiResponse<{
  id: string;
  term: string;
  status: TermStatus;
  startDate: string;
  endDate: string;
  sessionId: string;
}>;
