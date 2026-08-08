import { ApiResponse } from './api';
import { Staff } from './auth';

export type GetAllStaffResponse = ApiResponse<Staff[]>;
export type GetStaffByIdResponse = ApiResponse<{
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  email: string;
  phone: string;
  type: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}>;
