// components/curriculum/curriculum-tab.tsx
'use client';

import { DataTable } from '@/components/ui/data-table';
import { useGetSubjectsAssignedToClassroom } from '@/service/api/admin/curriculums.api';
import { useGetActiveTerm } from '@/service/api/admin/terms.api';
import { Badge } from '@/components/ui/badge';
import { subjectColumns } from '@/lib/columns/subject-columns';

type CurriculumTabProps = {
  classroomId: string;
};

export function CurriculumTab({ classroomId }: CurriculumTabProps) {
  const { data: activeTermData, isLoading: isLoadingTerm } = useGetActiveTerm();

  const activeTerm = activeTermData?.data;

  const { data, isLoading: isLoadingSubjects } =
    useGetSubjectsAssignedToClassroom(classroomId, activeTerm?.id ?? '');

  if (isLoadingTerm) {
    return <p className="text-muted-foreground text-sm">Loading term...</p>;
  }

  if (!activeTerm) {
    return (
      <p className="text-muted-foreground text-sm">No active term found.</p>
    );
  }

  const subjects = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">{formatTerm(activeTerm.term)}</Badge>
        <span className="text-muted-foreground text-sm">
          {formatDateRange(activeTerm.startDate, activeTerm.endDate)}
        </span>
      </div>

      {isLoadingSubjects ? (
        <p className="text-muted-foreground text-sm">Loading curriculum...</p>
      ) : (
        <DataTable columns={subjectColumns} data={subjects} />
      )}
    </div>
  );
}

function formatTerm(term: string) {
  return term
    .split('_')
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(' ');
}

function formatDateRange(startDate: string, endDate: string) {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const start = new Date(startDate).toLocaleDateString('en-US', options);
  const end = new Date(endDate).toLocaleDateString('en-US', options);
  return `${start} – ${end}`;
}
