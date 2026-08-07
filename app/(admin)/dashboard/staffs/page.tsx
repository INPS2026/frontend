'use client';

import { TopBar } from '@/components/top-bar';
import { DataTable } from '@/components/ui/data-table';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { staffColumns } from '@/lib/columns/staff-columns';
import { useGetAllStaffs } from '@/service/api/admin/staffs.api';
import { useState } from 'react';

export default function AllStaffsPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });
  const { data: staffsData, isPending } = useGetAllStaffs({
    page: pagination.page,
    limit: pagination.limit,
    includeDeleted: true,
  });

  const staffs = staffsData?.data ?? [];
  const page = staffsData?.meta?.page ?? pagination.page;
  const totalPages = staffsData?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <TopBar
        title="Staff Profiles"
        subtitle="View and manage staff profiles"
      />

      <div className="p-4 bg-sidebar">
        <DataTable columns={staffColumns} data={staffs} />

        <PaginationControls
          page={page}
          totalPages={totalPages}
          isPending={isPending}
          onPageChange={(nextPage) =>
            setPagination((prev) => ({ ...prev, page: nextPage }))
          }
        />
      </div>
    </div>
  );
}
