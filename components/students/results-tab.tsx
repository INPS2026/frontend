'use client';

interface ResultsTabProps {
  admissionNumber: string;
}

export function ResultsTab({ admissionNumber }: ResultsTabProps) {
  return <div>Results for {admissionNumber}</div>;
}
