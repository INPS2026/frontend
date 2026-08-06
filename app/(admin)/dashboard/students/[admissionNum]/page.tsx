'use client';

import { TopBar } from '@/components/top-bar';
import { useGetStudentByAdmissionNo } from '@/service/api/admin/students.api';
import { use } from 'react';

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ admissionNum: string }>;
}) {
  const { admissionNum } = use(params);
  const {} = useGetStudentByAdmissionNo(admissionNum);

  return (
    <div className="space-y-4">
      <TopBar title="Student Profile" subtitle="Manage student activities" />

      <div className="p-4 bg-sidebar"></div>
    </div>
  );
}
