import { ApiResponse } from './api';
import { Student } from './student';

export type EnrollmentStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED';

export type GetEnrollmentsForClassResponse = ApiResponse<
  {
    id: string;
    student: Pick<Student, 'admissionNumber' | 'firstName' | 'lastName'>;
    status: EnrollmentStatus;
  }[]
>;
