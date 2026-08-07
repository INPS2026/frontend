'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GetStudentByAdmissionNoResponse } from '@/types/student';
import { DeleteStudentDialog } from './delete-student-dialog';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { formatDate } from '@/lib/format';

type Student = Awaited<GetStudentByAdmissionNoResponse>['data'];

interface StudentHeaderProps {
  student: Student | undefined;
  onUpdate: () => void;
}

export function StudentHeader({ student, onUpdate }: StudentHeaderProps) {
  const router = useRouter();

  if (!student) {
    return <div className="h-28 animate-pulse rounded-md bg-muted" />;
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const initials =
    `${student.firstName[0] ?? ''}${student.lastName[0] ?? ''}`.toUpperCase();
  const parent = student.parent;
  const parentSummary = parent
    ? `${parent.accountEmail ?? 'No email'} · ${parent.accountPhone ?? 'No phone'}`
    : 'Parent details unavailable';

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={student.passportPhoto ?? undefined}
            alt={fullName}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{fullName}</h2>
            <Badge variant="outline">{student.status}</Badge>
            <Badge variant="secondary">{student.intakeType}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Admission No: {student.admissionNumber} &middot; {student.gender}{' '}
            &middot; DOB: {formatDate(student.dateOfBirth)}
          </p>

          <p className="text-sm text-muted-foreground">
            {student.nationality} &middot; {student.state}, {student.lga}{' '}
            &middot; {student.sportHouse} House
          </p>

          <p className="text-sm text-muted-foreground">
            Admitted: {formatDate(student.admissionDate)}
            {student.graduationDate &&
              ` · Graduated: ${formatDate(student.graduationDate)}`}
          </p>

          <HoverCard>
            <HoverCardTrigger
              render={
                <button
                  type="button"
                  className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                  Parent: {parentSummary}
                </button>
              }
            />
            {parent && (
              <HoverCardContent className="w-80 space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Father
                  </p>
                  <p className="text-sm">
                    {parent.fatherFirstName} {parent.fatherLastName} &middot;{' '}
                    {parent.fatherOccupation}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {parent.fatherEmail} &middot; {parent.fatherPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Mother
                  </p>
                  <p className="text-sm">
                    {parent.motherFirstName} {parent.motherLastName} &middot;{' '}
                    {parent.motherOccupation}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {parent.motherEmail} &middot; {parent.motherPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Household
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {parent.address} &middot; {parent.maritalStatus}
                  </p>
                </div>
              </HoverCardContent>
            )}
          </HoverCard>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button variant="outline" onClick={onUpdate}>
          Update
        </Button>
        <DeleteStudentDialog
          admissionNumber={student.admissionNumber}
          studentName={fullName}
          onSuccess={() => router.push('/dashboard/students')}
        />
      </div>
    </div>
  );
}
