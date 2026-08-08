import { ApiResponse } from './api';

export const TERMS = ['FIRST_TERM', 'SECOND_TERM', 'THIRD_TERM'] as const;
export type TermEnum = (typeof TERMS)[number];

export type TermStatus = 'CURRENT' | 'UPCOMING';

export type Term = {
  id: string;
  term: TermEnum;
  status: TermStatus;
  startDate: string;
  endDate: string;
  sessionId: string;
};

export type GetActiveTermResponse = ApiResponse<Term>;
