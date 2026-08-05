'use client';

import type { Student } from '@/types/student';
import { ColumnDef } from '@tanstack/react-table';

export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'admissionNumber',
    header: 'Admission Number',
  },
];
