import { ApiResponse } from './api';
import { ClassRoom } from './classroom';
import { Section } from './section';
import { Student } from './student';
import { Term } from './term';

export type EnrollmentStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED';

export type Enrollment = {
  id: string;
  classId: string;
  sectionId: string;
  academicYear: string;
  term: Term;
  status: EnrollmentStatus;
  transferredAt: string;
  previousSectionId: string;
  transferCount: number;
  createdAt: string;
  updatedAt: string;
  class: ClassRoom;
  section: Section;
};

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

export type GetActiveStudentEnrollment = ApiResponse<Enrollment>;
