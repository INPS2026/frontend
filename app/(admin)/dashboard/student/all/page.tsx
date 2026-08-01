'use client';

import { TopBar } from '@/components/top-bar';
import { DataTable } from '@/components/ui/data-table';
import { studentColumns } from '@/lib/columns/student';
import { useGetStudents } from '@/service/api/admin/students.api';

export default function AllStudentPage() {
  const { data: studentsData } = useGetStudents();

  const students = studentsData?.data ?? [];

  return (
    <div className="space-y-4">
      <TopBar title="All Students" subtitle="View and manage all students" />

      <div className="p-4 bg-sidebar">
        <DataTable columns={studentColumns} data={students} />
      </div>
    </div>
  );
}
