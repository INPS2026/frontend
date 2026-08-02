'use client';

import { TopBar } from '@/components/top-bar';
import { useGetChildProfile } from '@/service/api/parent/children.api';
import { use } from 'react';

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = use(params);
  const { data: childProfileData } = useGetChildProfile(studentId);

  return (
    <div>
      <TopBar title="Student Profile" />
    </div>
  );
}
