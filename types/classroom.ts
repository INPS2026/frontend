import { ApiResponse } from './api';

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
  level: string;
  status: 'ACTIVE' | 'INACTIVE';
  sections: Section[];
};

export type GetAllClassroomsResponse = ApiResponse<ClassRoom[]>;
