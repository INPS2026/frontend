import z from 'zod';
import { ApiResponse } from './api';
import { Staff } from './auth';
import { GenderEnum, GENDERS, RoleEnum, ROLES } from '@/lib/constants';

export const staffFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  role: z.enum(ROLES, 'Role is required'),
  gender: z.enum(GENDERS, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(1, 'Address is required'),
});

export type StaffFormInput = z.input<typeof staffFormSchema>;
export type StaffFormOutput = z.output<typeof staffFormSchema>;

export type CreateStaffResponse = ApiResponse<Staff>;
export type UpdateStaffResponse = ApiResponse<Staff>;
export type GetAllStaffResponse = ApiResponse<Staff[]>;
export type GetStaffByIdResponse = ApiResponse<{
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: GenderEnum;
  address: string;
  email: string;
  phone: string;
  type: string;
  role: RoleEnum;
  status: 'ACTIVE' | 'INACTIVE';
}>;
