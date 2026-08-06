import { ApiResponse } from './api';

export type GetSubjectsAssignedToClassroomResponse = ApiResponse<
  {
    id: string;
    subject: {
      subjectName: string;
      subjectCode: string;
    };
    termId: string;
  }[]
>;

export type AssignSingleSubjectResponse = ApiResponse<{
  id: string;
  classId: string;
  subjectId: string;
  termId: string;
}>;

export type AssignMultipleSubjectsToClassResponse = ApiResponse<{
  added: number;
  skipped: number;
  curriculum: {
    id: string;
    subject: {
      subjectName: string;
      subjectCode: string;
    };
  }[];
}>;
