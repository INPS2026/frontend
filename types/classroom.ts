import z from 'zod';
import { ApiResponse } from './api';
import { Section } from './section';

export const CLASSROOM_LEVELS = [
  'DAYCARE',
  'PRENURSERY',
  'NURSERY_1',
  'NURSERY_2',
  'NURSERY_3',
  'PRIMARY_1',
  'PRIMARY_2',
  'PRIMARY_3',
  'PRIMARY_4',
  'PRIMARY_5',
  'PRIMARY_6',
] as const;

export type ClassroomLevel = (typeof CLASSROOM_LEVELS)[number];

export const NewClassroomSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  level: z.enum(CLASSROOM_LEVELS),
});

export type NewClassroomFormInput = z.input<typeof NewClassroomSchema>;
export type NewClassroomFormOutput = z.output<typeof NewClassroomSchema>;

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
