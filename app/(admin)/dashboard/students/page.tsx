'use client';

import { TopBar } from '@/components/top-bar';
import { DataTable } from '@/components/ui/data-table';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { studentColumns } from '@/lib/columns/student-columns';
import { useGetStudents } from '@/service/api/admin/students.api';
import { useState } from 'react';

export default function AllStudentPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });
  const {
    data: studentsData,
    isPending,
    isLoading,
  } = useGetStudents(pagination);

  const students = studentsData?.data ?? [];
  const page = studentsData?.meta?.page ?? pagination.page;
  const totalPages = studentsData?.meta?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TopBar title="All Students" subtitle="View and manage all students" />
        <div className="p-4 bg-sidebar">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TopBar title="All Students" subtitle="View and manage all students" />

      <div className="p-4 bg-sidebar">
        <DataTable columns={studentColumns} data={students} />

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
