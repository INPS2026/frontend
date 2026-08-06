'use client';

import { Button } from '@/components/ui/button';
import type { Student } from '@/types/student';
import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import Link from 'next/link';

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
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original;

      return (
        <div className="space-x-2">
          <Button variant="link" size="sm">
            <Link href={`/dashboard/students/${student.admissionNumber}`}>
              View Profile
            </Link>
          </Button>
          <Button size="sm" variant="destructive">
            <Trash />
            Delete
          </Button>
        </div>
      );
    },
  },
];
