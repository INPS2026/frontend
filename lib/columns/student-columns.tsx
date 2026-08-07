'use client';

import { DeleteStudentDialog } from '@/components/students/delete-student-dialog';
import { Button } from '@/components/ui/button';
import type { Student } from '@/types/student';
import { ColumnDef } from '@tanstack/react-table';
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
      const fullName = `${student.firstName} ${student.lastName}`;

      return (
        <div className="space-x-2">
          <Button variant="link" size="sm">
            <Link href={`/dashboard/students/${student.admissionNumber}`}>
              View Profile
            </Link>
          </Button>
          <DeleteStudentDialog
            admissionNumber={student.admissionNumber}
            studentName={fullName}
          />
        </div>
      );
    },
  },
];
