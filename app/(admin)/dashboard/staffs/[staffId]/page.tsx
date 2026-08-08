'use client';

import { TopBar } from '@/components/top-bar';
import { StaffHeader } from '@/components/staff/staff-header';
import { useGetStaffById } from '@/service/api/admin/staffs.api';
import { use } from 'react';

export default function StaffProfilePage({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const { staffId } = use(params);
  const { data: staffData, isPending } = useGetStaffById(staffId);

  const staff = staffData?.data;

  if (isPending) {
    return (
      <div className="space-y-4">
        <TopBar
          title="Staff Profile"
          subtitle="View and manage staff profile"
        />
        <div className="bg-sidebar p-4">
          <p>Loading staff profile...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="space-y-4">
        <TopBar
          title="Staff Profile"
          subtitle="View and manage staff profile"
        />
        <div className="bg-sidebar p-4">
          <p>Staff profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TopBar title="Staff Profile" subtitle="View and manage staff profile" />
      <div className="px-4">
        <StaffHeader staff={staff} />
      </div>
    </div>
  );
}
