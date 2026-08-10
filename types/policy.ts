import { ApiResponse } from './api';
import { TermEnum } from './term';

export type Policy = {
  id: string;
  academicYear: string;
  term: TermEnum;
  maxStudentsPerClass: number;
  minAverageScore: number;
  minAttendancePercentage: number;
  maxFailedSubjects: number;
  passMark: number;
  creditMark: number;
  distinctionMark: number;
};

export type GetPolicyConfigurationResponse = ApiResponse<Policy[]>;
