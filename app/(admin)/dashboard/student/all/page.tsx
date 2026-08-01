import { TopBar } from '@/components/top-bar';
import { DataTable } from '@/components/ui/data-table';
import { studentTableColumns } from '@/lib/columns/student';

export default function AllStudentPage() {
  return (
    <div className="space-y-4">
      <TopBar title="All Students" subtitle="View and manage all students" />

      <div className="p-4 bg-sidebar">
        <DataTable columns={studentTableColumns} data={[]} />
      </div>
    </div>
  );
}
