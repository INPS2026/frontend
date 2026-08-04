import z from 'zod';
import { ApiResponse } from './api';
import { CLASSROOM_LEVELS, ClassroomLevel } from '@/lib/constants';

export const NewClassroomSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  level: z.enum(CLASSROOM_LEVELS),
});

export type NewClassroomFormInput = z.input<typeof NewClassroomSchema>;
export type NewClassroomFormOutput = z.output<typeof NewClassroomSchema>;

export type ClassroomTeacher = {
  staffId: string;
  firstName: string;
  lastName: string;
} | null;

export type Section = {
  id: string;
  name: string;
  classId: string;
  color: string | null;
  roomNumber: number | null;
  status: 'ACTIVE' | 'INACTIVE';
  currentEnrollment: number;
  classTeacher: ClassroomTeacher;
  assistantTeacher: ClassroomTeacher;
};

export type ClassRoom = {
  id: string;
  name: string;
  level: ClassroomLevel;
  status: 'ACTIVE' | 'INACTIVE';
  sections: Section[];
};

export type GetAllClassroomsResponse = ApiResponse<ClassRoom[]>;
export type GetClassroomByIdResponse = ApiResponse<ClassRoom>;
export type UpdateClassroomResponse = ApiResponse<ClassRoom>;
