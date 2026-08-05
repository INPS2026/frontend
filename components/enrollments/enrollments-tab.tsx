'use client';

import { DataTable } from '@/components/ui/data-table';
import { enrollmentColumns } from './enrollment-columns';
import { useGetEnrollmentsForClassroom } from '@/service/api/admin/enrollments.api';
import { useMemo, useState } from 'react';
import { GetEnrollmentsForClassroomParams } from '@/types/enrollment';
import { TERMS, Term } from '@/types/term';
import { EnrollmentStatus } from '@/types/enrollment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldLabel } from '@/components/ui/field';

type EnrollmentsTabProps = {
  classroomId: string;
};

const STATUS_OPTIONS: (EnrollmentStatus | 'ALL')[] = [
  'ALL',
  'ACTIVE',
  'PENDING',
  'COMPLETED',
];

// function getAcademicYearOptions() {
//   const currentYear = new Date().getFullYear();
//   const years: string[] = [];
//   for (let offset = -2; offset <= 1; offset++) {
//     const start = currentYear + offset;
//     years.push(`${start}/${start + 1}`);
//   }
//   return years;
// }

export function EnrollmentsTab({ classroomId }: EnrollmentsTabProps) {
  const academicYearOptions = useMemo(function getAcademicYearOptions() {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];
    for (let offset = -2; offset <= 1; offset++) {
      const start = currentYear + offset;
      years.push(`${start}/${start + 1}`);
    }
    return years;
  }, []);

  const [params, setParams] = useState<GetEnrollmentsForClassroomParams>({
    academicYear: '2024/2025',
    term: 'FIRST_TERM',
    status: 'ACTIVE',
  });

  const { data, isLoading } = useGetEnrollmentsForClassroom(
    classroomId,
    params,
  );

  const enrollments = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Field>
          <FieldLabel htmlFor="academicYear">Academic Year</FieldLabel>
          <Select
            value={params.academicYear}
            onValueChange={(value) => {
              if (!value) return;
              setParams((prev) => ({ ...prev, academicYear: value }));
            }}
          >
            <SelectTrigger id="academicYear" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {academicYearOptions.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="term">Term</FieldLabel>
          <Select
            value={params.term}
            onValueChange={(value) =>
              setParams((prev) => ({ ...prev, term: value as Term }))
            }
          >
            <SelectTrigger id="term" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TERMS.map((term) => (
                <SelectItem key={term} value={term}>
                  {formatTerm(term)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <Select
            value={params.status ?? 'ALL'}
            onValueChange={(value) =>
              setParams((prev) => ({
                ...prev,
                status:
                  value === 'ALL' ? undefined : (value as EnrollmentStatus),
              }))
            }
          >
            <SelectTrigger id="status" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === 'ALL' ? 'All' : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading enrollments...</p>
      ) : (
        <DataTable columns={enrollmentColumns} data={enrollments} />
      )}
    </div>
  );
}

function formatTerm(term: Term) {
  return term
    .split('_')
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(' ');
}
