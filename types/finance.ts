import { ApiResponse } from './api';

export type GetClassroomFeeStructure = ApiResponse<{
  bills: {
    id: string;
    name: string;
    amount: number;
  }[];
  total: number;
}>;
