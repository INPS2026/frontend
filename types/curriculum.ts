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
