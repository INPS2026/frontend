'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { GetSubjectsAssignedToClassroomResponse } from '@/types/curriculum';

type Subject = Awaited<GetSubjectsAssignedToClassroomResponse>['data'][number];

export const subjectColumns: ColumnDef<Subject>[] = [
  {
    accessorKey: 'subject.subjectCode',
    header: 'Code',
    cell: ({ row }) => row.original.subject.subjectCode,
  },
  {
    accessorKey: 'subject.subjectName',
    header: 'Subject',
    cell: ({ row }) => row.original.subject.subjectName,
  },
];
