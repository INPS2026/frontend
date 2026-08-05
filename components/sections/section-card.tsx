'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { SectionTeacher, Section } from '@/types/section';

type SectionCardProps = {
  section: Section;
};

export function SectionCard({ section }: SectionCardProps) {
  const {
    id,
    classId,
    name,
    color,
    roomNumber,
    status,
    currentEnrollment,
    classTeacher,
    assistantTeacher,
  } = section;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-2">
          {color && (
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden
            />
          )}
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-muted-foreground text-sm">
              {roomNumber != null ? `Room ${roomNumber}` : 'No room assigned'}
            </p>
          </div>
        </div>
        <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm">
          <span className="text-muted-foreground">Enrollment: </span>
          {currentEnrollment}
        </p>

        <div className="space-y-2">
          <TeacherRow label="Class Teacher" teacher={classTeacher} />
          <TeacherRow label="Assistant Teacher" teacher={assistantTeacher} />
        </div>

        <Button size="sm" className="w-full">
          <Link href={`/dashboard/classrooms/${classId}/sections/${id}`}>
            Manage
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function TeacherRow({
  label,
  teacher,
}: {
  label: string;
  teacher: SectionTeacher;
}) {
  if (!teacher) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">Unassigned</span>
      </div>
    );
  }

  const fullName = `${teacher.firstName} ${teacher.lastName}`;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Avatar className="size-6">
        <AvatarFallback>{teacher.firstName[0]}</AvatarFallback>
      </Avatar>
      <span className="text-muted-foreground">{label}:</span>
      <span>{fullName}</span>
    </div>
  );
}
