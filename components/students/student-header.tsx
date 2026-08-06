'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GetStudentByAdmissionNoResponse } from '@/types/student';
import { DeleteStudentDialog } from './delete-student-dialog';
import { useRouter } from 'next/navigation';

type Student = Awaited<GetStudentByAdmissionNoResponse>['data'];

interface StudentHeaderProps {
  student: Student | undefined;
  onUpdate: () => void;
}

export function StudentHeader({ student, onUpdate }: StudentHeaderProps) {
  const router = useRouter();

  if (!student) {
    return <div className="h-20 animate-pulse rounded-md bg-muted" />;
  }

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {student.firstName} {student.lastName}
          </h2>
          <Badge variant="outline">{student.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Admission No: {student.admissionNumber} &middot; {student.gender}
        </p>
        <p className="text-sm text-muted-foreground">
          Parent: {student.parent.accountEmail} &middot;{' '}
          {student.parent.accountPhone}
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onUpdate}>
          Update
        </Button>
        <DeleteStudentDialog
          admissionNumber={student.admissionNumber}
          studentName={`${student.firstName} ${student.lastName}`}
          onSuccess={() => router.push('/admin/students')}
        />
      </div>
    </div>
  );
}
