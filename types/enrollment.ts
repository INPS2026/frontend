import { ApiResponse } from './api';
import { Student } from './student';
import { Term } from './term';

export type EnrollmentStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED';

export type GetEnrollmentsForClassroomParams = {
  academicYear: string;
  term: Term;
  status?: EnrollmentStatus;
};

export type GetEnrollmentsForClassroomResponse = ApiResponse<
  {
    id: string;
    student: Pick<Student, 'admissionNumber' | 'firstName' | 'lastName'>;
    status: EnrollmentStatus;
  }[]
>;
