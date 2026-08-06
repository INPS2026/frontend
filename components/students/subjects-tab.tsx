'use client';

interface SubjectsTabProps {
  admissionNumber: string;
}

export function SubjectsTab({ admissionNumber }: SubjectsTabProps) {
  return <div>Subjects for {admissionNumber}</div>;
}
