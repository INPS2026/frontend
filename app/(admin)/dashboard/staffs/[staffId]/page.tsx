'use client';

import { TopBar } from '@/components/top-bar';
import { useGetStaffById } from '@/service/api/admin/staffs.api';
import { use } from 'react';

export default function StaffProfilePage({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const { staffId } = use(params);
  const { data: staffData, isPending } = useGetStaffById(staffId);

  const staff = staffData?.data ?? {};

  return (
    <div className="space-y-4">
      <TopBar title="Staff Profile" subtitle="View and manage staff profile" />
    </div>
  );
}
