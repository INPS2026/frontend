'use client';

interface EnrollmentsTabProps {
  admissionNumber: string;
}

export function EnrollmentsTab({ admissionNumber }: EnrollmentsTabProps) {
  return <div>Enrollments for {admissionNumber}</div>;
}
