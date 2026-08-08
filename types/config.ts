import { ApiResponse } from './api';
import { Term } from './term';

export type GetAllAcademicSessionsResponse = ApiResponse<
  {
    id: string;
    session: string;
    createdAt: string;
    terms: Term[];
  }[]
>;
