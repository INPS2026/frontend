'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { GetEnrollmentsForClassroomResponse } from '@/types/enrollment';

type Enrollment = Awaited<GetEnrollmentsForClassroomResponse>['data'][number];

export const enrollmentColumns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: 'student.admissionNumber',
    header: 'Admission No.',
    cell: ({ row }) => row.original.student.admissionNumber,
  },
  {
    id: 'name',
    header: 'Student Name',
    cell: ({ row }) => {
      const { firstName, lastName } = row.original.student;
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button size="sm" variant="outline">
        <Link href={`/dashboard/students/${row.original.id}`}>View</Link>
      </Button>
    ),
  },
];

function statusVariant(status: Enrollment['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'PENDING':
      return 'outline';
    case 'COMPLETED':
      return 'secondary';
    default:
      status satisfies never;
      return 'outline';
  }
}
