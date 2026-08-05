'use client';

import { TopBar } from '@/components/top-bar';
import { use } from 'react';

export default function ManageSectionPage({
  params,
}: {
  params: Promise<{ classroomId: string; sectionId: string }>;
}) {
  const { classroomId, sectionId } = use(params);

  return (
    <div className="space-y-4">
      <TopBar title="Section Management" />
    </div>
  );
}
