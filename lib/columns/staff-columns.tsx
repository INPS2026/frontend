'use client';

import { Button } from '@/components/ui/button';
import { Staff } from '@/types/auth';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const staffColumns: ColumnDef<Staff>[] = [
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
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const staff = row.original;
      // const fullName = `${staff.firstName} ${staff.lastName}`;

      return (
        <div className="space-x-2">
          <Button variant="link" size="sm">
            <Link href={`/dashboard/staffs/${staff.staffId}`}>
              View Profile
            </Link>
          </Button>
          {/* <DeleteStaffDialog
            admissionNumber={staff.admissionNumber}
            staffName={fullName}
          /> */}
        </div>
      );
    },
  },
];
